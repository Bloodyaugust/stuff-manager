import { getBoxes } from '@/lib/box/queries';
import queryClient from '@/lib/query';
import { deleteThing, patchThing } from '@/lib/thing/queries';
import {
  Accordion,
  ActionIcon,
  Autocomplete,
  Drawer,
  Group,
  Popover,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { Box, Thing } from '@prisma/client';
import { IconCheck, IconDots, IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

type Props = {
  thing: Thing;
};

export default function ThingCard({ thing }: Props) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const { data: boxes }: { data: Box[] | undefined } = useQuery({
    queryKey: ['boxes'],
    queryFn: getBoxes,
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

  if (!boxes?.length) {
    return <Skeleton height={50} />;
  }

  return (
    <Group align="end" position="apart">
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
        defaultValue={boxes?.find((box) => box.id === thing.boxId)?.name || ''}
        onItemSubmit={(box) =>
          mutatePatchThing({ id: thing.id, boxId: box.id })
        }
      />
      <Group>
        <ActionIcon>
          <IconDots onClick={() => setDrawerOpen(true)} />
        </ActionIcon>
        <Popover position="bottom" withArrow>
          <Popover.Target>
            <ActionIcon>
              <IconTrash color="red" />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <ActionIcon onClick={() => mutateDeleteThing({ id: thing.id })}>
              <IconCheck color="red" />
            </ActionIcon>
          </Popover.Dropdown>
        </Popover>
      </Group>
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={thing.name}
      >
        <Stack>
          <Text>Name: {thing.name}</Text>
          <Text>Description: {thing.description}</Text>
          <Accordion>
            <Accordion.Item value="audit">
              <Accordion.Control>Audit</Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  <Text>Created By: {thing.createdBy}</Text>
                  <Text>Created At: {thing.createdAt.toLocaleString()}</Text>
                  <Text>Updated By: {thing.updatedBy}</Text>
                  <Text>Updated At: {thing.updatedAt.toLocaleString()}</Text>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Drawer>
    </Group>
  );
}
