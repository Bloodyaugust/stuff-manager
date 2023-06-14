import Shell from '@/components/Shell';
import {
  Accordion,
  Button,
  Group,
  Input,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import Head from 'next/head';
import { useState } from 'react';
import { search } from '@/lib/search/queries';
import ThingCard from '@/components/ThingCard';
import { Box, Place } from '@prisma/client';
import BoxCard from '@/components/BoxCard';
import PlaceCard from '@/components/PlaceCard';
import { HydratedThing } from './api/thing';

export default function Home() {
  const [searchString, setSearchString] = useState<string>('');

  const {
    data: { things, places, boxes } = { things: [], places: [], boxes: [] },
    mutate,
    isSuccess,
    isLoading,
  } = useMutation({
    mutationFn: search,
  });

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
          <Stack>
            <Group position="apart">
              <Input
                placeholder="Search for things"
                onChange={(e) => setSearchString(e.target.value)}
                style={{
                  flexGrow: 1,
                }}
              />
              <Button onClick={() => mutate(searchString)}>Search</Button>
            </Group>
            {isLoading && <Skeleton height={50} />}
            {(things.length > 0 || places.length > 0 || boxes.length > 0) && (
              <Accordion>
                {things.length > 0 && (
                  <Accordion.Item value="things">
                    <Accordion.Control>
                      Things - ({things.length})
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack>
                        {things.map((thing: HydratedThing) => (
                          <ThingCard key={thing.thing.id} thing={thing} />
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                )}
                {boxes.length > 0 && (
                  <Accordion.Item value="boxes">
                    <Accordion.Control>
                      Boxes - ({boxes.length})
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack>
                        {boxes.map((box: Box) => (
                          <BoxCard key={box.id} box={box} />
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                )}
                {places.length > 0 && (
                  <Accordion.Item value="places">
                    <Accordion.Control>
                      Places - ({places.length})
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack>
                        {places.map((place: Place) => (
                          <PlaceCard key={place.id} place={place} />
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                )}
              </Accordion>
            )}
            {!isLoading &&
              isSuccess &&
              things.length === 0 &&
              places.length === 0 &&
              boxes.length === 0 && (
                <Text>No Things, Places, or Boxes found.</Text>
              )}
          </Stack>
        </Shell>
      </main>
    </>
  );
}
