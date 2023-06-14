async function postImage({
  image,
  boxId = '',
  thingId = '',
}: {
  image: any;
  boxId?: string;
  thingId?: string;
}) {
  const formData = new FormData();

  formData.append('image', image);
  formData.append('boxId', boxId);
  formData.append('thingId', thingId);

  const response = await fetch('/api/image', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

export { postImage };
