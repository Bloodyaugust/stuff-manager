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

async function getThings() {
  const response = await fetch('/api/thing', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

async function patchThing({
  id,
  name,
  boxId,
}: {
  id: string;
  name?: string;
  boxId?: string;
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
    }),
  });

  return response.json();
}

export { createThing, getThings, patchThing };
