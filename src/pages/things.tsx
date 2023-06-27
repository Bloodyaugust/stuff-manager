import Shell from '@/components/Shell';
import ThingCard from '@/components/ThingCard';
import {
  useCreateThing,
  useGetThings,
  usePatchThing,
} from '@/lib/thing/queries';
import {
  ActionIcon,
  Affix,
  Button,
  Drawer,
  Group,
  Loader,
  Select,
  Skeleton,
  Stack,
  TextInput,
  Textarea,
  rem,
} from '@mantine/core';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import { HydratedThing } from './api/thing';
import { IconPlus } from '@tabler/icons-react';
import { useGetBoxes } from '@/lib/box/queries';
import { Box } from '@prisma/client';

export default function Things() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { data: things }: { data: HydratedThing[] | undefined } =
    useGetThings();
  const { data: boxes }: { data: Box[] | undefined } = useGetBoxes();

  const [newThingName, setNewThingName] = useState<string>('');
  const [thingBoxSearchQuery, setThingBoxSearchQuery] = useState<string>('');
  const [newThingBoxId, setNewThingBoxId] = useState<string>('');
  const [newThingDescription, setNewThingDescription] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const { mutateAsync: mutateNewThing } = useCreateThing();
  const { mutateAsync: mutatePatchThing } = usePatchThing();

  const saveThing = useCallback(
    async (addAnother: boolean) => {
      setSaving(true);

      const [newThing] = await mutateNewThing({ name: newThingName });
      await mutatePatchThing({
        id: newThing.thing.id,
        boxId: newThingBoxId,
        description: newThingDescription,
      });

      setSaving(false);
      setNewThingName('');
      setNewThingDescription('');
      setNewThingBoxId('');
      setThingBoxSearchQuery('');
      setNewThingDescription('');

      if (!addAnother) {
        setDrawerOpen(false);
      }
    },
    [
      mutateNewThing,
      setDrawerOpen,
      newThingName,
      mutatePatchThing,
      newThingDescription,
      newThingBoxId,
    ]
  );

  return (
    <>
      <Head>
        <title>Stuff Manager - Things</title>
        <meta name="description" content="Manage your stuff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Shell>
          <Stack>
            {!things?.length ? (
              <Skeleton height={50} />
            ) : (
              <Stack>
                {things?.map((thing) => (
                  <ThingCard key={thing.thing.id} thing={thing} />
                ))}
              </Stack>
            )}
          </Stack>
          <Affix position={{ bottom: rem(20), right: rem(20) }}>
            <ActionIcon
              variant="filled"
              size="xl"
              onClick={() => setDrawerOpen(true)}
            >
              <IconPlus size="2.125rem" />
            </ActionIcon>
          </Affix>
          <Drawer
            opened={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="New Thing"
          >
            <Stack>
              {saving ? (
                <Loader />
              ) : (
                <>
                  <TextInput
                    placeholder="Thing Name"
                    label="Name"
                    onChange={(e) => setNewThingName(e.target.value)}
                    value={newThingName}
                    withAsterisk
                  />
                  <Select
                    label="Box"
                    placeholder="Pick a box"
                    data={
                      boxes?.map((box) => ({
                        value: box.id,
                        label: box.name || '',
                      })) || []
                    }
                    onChange={(boxId) => {
                      setNewThingBoxId(boxId || '');
                    }}
                    searchValue={thingBoxSearchQuery}
                    onSearchChange={setThingBoxSearchQuery}
                    value={newThingBoxId || undefined}
                    style={{ width: '33.33%' }}
                    searchable
                    clearable
                  />
                  <Textarea
                    autosize
                    minRows={2}
                    placeholder="Description of the thing"
                    onChange={(e) =>
                      setNewThingDescription(e.currentTarget.value)
                    }
                    value={newThingDescription}
                    label="Description"
                  />
                  <Group position="apart">
                    <Button
                      disabled={!newThingName}
                      onClick={() => saveThing(true)}
                    >
                      Save and add another
                    </Button>
                    <Button
                      disabled={!newThingName}
                      onClick={() => saveThing(false)}
                    >
                      Save
                    </Button>
                  </Group>
                </>
              )}
            </Stack>
          </Drawer>
        </Shell>
      </main>
    </>
  );
}
