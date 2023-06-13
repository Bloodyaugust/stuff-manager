import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from './prisma';

export default async function getSessionAndAccount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  let account;

  if (session?.user.id) {
    account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
      },
    });
  }

  return { session, account };
}
