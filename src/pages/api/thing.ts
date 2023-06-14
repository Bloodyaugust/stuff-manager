import prisma from '@/lib/prisma';
import { Image, Thing } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import getSessionAndAccount from '@/lib/authEndpoint';

type Error = {
  message: string;
};

export type HydratedThing = {
  image?: Image | null;
  thing: Thing;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HydratedThing[] | Error>
) {
  try {
    const { session, account } = await getSessionAndAccount(req, res);

    if (!session || !account) {
      res.status(401).json({ message: 'Please sign in' });
      return;
    }

    if (req.method === 'GET') {
      const things = await prisma.thing.findMany({
        where: {
          createdBy: account.id,
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
      res.status(200).json([...hydratedThings]);
      return;
    }

    if (req.method === 'POST') {
      const { name, boxId }: { name: string; boxId?: string } = req.body;
      res.status(200).json([
        {
          thing: await prisma.thing.create({
            data: { name, boxId, createdBy: account.id, updatedBy: account.id },
          }),
          image: null,
        },
      ]);
      return;
    }

    if (req.method === 'PATCH') {
      const { id, name, boxId }: { id: string; name?: string; boxId?: string } =
        req.body;
      const updatingThing = await prisma.thing.findFirst({
        where: {
          id,
          createdBy: account.id,
        },
      });

      if (updatingThing) {
        res.status(200).json([
          {
            thing: await prisma.thing.update({
              where: { id: id },
              data: { name, boxId, updatedBy: account.id },
            }),
            image: await prisma.image.findFirst({
              where: {
                thingId: updatingThing.id,
              },
            }),
          },
        ]);
      } else {
        res.status(404).json({ message: 'Could not find thing' });
      }

      return;
    }

    if (req.method === 'DELETE') {
      const { id }: { id: string } = req.query as { id: string };
      const deletingThing = await prisma.thing.findFirst({
        where: {
          id,
          createdBy: account.id,
        },
      });

      if (deletingThing) {
        res.status(200).json([
          {
            thing: await prisma.thing.delete({
              where: { id: id },
            }),
            image: null,
          },
        ]);
      } else {
        res.status(404).json({ message: 'Could not find thing' });
      }

      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: JSON.stringify(e) });
    return;
  }

  res.status(500).json({ message: 'Method not allowed' });
}
