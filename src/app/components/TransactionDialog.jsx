import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { categories } from '../data/mockTransactions';

export const TransactionDialog = ({
  open,
  onClose,
  onSave,
  transaction,
}) => {
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    category: '',
    type: 'expense',
    description: '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        description: transaction.description || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        type: 'expense',
        description: '',
      });
    }
  }, [transaction, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      description: formData.description,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-black rounded-lg shadow-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
          
        >
          <DialogHeader>
            <DialogTitle>
              {transaction ? 'Edit Transaction' : 'Add New Transaction'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className=''>
            <div className="grid gap-4 py-4 ">
              <motion.div
                className="grid gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </motion.div>

              <motion.div
                className="grid gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                className="grid gap-2 "
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                className="grid gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </motion.div>

              <motion.div
                className="grid gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </motion.div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit">
                  {transaction ? 'Update' : 'Add'} Transaction
                </Button>
              </motion.div>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};