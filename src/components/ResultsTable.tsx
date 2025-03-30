import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Calendar, User, Wallet } from 'lucide-react';
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
    
    // Array of Indonesian day names
    const dayNames = [
      'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
    ];
    
    // Array of Indonesian month names
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    // Get day name, date, month name, year
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    // Format hours and minutes with leading zeros if needed
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Return the formatted date string
    return `${dayName}, ${day} ${monthName} ${year}, ${hours}:${minutes}`;
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
      <div className="p-4 bg-primary text-white sticky top-0 z-10">
        <h3 className="text-xl font-bold">THR Terhoki Tahun Ini</h3>
      </div>
      
      {/* Table container with fixed max height for scrollability */}
      <div className="overflow-y-auto max-h-80">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50">
                <th className="px-4 py-2.5 text-left whitespace-nowrap w-1/3 sticky top-0 bg-gray-50">
                  <button 
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => handleSort('name')}
                  >
                    <User size={15} className="mr-1.5" />
                    Nama
                    {sortField === 'name' && (
                      <ArrowUpDown size={12} className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-2.5 text-left whitespace-nowrap w-1/4 sticky top-0 bg-gray-50">
                  <button 
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => handleSort('amount')}
                  >
                    <Wallet size={15} className="mr-1.5" />
                    Jumlah
                    {sortField === 'amount' && (
                      <ArrowUpDown size={12} className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-2.5 text-left whitespace-nowrap w-2/5 sticky top-0 bg-gray-50">
                  <button 
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => handleSort('timestamp')}
                  >
                    <Calendar size={15} className="mr-1.5" />
                    Waktu
                    {sortField === 'timestamp' && (
                      <ArrowUpDown size={12} className="ml-1" />
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
                  key={recipient.timestamp} // Use timestamp as a unique key
                  className={`border-t border-gray-200 hover:bg-gray-50 ${
                    recipient.amount === highestAmount ? 'bg-yellow-50' : ''
                  }`}
                  variants={item}
                >
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 truncate max-w-[180px]">
                        {recipient.name}
                      </span>
                      {recipient.amount === highestAmount && (
                        <span className="ml-2 text-xs bg-gold text-primary-dark px-2 py-0.5 rounded-full whitespace-nowrap">
                          Terhoki!
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`font-medium ${
                      recipient.amount === highestAmount 
                        ? 'text-primary-dark' 
                        : 'text-gray-900'
                    }`}>
                      {formatCurrency(recipient.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(recipient.timestamp)}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;