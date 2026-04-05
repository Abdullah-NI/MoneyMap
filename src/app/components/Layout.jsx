import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastProvider } from './ToastProvider';
import { cn } from './ui/utils';

export const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", isMobileMenuOpen && "overflow-hidden")}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobile={false}
        />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 z-50"
            >
              <Sidebar 
                isCollapsed={false} 
                onToggle={() => setIsMobileMenuOpen(false)}
                isMobile={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <Navbar 
        isCollapsed={isSidebarCollapsed} 
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastProvider />
    </div>
  );
};