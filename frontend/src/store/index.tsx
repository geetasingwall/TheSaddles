import { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '../types';

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('hrc_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const handleSetUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem('hrc_user', JSON.stringify(u));
    else localStorage.removeItem('hrc_user');
  };

  return (
    <StoreContext.Provider value={{ user, setUser: handleSetUser, isLoggedIn: !!user }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
