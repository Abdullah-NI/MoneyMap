// Export transactions to CSV format
export const exportToCSV = (transactions, filename = 'transactions.csv') => {
  if (transactions.length === 0) {
    console.warn('No transactions to export');
    return;
  }

  // Define CSV headers
  const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];

  // Convert transactions to CSV rows
  const rows = transactions.map((t) => [
    t.date,
    t.type,
    t.category,
    t.amount.toString(),
    t.description || '',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape cells containing commas or quotes
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        })
        .join(',')
    ),
  ].join('\n');

  // Create blob and download
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

// Export transactions to JSON format
export const exportToJSON = (transactions, filename = 'transactions.json') => {
  if (transactions.length === 0) {
    console.warn('No transactions to export');
    return;
  }

  const jsonContent = JSON.stringify(transactions, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

// Helper function to trigger file download
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

// Generate filename with timestamp
export const generateFilename = (prefix, extension) => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}_${timestamp}.${extension}`;
};
