import { motion } from 'motion/react';
import { PageTransition } from '../components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Bell, User, CreditCard, Shield, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const Settings = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleExport = () => {
    toast.info('Exporting data...');
  };

  const handleClearData = () => {
    toast.warning('This action cannot be undone');
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account preferences and application settings
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-gray-200 dark:border-white/[0.08] shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="currency">Preferred Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-gray-200 dark:border-white/[0.08] shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Transaction Alerts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified of new transactions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Weekly Reports</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly summary emails</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-gray-200 dark:border-white/[0.08] shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your security settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>
                <div>
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-gray-200 dark:border-white/[0.08] shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Export or delete your data</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleExport} variant="outline" className="w-full justify-start gap-2">
                  <Download className="w-4 h-4" />
                  Export All Data
                </Button>
                <Button onClick={handleClearData} variant="outline" className="w-full justify-start gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end gap-3"
          >
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};
