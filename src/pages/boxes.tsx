import Shell from '@/components/Shell';
import { createBox, deleteBox, getBoxes, patchBox } from '@/lib/box/queries';
import { getPlaces } from '@/lib/place/queries';
import queryClient from '@/lib/query';
import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Input,
  Popover,
  Stack,
  Text,
} from '@mantine/core';
import { Box, Place } from '@prisma/client';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useState } from 'react';

export default function Boxes() {
  const { data: places }: { data: Place[] | undefined } = useQuery({
    queryKey: ['places'],
    queryFn: getPlaces,
  });
  const { data: boxes }: { data: Box[] | undefined } = useQuery({
    queryKey: ['boxes'],
    queryFn: getBoxes,
  });

  const [newBoxName, setNewBoxName] = useState<string>('');
  const { mutate: mutateNewBox } = useMutation({
    mutationFn: createBox,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxes'] });
      setNewBoxName('');
    },
  });
  const { mutate: mutatePatchBox } = useMutation({
    mutationFn: patchBox,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxes'] });
    },
  });
  const { mutate: mutateDeleteBox } = useMutation({
    mutationFn: deleteBox,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxes'] });
    },
  });

  return (
    <>
      <Head>
        <title>Stuff Manager - Boxes</title>
        <meta name="description" content="Manage your stuff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Shell>
          <Stack>
            <Group position="apart">
              <Input
                placeholder="Box Name"
                onChange={(e) => setNewBoxName(e.target.value)}
                value={newBoxName}
              />
              <Button
                disabled={!newBoxName}
                onClick={() => mutateNewBox({ name: newBoxName })}
              >
                Create Box
              </Button>
            </Group>
            <Stack>
              {boxes?.map((box) => (
                <Group key={box.id} align="end" position="apart">
                  <Text>{box.name}</Text>
                  <Autocomplete
                    label="Place"
                    placeholder="Pick a place"
                    data={
                      places?.map((place) => ({
                        value: place.name || '',
                        id: place.id,
                      })) || []
                    }
                    defaultValue={
                      places?.find((place) => place.id === box.placeId)?.name ||
                      ''
                    }
                    onItemSubmit={(place) =>
                      mutatePatchBox({ id: box.id, placeId: place.id })
                    }
                  />
                  <Popover position="bottom" withArrow>
                    <Popover.Target>
                      <ActionIcon>
                        <IconTrash color="red" />
                      </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <ActionIcon
                        onClick={() => mutateDeleteBox({ id: box.id })}
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
