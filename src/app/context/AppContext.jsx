import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockTransactions';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { api } from '../utils/api';
import { toast } from 'sonner';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [role, setRole] = useState('viewer');
  
  // Initialize transactions from localStorage or use mock data
  const [transactions, setTransactions] = useState(() => {
    const stored = storage.get(STORAGE_KEYS.TRANSACTIONS, []);
    return stored.length > 0 ? stored : mockTransactions;
  });

  // Initialize filters from localStorage
  const [filters, setFilters] = useState(() => {
    return storage.get(STORAGE_KEYS.FILTERS, {
      search: '',
      category: 'all',
      type: 'all',
    });
  });

  // Persist transactions to localStorage whenever they change
  useEffect(() => {
    storage.set(STORAGE_KEYS.TRANSACTIONS, transactions);
  }, [transactions]);

  // Persist filters to localStorage
  useEffect(() => {
    storage.set(STORAGE_KEYS.FILTERS, filters);
  }, [filters]);

  const addTransaction = async (transaction) => {
    try {
      // Simulate API call
      const newTransaction = await api.createTransaction(transaction);
      setTransactions([newTransaction, ...transactions]);
      toast.success('Transaction added successfully');
    } catch (error) {
      toast.error('Failed to add transaction');
      console.error('Add transaction error:', error);
    }
  };

  const updateTransaction = async (id, updatedFields) => {
    try {
      // Simulate API call
      await api.updateTransaction(id, updatedFields);
      setTransactions(
        transactions.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
      );
      toast.success('Transaction updated successfully');
    } catch (error) {
      toast.error('Failed to update transaction');
      console.error('Update transaction error:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      // Simulate API call
      await api.deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      toast.success('Transaction deleted successfully');
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error('Delete transaction error:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        filters,
        setFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
