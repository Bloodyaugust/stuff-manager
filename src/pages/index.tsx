import Shell from '@/components/Shell';
import { Text } from '@mantine/core';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Stuff Manager</title>
        <meta name="description" content="Manage your stuff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Shell>
          <Text>Hello World!</Text>
        </Shell>
      </main>
    </>
  );
}
