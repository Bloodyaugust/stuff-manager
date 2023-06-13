import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Center,
  Group,
  Header,
  NavLink,
  Navbar,
  Title,
} from '@mantine/core';
import { ReactNode, useContext, useState } from 'react';
import { userContext } from './UserProvider';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

type Props = {
  children: ReactNode;
};

export default function Shell({ children }: Props) {
  const [navHidden, setNavHidden] = useState(true);
  const { user } = useContext(userContext);
  const router = useRouter();

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
              {!user && <Button onClick={() => signIn()}>Sign In</Button>}
              {user && <Avatar src={user.image} />}
            </Group>
          </Center>
        </Header>
      }
      navbar={
        <Navbar
          hidden={navHidden}
          width={{
            sm: 300,
          }}
        >
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
    </AppShell>
  );
}
