import prisma from '@/lib/prisma';
import { Workspace } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import getSessionAndAccount from '@/lib/authEndpoint';

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Workspace[] | Error>
) {
  try {
    const { session, account } = await getSessionAndAccount(req, res);

    if (!session || !account) {
      res.status(401).json({ message: 'Please sign in' });
      return;
    }

    if (req.method === 'GET') {
      res.status(200).json(
        await prisma.workspace.findMany({
          orderBy: [
            {
              updatedAt: 'desc',
            },
          ],
          where: {
            OR: [
              {
                createdBy: account.id,
              },
              {
                collaborators: {
                  has: account.id,
                },
              },
            ],
          },
        })
      );
      return;
    }

    if (req.method === 'POST') {
      const { name }: { name: string } = req.body;
      res.status(200).json([
        await prisma.workspace.create({
          data: {
            name,
            createdBy: account.id,
            updatedBy: account.id,
          },
        }),
      ]);
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: JSON.stringify(e) });
    return;
  }

  res.status(500).json({ message: 'Method not allowed' });
}
