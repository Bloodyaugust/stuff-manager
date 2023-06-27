import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../query';

const keys = {
  all: ['things'] as const,
};

async function createThing({ name, boxId }: { name: string; boxId?: string }) {
  const response = await fetch('/api/thing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      boxId,
    }),
  });

  return response.json();
}

export const useCreateThing = () => {
  return useMutation({
    mutationFn: createThing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
};

async function getThings() {
  const response = await fetch('/api/thing', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

export const useGetThings = () =>
  useQuery({
    queryKey: keys.all,
    queryFn: getThings,
  });

async function patchThing({
  id,
  name,
  boxId,
  description,
}: {
  id: string;
  name?: string;
  boxId?: string;
  description?: string;
}) {
  const response = await fetch('/api/thing', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      name,
      boxId,
      description,
    }),
  });

  return response.json();
}

export const usePatchThing = () =>
  useMutation({
    mutationFn: patchThing,
    onSuccess: ([newThing]) => {
      queryClient.setQueryData(keys.all, (previous: any) =>
        previous.map((thing: any) =>
          thing.thing.id === newThing.thing.id ? newThing : thing
        )
      );
    },
  });

async function deleteThing({ id }: { id: string }) {
  const response = await fetch(`/api/thing?id=${id}`, {
    method: 'DELETE',
  });

  return response.json();
}

export { createThing, deleteThing, getThings, patchThing };
