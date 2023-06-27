import prisma from '@/lib/prisma';
import { Place } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import getSessionAndAccount from '@/lib/authEndpoint';

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Place[] | Error>
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

    if (req.method === 'GET') {
      res.status(200).json(
        await prisma.place.findMany({
          orderBy: [
            {
              updatedAt: 'desc',
            },
          ],
          where: {
            workspaceId: workspace.id,
          },
        })
      );
      return;
    }

    if (req.method === 'POST') {
      const { name } = req.body;
      res.status(200).json([
        await prisma.place.create({
          data: {
            name,
            workspaceId: workspace.id,
            createdBy: account.id,
            updatedBy: account.id,
          },
        }),
      ]);
      return;
    }

    if (req.method === 'DELETE') {
      const { id }: { id: string } = req.query as { id: string };
      const deletingPlace = await prisma.place.findFirst({
        where: {
          id,
          OR: [
            {
              createdBy: account.id,
            },
            {
              workspaceId: workspace.id,
            },
          ],
        },
      });

      if (deletingPlace) {
        res.status(200).json([
          await prisma.place.delete({
            where: { id: id },
          }),
        ]);
      } else {
        res.status(404).json({ message: 'Could not find place' });
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
