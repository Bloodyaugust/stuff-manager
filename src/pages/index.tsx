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
                        {things.map((thing: any) => (
                          <Text key={thing.id}>{thing.name}</Text>
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
                        {boxes.map((box: any) => (
                          <Text key={box.id}>{box.name}</Text>
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
                        {places.map((place: any) => (
                          <Text key={place.id}>{place.name}</Text>
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
