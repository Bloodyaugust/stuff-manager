async function search(search: string) {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      search,
    }),
  });

  return response.json();
}

export { search };
