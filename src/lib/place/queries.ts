async function createPlace(name: string) {
  const response = await fetch('/api/place', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
    }),
  });

  return response.json();
}

async function getPlaces() {
  const response = await fetch('/api/place', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

async function deletePlace({ id }: { id: string }) {
  const response = await fetch(`/api/place?id=${id}`, {
    method: 'DELETE',
  });

  return response.json();
}

export { createPlace, deletePlace, getPlaces };
