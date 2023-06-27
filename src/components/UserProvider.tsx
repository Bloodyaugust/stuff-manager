import queryClient from '@/lib/query';
import { useSession } from 'next-auth/react';
import { ReactNode, createContext, useEffect, useState } from 'react';
import reactUseCookie from 'react-use-cookie';

type UserContextType = {
  user?: {
    email?: string | null;
    image?: string | null;
    name?: string | null;
  };
  workspace?: string;
  setWorkspace: (workspaceId: string) => void;
};

export const userContext = createContext<UserContextType>({
  setWorkspace: () => {},
});

type Props = {
  children: ReactNode;
};

export default function UserProvider({ children }: Props) {
  const { data: session } = useSession();
  const [workspace, setWorkspace] = useState<string | undefined>(undefined);
  const [, setWorkspaceCookie] = reactUseCookie('workspace', '');

  useEffect(() => {
    if (workspace) {
      setWorkspaceCookie(workspace);
      queryClient.invalidateQueries({
        queryKey: ['places'],
      });
      queryClient.invalidateQueries({
        queryKey: ['boxes'],
      });
      queryClient.invalidateQueries({
        queryKey: ['things'],
      });
    }
  }, [workspace, setWorkspaceCookie]);

  return (
    <userContext.Provider
      value={{
        user: session?.user,
        workspace,
        setWorkspace,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
