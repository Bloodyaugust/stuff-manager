import { MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import UserProvider from '@/components/UserProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/lib/query';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ErrorBoundary>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
        }}
      >
        <SessionProvider session={session}>
          <UserProvider>
            <QueryClientProvider client={queryClient}>
              <Component {...pageProps} />
            </QueryClientProvider>
          </UserProvider>
        </SessionProvider>
      </MantineProvider>
    </ErrorBoundary>
  );
}
