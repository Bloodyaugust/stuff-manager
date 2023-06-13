import { useSession } from 'next-auth/react';
import { ReactNode, createContext } from 'react';

type UserContextType = {
  user?: {
    email?: string | null;
    image?: string | null;
    name?: string | null;
  };
};

export const userContext = createContext<UserContextType>({});

type Props = {
  children: ReactNode;
};

export default function UserProvider({ children }: Props) {
  const { data: session } = useSession();

  return (
    <userContext.Provider
      value={{
        user: session?.user,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
