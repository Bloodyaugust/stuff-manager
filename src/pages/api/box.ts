import prisma from '@/lib/prisma';
import { Place } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Place[] | Error>
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({ message: 'Please sign in' });
      return;
    }

    if (req.method === 'GET') {
      res.status(200).json(await prisma.box.findMany());
      return;
    }

    if (req.method === 'POST') {
      const { name, placeId }: { name: string; placeId?: string } = req.body;
      res
        .status(200)
        .json([await prisma.box.create({ data: { name, placeId } })]);
      return;
    }

    if (req.method === 'PATCH') {
      const {
        id,
        name,
        placeId,
      }: { id: string; name?: string; placeId?: string } = req.body;
      res.status(200).json([
        await prisma.box.update({
          where: { id: id },
          data: { name, placeId },
        }),
      ]);
      return;
    }
  } catch (e) {
    res.status(500).json({ message: JSON.stringify(e) });
    return;
  }

  res.status(500).json({ message: 'Method not allowed' });
}
