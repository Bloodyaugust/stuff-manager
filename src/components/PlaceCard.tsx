import { deletePlace } from '@/lib/place/queries';
import queryClient from '@/lib/query';
import { ActionIcon, Group, Popover, Text } from '@mantine/core';
import { Place } from '@prisma/client';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

type Props = {
  place: Place;
};

export default function PlaceCard({ place }: Props) {
  const { mutate: mutateDeletePlace } = useMutation({
    mutationFn: deletePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });

  return (
    <Group position="apart">
      <Text>{place.name}</Text>
      <Popover position="bottom" withArrow>
        <Popover.Target>
          <ActionIcon>
            <IconTrash color="red" />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ActionIcon onClick={() => mutateDeletePlace({ id: place.id })}>
            <IconCheck color="red" />
          </ActionIcon>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
