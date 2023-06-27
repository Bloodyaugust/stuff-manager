import { useQuery } from '@tanstack/react-query';

const keys = {
  all: ['boxes'] as const,
};

async function createBox({
  name,
  placeId,
}: {
  name: string;
  placeId?: string;
}) {
  const response = await fetch('/api/box', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      placeId,
    }),
  });

  return response.json();
}

async function getBoxes() {
  const response = await fetch('/api/box', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

export const useGetBoxes = () =>
  useQuery({
    queryFn: getBoxes,
    queryKey: keys.all,
  });

async function patchBox({
  id,
  name,
  placeId,
}: {
  id: string;
  name?: string;
  placeId?: string;
}) {
  const response = await fetch('/api/box', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      name,
      placeId,
    }),
  });

  return response.json();
}

async function deleteBox({ id }: { id: string }) {
  const response = await fetch(`/api/box?id=${id}`, {
    method: 'DELETE',
  });

  return response.json();
}

export { createBox, deleteBox, getBoxes, patchBox };
