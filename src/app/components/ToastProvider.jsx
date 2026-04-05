import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export const ToastProvider = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      theme={theme}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: theme === 'dark' ? '#1F2937' : '#ffffff',
          border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E7EB',
          color: theme === 'dark' ? '#E5E7EB' : '#111827',
        },
      }}
    />
  );
};
