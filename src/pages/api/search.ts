import prisma from '@/lib/prisma';
import { Box, Place, Thing } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import getSessionAndAccount from '@/lib/authEndpoint';

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        things: Thing[];
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

    if (req.method === 'POST') {
      const { search } = req.body;

      const things = await prisma.thing.findMany({
        where: {
          createdBy: account.id,
          name: {
            search,
          },
        },
      });
      const places = await prisma.place.findMany({
        where: {
          createdBy: account.id,
          name: {
            search,
          },
        },
      });
      const boxes = await prisma.box.findMany({
        where: {
          createdBy: account.id,
          name: {
            search,
          },
        },
      });

      res.status(200).json({
        things,
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
