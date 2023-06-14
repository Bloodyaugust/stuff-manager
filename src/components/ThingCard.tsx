import { getBoxes } from '@/lib/box/queries';
import { postImage } from '@/lib/image/queries';
import queryClient from '@/lib/query';
import { deleteThing, patchThing } from '@/lib/thing/queries';
import { HydratedThing } from '@/pages/api/thing';
import {
  Accordion,
  ActionIcon,
  Autocomplete,
  Drawer,
  FileInput,
  Group,
  Image,
  Popover,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { Box } from '@prisma/client';
import { IconCheck, IconDots, IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

type Props = {
  thing: HydratedThing;
};

export default function ThingCard({ thing }: Props) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const { data: boxes }: { data: Box[] | undefined } = useQuery({
    queryKey: ['boxes'],
    queryFn: getBoxes,
  });

  const { mutate: mutatePostImage } = useMutation({
    mutationFn: postImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['things'] });
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

  if (!boxes?.length) {
    return <Skeleton height={50} />;
  }

  return (
    <Group align="end" position="apart" noWrap>
      <Text truncate style={{ width: '33.33%' }}>
        {thing.thing.name}
      </Text>
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
          boxes?.find((box) => box.id === thing.thing.boxId)?.name || ''
        }
        onItemSubmit={(box) =>
          mutatePatchThing({ id: thing.thing.id, boxId: box.id })
        }
        style={{ width: '33.33%' }}
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
            <ActionIcon
              onClick={() => mutateDeleteThing({ id: thing.thing.id })}
            >
              <IconCheck color="red" />
            </ActionIcon>
          </Popover.Dropdown>
        </Popover>
      </Group>
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={<Text truncate>{thing.thing.name}</Text>}
        styles={{
          title: {
            width: '80%',
          },
        }}
      >
        <Stack>
          <Text>Name: {thing.thing.name}</Text>
          <Text>Description: {thing.thing.description}</Text>
          <FileInput
            accept="image/png,image/jpeg"
            onChange={(file) =>
              mutatePostImage({ image: file, thingId: thing.thing.id })
            }
            label="Image"
            placeholder="Click me"
            capture
          />
          {thing.image?.url && (
            <Image src={thing.image?.url} alt={thing.thing.name || ''} />
          )}
          <Accordion>
            <Accordion.Item value="audit">
              <Accordion.Control>Audit</Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  <Text>Created By: {thing.thing.createdBy}</Text>
                  <Text>
                    Created At: {thing.thing.createdAt.toLocaleString()}
                  </Text>
                  <Text>Updated By: {thing.thing.updatedBy}</Text>
                  <Text>
                    Updated At: {thing.thing.updatedAt.toLocaleString()}
                  </Text>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Drawer>
    </Group>
  );
}
