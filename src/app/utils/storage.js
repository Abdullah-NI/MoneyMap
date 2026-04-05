// Local Storage utility functions

const STORAGE_KEYS = {
  TRANSACTIONS: 'financeHub_transactions',
  THEME: 'financeHub_theme',
  FILTERS: 'financeHub_filters',
};

export const storage = {
  // Get data from localStorage
  get: (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  // Set data to localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  },

  // Remove data from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  },

  // Clear all app data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      storage.remove(key);
    });
  },
};

export { STORAGE_KEYS };
