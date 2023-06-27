import { MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import UserProvider from '@/components/UserProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/lib/query';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
          fontSizes: {
            xs: '1rem',
            sm: '1rem',
            md: '1rem',
          },
        }}
      >
        <SessionProvider session={session}>
          <UserProvider>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools initialIsOpen={false} />
              <Component {...pageProps} />
            </QueryClientProvider>
          </UserProvider>
        </SessionProvider>
      </MantineProvider>
    </ErrorBoundary>
  );
}
