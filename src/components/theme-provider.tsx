import React from 'react';

interface ThemeProviderProps {
  defaultTheme?: string;
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>;
}
