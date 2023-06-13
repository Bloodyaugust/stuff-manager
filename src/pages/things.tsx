import Shell from '@/components/Shell';
import ThingCard from '@/components/ThingCard';
import queryClient from '@/lib/query';
import { createThing, getThings } from '@/lib/thing/queries';
import { Button, Group, Input, Skeleton, Stack } from '@mantine/core';
import { Thing } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useState } from 'react';

export default function Things() {
  const { data: things }: { data: Thing[] | undefined } = useQuery({
    queryKey: ['things'],
    queryFn: getThings,
  });

  const [newThingName, setNewThingName] = useState<string>('');
  const { mutate: mutateNewThing } = useMutation({
    mutationFn: createThing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['things'] });
      setNewThingName('');
    },
  });

  return (
    <>
      <Head>
        <title>Stuff Manager - Things</title>
        <meta name="description" content="Manage your stuff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Shell>
          <Stack>
            <Group
              style={{
                position: 'sticky',
                top: 60,
                backgroundColor: '#1A1B1E',
                zIndex: 2,
                paddingTop: 10,
                paddingBottom: 10,
              }}
              position="apart"
            >
              <Input
                placeholder="Thing Name"
                onChange={(e) => setNewThingName(e.target.value)}
                value={newThingName}
              />
              <Button
                disabled={!newThingName}
                onClick={() => mutateNewThing({ name: newThingName })}
              >
                Create Thing
              </Button>
            </Group>
            {!things?.length ? (
              <Skeleton height={50} />
            ) : (
              <Stack>
                {things?.map((thing) => (
                  <ThingCard key={thing.id} thing={thing} />
                ))}
              </Stack>
            )}
          </Stack>
        </Shell>
      </main>
    </>
  );
}
