import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth/next';
import DiscordProvider from 'next-auth/providers/discord';

import prisma from '../../../lib/prisma';
import { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    }),
  ],
};

export default NextAuth(authOptions);
