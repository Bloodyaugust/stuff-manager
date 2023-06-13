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

export { createBox, getBoxes, patchBox };