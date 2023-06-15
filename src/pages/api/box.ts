import prisma from '@/lib/prisma';
import { Box } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import getSessionAndAccount from '@/lib/authEndpoint';

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Box[] | Error>
) {
  try {
    const { session, account } = await getSessionAndAccount(req, res);

    if (!session || !account) {
      res.status(401).json({ message: 'Please sign in' });
      return;
    }

    if (req.method === 'GET') {
      res.status(200).json(
        await prisma.box.findMany({
          orderBy: [
            {
              updatedAt: 'desc',
            },
          ],
          where: {
            createdBy: account.id,
          },
        })
      );
      return;
    }

    if (req.method === 'POST') {
      const { name, placeId }: { name: string; placeId?: string } = req.body;
      res.status(200).json([
        await prisma.box.create({
          data: {
            name,
            placeId,
            createdBy: account.id,
            updatedBy: account.id,
          },
        }),
      ]);
      return;
    }

    if (req.method === 'PATCH') {
      const {
        id,
        name,
        placeId,
      }: { id: string; name?: string; placeId?: string } = req.body;
      const updatingBox = await prisma.box.findFirst({
        where: {
          id,
          createdBy: account.id,
        },
      });

      if (updatingBox) {
        res.status(200).json([
          await prisma.box.update({
            where: { id: id },
            data: { name, placeId, updatedBy: account.id },
          }),
        ]);
      } else {
        res.status(404).json({ message: 'Could not find box' });
      }

      return;
    }

    if (req.method === 'DELETE') {
      const { id }: { id: string } = req.query as { id: string };
      const deletingBox = await prisma.box.findFirst({
        where: {
          id,
          createdBy: account.id,
        },
      });

      if (deletingBox) {
        res.status(200).json([
          await prisma.box.delete({
            where: { id: id },
          }),
        ]);
      } else {
        res.status(404).json({ message: 'Could not find box' });
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
