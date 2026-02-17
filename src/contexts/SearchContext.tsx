import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  return (
    <SearchContext.Provider value={{ globalSearchQuery, setGlobalSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (ctx === undefined) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
