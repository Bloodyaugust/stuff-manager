import { getBoxes } from '@/lib/box/queries';
import queryClient from '@/lib/query';
import { deleteThing, patchThing } from '@/lib/thing/queries';
import {
  ActionIcon,
  Autocomplete,
  Group,
  Popover,
  Skeleton,
  Text,
} from '@mantine/core';
import { Box, Thing } from '@prisma/client';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';

type Props = {
  thing: Thing;
};

export default function ThingCard({ thing }: Props) {
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
  );
}
