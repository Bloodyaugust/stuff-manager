import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Center,
  Divider,
  Group,
  Header,
  Input,
  Menu,
  Modal,
  NavLink,
  Navbar,
  Stack,
  Title,
  createStyles,
} from '@mantine/core';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { userContext } from './UserProvider';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Workspace } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createWorkspace, getWorkspaces } from '@/lib/workspace/queries';
import queryClient from '@/lib/query';

type Props = {
  children: ReactNode;
};

const useStyles = createStyles((theme) => ({
  activeWorkspace: {
    backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
  },
}));

export default function Shell({ children }: Props) {
  const { classes, cx } = useStyles();
  const [navHidden, setNavHidden] = useState(true);
  const [createWorkspaceModalOpen, setCreateWorkspaceModalOpen] =
    useState<boolean>(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>('');
  const {
    user,
    workspace: activeWorkspace,
    setWorkspace,
  } = useContext(userContext);
  const router = useRouter();

  const { data: workspaces }: { data: Workspace[] | undefined } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
    enabled: !!user,
  });

  const { mutate: mutateNewWorkspace } = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setNewWorkspaceName('');
      setCreateWorkspaceModalOpen(false);
    },
  });

  useEffect(() => {
    if (workspaces && !activeWorkspace) {
      setWorkspace(workspaces[0].id);
    }
  }, [workspaces, activeWorkspace, setWorkspace]);

  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="md">
          <Center h="100%" w="100%">
            <Group position="apart" w="100%">
              <Burger
                opened={!navHidden}
                onClick={() => setNavHidden((hidden) => !hidden)}
                size="sm"
              />
              <Title style={{ textTransform: 'capitalize' }}>
                {router.route.replace('/', '')}
              </Title>
              {!user && (
                <Button
                  onClick={() =>
                    signIn('discord', {
                      callbackUrl:
                        process.env.NODE_ENV === 'production'
                          ? 'https://stuff-manager.up.railway.app/'
                          : '/',
                    })
                  }
                >
                  Sign In
                </Button>
              )}
              {user && workspaces && (
                <Menu>
                  <Menu.Target>
                    <Avatar src={user.image} />
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Workspaces</Menu.Label>
                    {workspaces.map((workspace) => (
                      <Menu.Item
                        key={workspace.id}
                        className={cx({
                          [classes.activeWorkspace]:
                            workspace.id === activeWorkspace,
                        })}
                        onClick={() => setWorkspace(workspace.id)}
                      >
                        {workspace.name}
                      </Menu.Item>
                    ))}
                    <Divider />
                    <Menu.Item
                      onClick={() => setCreateWorkspaceModalOpen(true)}
                    >
                      Create Workspace
                    </Menu.Item>
                    <Divider />
                    <Menu.Label>Account</Menu.Label>
                    <Menu.Item onClick={() => signOut()}>Sign Out</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>
          </Center>
        </Header>
      }
      navbar={
        <Navbar
          hidden={navHidden}
          width={{
            sm: navHidden ? 50 : 300,
          }}
        >
          <NavLink
            active={router.route === '/'}
            label="Home"
            component="a"
            href="/"
          />
          <NavLink
            active={router.route === '/things'}
            label="Things"
            component="a"
            href="/things"
          />
          <NavLink
            active={router.route === '/boxes'}
            label="Boxes"
            component="a"
            href="/boxes"
          />
          <NavLink
            active={router.route === '/places'}
            label="Places"
            component="a"
            href="/places"
          />
        </Navbar>
      }
    >
      {children}
      <Modal
        opened={createWorkspaceModalOpen}
        onClose={() => setCreateWorkspaceModalOpen(false)}
        title="Create Workspace"
      >
        <Stack>
          <Input
            placeholder="Workspace name"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
          />
          <Button
            onClick={() =>
              mutateNewWorkspace({
                name: newWorkspaceName,
              })
            }
          >
            Create Workspace
          </Button>
        </Stack>
      </Modal>
    </AppShell>
  );
}
