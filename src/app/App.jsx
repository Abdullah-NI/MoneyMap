import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './components/ThemeProvider';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ThemeProvider>
  );
}
