import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Settings,
  ChevronLeft,
  Wallet
} from 'lucide-react';
import { cn } from './ui/utils';

const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/transactions',
    label: 'Transactions',
    icon: Receipt,
  },
  {
    path: '/insights',
    label: 'Insights',
    icon: TrendingUp,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export const Sidebar = ({ isCollapsed, onToggle, isMobile = false }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 256,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 flex flex-col"
    >
      {/* Logo & Collapse Button */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                MoneyMap
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link key={item.path} to={item.path} onClick={isMobile ? onToggle : undefined}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
                  active
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', active ? 'text-white' : '')} />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {active && !isCollapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200',
            'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10',
            'text-gray-600 dark:text-gray-400'
          )}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-medium whitespace-nowrap overflow-hidden"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
};