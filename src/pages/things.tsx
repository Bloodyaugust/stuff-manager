import Shell from '@/components/Shell';
import { getBoxes } from '@/lib/box/queries';
import queryClient from '@/lib/query';
import {
  createThing,
  deleteThing,
  getThings,
  patchThing,
} from '@/lib/thing/queries';
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
import { Box, Thing } from '@prisma/client';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useState } from 'react';

export default function Things() {
  const { data: boxes }: { data: Box[] | undefined } = useQuery({
    queryKey: ['boxes'],
    queryFn: getBoxes,
  });
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
  const { mutate: mutatePatchThing } = useMutation({
    mutationFn: patchThing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['things'] });
    },
  });
  const { mutate: mutateDeleteThing } = useMutation({
    mutationFn: deleteThing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['things'] });
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
            <Stack>
              {things?.map((thing) => (
                <Group key={thing.id} align="end" position="apart">
                  <Text>{thing.name}</Text>
                  <Autocomplete
                    label="Box"
                    placeholder="Pick a box"
                    data={
                      boxes?.map((box) => ({
                        value: box.name || '',
                        id: box.id,
                      })) || []
                    }
                    defaultValue={
                      boxes?.find((box) => box.id === thing.boxId)?.name || ''
                    }
                    onItemSubmit={(box) =>
                      mutatePatchThing({ id: thing.id, boxId: box.id })
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
                        onClick={() => mutateDeleteThing({ id: thing.id })}
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
