import { motion } from 'motion/react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useApp } from '../context/AppContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

export const Navbar = ({ isCollapsed, onMenuClick }) => {
  const { role, setRole } = useApp();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 transition-all duration-300',
        'lg:left-0 lg:right-0',
        isCollapsed ? 'lg:left-20' : 'lg:left-64'
      )}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4 sm:gap-6">
        {/* Left: Mobile Menu + Search */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xs sm:max-w-2xl">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-10 bg-gray-100 dark:bg-white/5 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Selector */}
          <Select value={role} onValueChange={(value) => setRole(value)}>
            <SelectTrigger className="w-[110px] h-9 text-sm border-gray-200 dark:border-white/[0.08]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Viewer
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  Admin
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </motion.button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-black border-gray-200 dark:border-white/[0.08]">
              <DropdownMenuLabel>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};