import prisma from '@/lib/prisma';
import { Box, Place } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import getSessionAndAccount from '@/lib/authEndpoint';
import { HydratedThing } from './thing';

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        things: HydratedThing[];
        places: Place[];
        boxes: Box[];
      }
    | Error
  >
) {
  try {
    const { session, account } = await getSessionAndAccount(req, res);

    if (!session || !account) {
      res.status(401).json({ message: 'Please sign in' });
      return;
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: req.cookies.workspace as string,
      },
    });

    if (!workspace) {
      res.status(401).json({ message: 'Please select a workspace' });
      return;
    }

    if (req.method === 'POST') {
      const { search } = req.body;

      const things = await prisma.thing.findMany({
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
        where: {
          workspaceId: workspace.id,
          name: {
            search,
          },
          description: {
            search,
          },
        },
      });
      const hydratedThings = await Promise.all(
        things.map(async (thing) => {
          return {
            thing,
            image: await prisma.image.findFirst({
              where: {
                thingId: thing.id,
              },
            }),
          };
        })
      );
      const places = await prisma.place.findMany({
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
        where: {
          workspaceId: workspace.id,
          name: {
            search,
          },
        },
      });
      const boxes = await prisma.box.findMany({
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
        where: {
          workspaceId: workspace.id,
          name: {
            search,
          },
        },
      });

      res.status(200).json({
        things: hydratedThings,
        places,
        boxes,
      });
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: JSON.stringify(e) });
    return;
  }

  res.status(500).json({ message: 'Method not allowed' });
}
