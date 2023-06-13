import Shell from '@/components/Shell';
import { createPlace, deletePlace, getPlaces } from '@/lib/place/queries';
import queryClient from '@/lib/query';
import {
  ActionIcon,
  Button,
  Group,
  Input,
  Popover,
  Stack,
  Text,
} from '@mantine/core';
import { Place } from '@prisma/client';
import { IconCheck, IconTrash } from '@tabler/icons-react';
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
  const { mutate: mutateDeletePlace } = useMutation({
    mutationFn: deletePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
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
            <Stack>
              {places?.map((place) => (
                <Group key={place.id}>
                  <Text>{place.name}</Text>

                  <Popover position="bottom" withArrow>
                    <Popover.Target>
                      <ActionIcon>
                        <IconTrash color="red" />
                      </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <ActionIcon
                        onClick={() => mutateDeletePlace({ id: place.id })}
                      >
                        <IconCheck color="red" />
                      </ActionIcon>
                    </Popover.Dropdown>
                  </Popover>
                </Group>
              ))}
            </Stack>
          </Stack>
        </Shell>
      </main>
    </>
  );
}
