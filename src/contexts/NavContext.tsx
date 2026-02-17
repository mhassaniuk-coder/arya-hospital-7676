import React, { createContext, useContext, ReactNode } from 'react';

interface NavContextType {
  setActiveTab: (tab: string) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({
  children,
  setActiveTab,
}: {
  children: ReactNode;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <NavContext.Provider value={{ setActiveTab }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (ctx === undefined) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
