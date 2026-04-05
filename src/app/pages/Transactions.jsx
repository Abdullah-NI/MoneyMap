import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PageTransition } from '../components/PageTransition';
import { ExportButton } from '../components/ExportButton';
import { motion } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { TransactionDialog } from '../components/TransactionDialog';
import { Plus, Search, Trash2, ArrowUpDown } from 'lucide-react';
import { categories } from '../data/mockTransactions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { TrendingUp, TrendingDown, Edit2 } from 'lucide-react';

export const Transactions = () => {
  const { role, transactions, addTransaction, updateTransaction, deleteTransaction } =
    useApp();
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((t) => {
      const matchesSearch =
        t.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory =
        filters.category === 'all' || t.category === filters.category;
      const matchesType = filters.type === 'all' || t.type === filters.type;

      return matchesSearch && matchesCategory && matchesType;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date-desc':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'date-asc':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'amount-desc':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'amount-asc':
          aValue = a.amount;
          bValue = b.amount;
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
      }

      if (sortBy.includes('asc')) {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, filters, sortBy]);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(undefined);
    setDialogOpen(true);
  };

  const handleSave = (transactionData) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteTransaction(deletingId);
      setDeletingId(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your financial transactions</p>
            </div>
            <div className="flex gap-2">
              <ExportButton transactions={filteredTransactions} />
              {role === 'admin' && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Transaction
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6 dark:bg-[#111827] dark:border-white/[0.08] dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4)]">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-[#9CA3AF] mb-2 block">
                    Search
                  </label>
                  <Input
                    placeholder="Search transactions..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="dark:bg-[#1F2937] dark:border-white/[0.08] dark:text-[#E5E7EB] dark:placeholder:text-[#6B7280]"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-[#9CA3AF] mb-2 block">
                    Category
                  </label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger className="dark:bg-[#1F2937] dark:border-white/[0.08] dark:text-[#E5E7EB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-[#9CA3AF] mb-2 block">
                    Type
                  </label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => setFilters({ ...filters, type: value })}
                  >
                    <SelectTrigger className="dark:bg-[#1F2937] dark:border-white/[0.08] dark:text-[#E5E7EB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-[#9CA3AF] mb-2 block">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                    <SelectTrigger className="dark:bg-[#1F2937] dark:border-white/[0.08] dark:text-[#E5E7EB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Date (Newest)</SelectItem>
                      <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                      <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                      <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="dark:bg-[#111827] dark:border-white/[0.08] dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4)]">
            <CardHeader>
              <CardTitle className="dark:text-[#E5E7EB]">
                {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-white/[0.08]">
                      <th className="text-left py-3 px-2 sm:px-4 text-sm font-medium text-gray-600 dark:text-[#9CA3AF]">
                        Date
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-sm font-medium text-gray-600 dark:text-[#9CA3AF]">
                        Category
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-sm font-medium text-gray-600 dark:text-[#9CA3AF]">
                        Description
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-sm font-medium text-gray-600 dark:text-[#9CA3AF]">
                        Type
                      </th>
                      <th className="text-right py-3 px-2 sm:px-4 text-sm font-medium text-gray-600 dark:text-[#9CA3AF]">
                        Amount
                      </th>
                      {role === 'admin' && (
                        <th className="text-right py-3 px-2 sm:px-4 text-sm font-medium text-gray-600 dark:text-[#9CA3AF]">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
                      >
                        <td className="py-3 px-2 sm:px-4 text-sm text-gray-900 dark:text-[#E5E7EB]">
                          {transaction.date}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-sm text-gray-900 dark:text-[#E5E7EB]">
                          {transaction.category}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-sm text-gray-600 dark:text-[#9CA3AF]">
                          {transaction.description || '-'}
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === 'income'
                                ? 'bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-[#34D399] dark:border dark:border-green-500/20'
                                : 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-[#EF4444] dark:border dark:border-red-500/20'
                            }`}
                          >
                            {transaction.type === 'income' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {transaction.type}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-2 sm:px-4 text-sm text-right font-semibold ${
                            transaction.type === 'income'
                              ? 'text-green-600 dark:text-[#34D399]'
                              : 'text-red-600 dark:text-[#EF4444]'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}$
                          {transaction.amount.toLocaleString()}
                        </td>
                        {role === 'admin' && (
                          <td className="py-3 px-2 sm:px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(transaction)}
                                className="p-1.5 text-blue-600 dark:text-[#60A5FA] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(transaction.id)}
                                className="p-1.5 text-red-600 dark:text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Add/Edit Dialog */}
          <TransactionDialog
            open={dialogOpen}
            onClose={() => {
              setDialogOpen(false);
              setEditingTransaction(undefined);
            }}
            onSave={handleSave}
            transaction={editingTransaction}
          />

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent className="bg-white dark:bg-black rounded-lg shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this transaction? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </div>
    </PageTransition>
  );
};
