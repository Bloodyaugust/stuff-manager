import BoxCard from '@/components/BoxCard';
import Shell from '@/components/Shell';
import { createBox, getBoxes } from '@/lib/box/queries';
import queryClient from '@/lib/query';
import { Button, Group, Input, Skeleton, Stack } from '@mantine/core';
import { Box } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useState } from 'react';

export default function Boxes() {
  const { data: boxes }: { data: Box[] | undefined } = useQuery({
    queryKey: ['boxes'],
    queryFn: getBoxes,
  });

  const [newBoxName, setNewBoxName] = useState<string>('');
  const { mutate: mutateNewBox } = useMutation({
    mutationFn: createBox,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxes'] });
      setNewBoxName('');
    },
  });

  return (
    <>
      <Head>
        <title>Stuff Manager - Boxes</title>
        <meta name="description" content="Manage your stuff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Shell>
          <Stack>
            <Group position="apart">
              <Input
                placeholder="Box Name"
                onChange={(e) => setNewBoxName(e.target.value)}
                value={newBoxName}
              />
              <Button
                disabled={!newBoxName}
                onClick={() => mutateNewBox({ name: newBoxName })}
              >
                Create Box
              </Button>
            </Group>
            {!boxes?.length ? (
              <Skeleton height={50} />
            ) : (
              <Stack>
                {boxes.map((box) => (
                  <BoxCard key={box.id} box={box} />
                ))}
              </Stack>
            )}
          </Stack>
        </Shell>
      </main>
    </>
  );
}
