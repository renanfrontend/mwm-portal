import { createContext, useState, useEffect, useContext, useMemo, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme ] = useState<Theme>('light');

  useEffect(() => {
    // Mantém sua lógica original de atributos no HTML
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Função desativada internamente para não quebrar as cores por enquanto
  const toggleTheme = () => {
    console.log("Troca de tema desativada para preservar as cores do sistema.");
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook exportado explicitamente para resolver o erro do Header.tsx
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Retorno seguro para evitar que a aplicação trave caso o Provider falte
    return { theme: 'light' as Theme, toggleTheme: () => {} };
  }
  return context;
};