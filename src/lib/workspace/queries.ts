async function createWorkspace({ name }: { name: string }) {
  const response = await fetch('/api/workspace', {
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

async function getWorkspaces() {
  const response = await fetch('/api/workspace', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

export { createWorkspace, getWorkspaces };
