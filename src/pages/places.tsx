import PlaceCard from '@/components/PlaceCard';
import Shell from '@/components/Shell';
import { createPlace, getPlaces } from '@/lib/place/queries';
import queryClient from '@/lib/query';
import { Button, Group, Input, Skeleton, Stack } from '@mantine/core';
import { Place } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useState } from 'react';

export default function Places() {
  const { data: places }: { data: Place[] | undefined } = useQuery({
    queryKey: ['places'],
    queryFn: getPlaces,
  });

  const [newPlaceName, setNewPlaceName] = useState<string>('');
  const { mutate } = useMutation({
    mutationFn: createPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
      setNewPlaceName('');
    },
  });

  return (
    <>
      <Head>
        <title>Stuff Manager - Places</title>
        <meta name="description" content="Manage your stuff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Shell>
          <Stack>
            <Group position="apart">
              <Input
                placeholder="Place Name"
                onChange={(e) => setNewPlaceName(e.target.value)}
                value={newPlaceName}
              />
              <Button
                disabled={!newPlaceName}
                onClick={() => mutate(newPlaceName)}
              >
                Create Place
              </Button>
            </Group>
            {!places?.length ? (
              <Skeleton height={50} />
            ) : (
              <Stack>
                {places?.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </Stack>
            )}
          </Stack>
        </Shell>
      </main>
    </>
  );
}
