import { ThemeProvider as NextThemesProvider } from 'next-themes';

export const ThemeProvider = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={true}
      storageKey="financeHub_theme"
    >
      {children}
    </NextThemesProvider>
  );
};
