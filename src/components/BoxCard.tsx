import { deleteBox, patchBox } from '@/lib/box/queries';
import { getPlaces } from '@/lib/place/queries';
import queryClient from '@/lib/query';
import {
  ActionIcon,
  Autocomplete,
  Group,
  Popover,
  Skeleton,
  Text,
} from '@mantine/core';
import { Box, Place } from '@prisma/client';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';

type Props = {
  box: Box;
};

export default function BoxCard({ box }: Props) {
  const { data: places }: { data: Place[] | undefined } = useQuery({
    queryKey: ['places'],
    queryFn: getPlaces,
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

  if (!places?.length) {
    return <Skeleton height={50} />;
  }

  return (
    <Group align="end" position="apart">
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
          places?.find((place) => place.id === box.placeId)?.name || ''
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
          <ActionIcon onClick={() => mutateDeleteBox({ id: box.id })}>
            <IconCheck color="red" />
          </ActionIcon>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
