import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#1F2937] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center transition-all duration-200 hover:bg-gray-200 dark:hover:bg-[#374151] dark:shadow-[0_2px_4px_0_rgba(0,0,0,0.3)]"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          rotate: isDark ? 90 : 0,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className="w-5 h-5 text-amber-500" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          rotate: isDark ? 0 : -90,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className="w-5 h-5 text-[#60A5FA]" />
      </motion.div>
    </motion.button>
  );
};