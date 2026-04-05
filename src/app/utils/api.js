// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service
export const api = {
  // Get all transactions
  getTransactions: async () => {
    await delay(500);
    // This will be integrated with localStorage in AppContext
    return [];
  },

  // Create a new transaction
  createTransaction: async (
    transaction
  ) => {
    await delay(300);
    
    const newTransaction = {
      id: generateId(),
      ...transaction,
    };
    
    return newTransaction;
  },

  // Update an existing transaction
  updateTransaction: async (
    id,
    updates
  ) => {
    await delay(300);
    
    // In a real app, this would update on the server
    return {
      id,
      ...updates,
    };
  },

  // Delete a transaction
  deleteTransaction: async (id) => {
    await delay(300);
    // In a real app, this would delete from the server
  },

  // Get transactions with filters
  getFilteredTransactions: async (params) => {
    await delay(400);
    // Filtering logic would be applied here in a real API
    return [];
  },
};

// Generate unique ID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export { generateId };
