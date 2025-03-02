import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Calendar, User, DollarSign } from 'lucide-react';
import { Recipient } from '../types';
import { formatCurrency } from '../utils/gacha';

interface ResultsTableProps {
  recipients: Recipient[];
}

type SortField = 'name' | 'amount' | 'timestamp';
type SortDirection = 'asc' | 'desc';

const ResultsTable: React.FC<ResultsTableProps> = ({ recipients }) => {
  const [sortField, setSortField] = useState<SortField>('amount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const sortedRecipients = [...recipients].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortField === 'timestamp') {
      comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Find the highest amount for highlighting
  const highestAmount = Math.max(...recipients.map(r => r.amount), 0);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (recipients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Belum ada penerima THR</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-primary text-white">
        <h3 className="text-xl font-bold">THR Terhoki Tahun Ini</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-primary"
                  onClick={() => handleSort('name')}
                >
                  <User size={16} className="mr-1" />
                  Nama
                  {sortField === 'name' && (
                    <ArrowUpDown size={14} className="ml-1" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-primary"
                  onClick={() => handleSort('amount')}
                >
                  <DollarSign size={16} className="mr-1" />
                  Jumlah
                  {sortField === 'amount' && (
                    <ArrowUpDown size={14} className="ml-1" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-primary"
                  onClick={() => handleSort('timestamp')}
                >
                  <Calendar size={16} className="mr-1" />
                  Waktu
                  {sortField === 'timestamp' && (
                    <ArrowUpDown size={14} className="ml-1" />
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
          >
            {sortedRecipients.map((recipient, index) => (
              <motion.tr 
                key={`${recipient.name}-${recipient.timestamp}`}
                className={`border-t border-gray-200 hover:bg-gray-50 ${
                  recipient.amount === highestAmount ? 'bg-yellow-50' : ''
                }`}
                variants={item}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {recipient.name}
                    {recipient.amount === highestAmount && (
                      <span className="ml-2 text-xs bg-gold text-primary-dark px-2 py-0.5 rounded-full">
                        Terhoki!
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${
                    recipient.amount === highestAmount 
                      ? 'text-primary-dark' 
                      : 'text-gray-900'
                  }`}>
                    {formatCurrency(recipient.amount)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(recipient.timestamp)}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;