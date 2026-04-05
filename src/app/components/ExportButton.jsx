import { useState } from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { exportToCSV, exportToJSON, generateFilename } from '../utils/export';
import { toast } from 'sonner';

export const ExportButton = ({ transactions }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    if (transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    setIsExporting(true);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      if (format === 'csv') {
        const filename = generateFilename('transactions', 'csv');
        exportToCSV(transactions, filename);
        toast.success(`Exported ${transactions.length} transactions to CSV`);
      } else {
        const filename = generateFilename('transactions', 'json');
        exportToJSON(transactions, filename);
        toast.success(`Exported ${transactions.length} transactions to JSON`);
      }
    } catch (error) {
      toast.error('Failed to export transactions');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      
      <AnimatePresence>
        <DropdownMenuContent align="end" className="w-48">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <DropdownMenuItem
              onClick={() => handleExport('csv')}
              className="cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => handleExport('json')}
              className="cursor-pointer"
            >
              <FileJson className="w-4 h-4 mr-2" />
              Export as JSON
            </DropdownMenuItem>
          </motion.div>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
  );
};
