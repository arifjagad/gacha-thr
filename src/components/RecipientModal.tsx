import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User } from 'lucide-react';
import { Recipient } from '../types';

interface RecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  recipients: Recipient[];
}

const RecipientModal: React.FC<RecipientModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  recipients
}) => {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [recentRecipients, setRecentRecipients] = useState<string[]>([]);
  const [alreadyParticipatedNames, setAlreadyParticipatedNames] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Get unique recent recipients (last 5, excluding those who already participated)
    const existingNames = new Set(recipients.map(r => r.name.toLowerCase()));
    setAlreadyParticipatedNames(existingNames);
    
    // No need to show recent recipients since we're not allowing repeats
    setRecentRecipients([]);
  }, [recipients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Nama penerima tidak boleh kosong');
      return;
    }
    
    // Check if this name has already participated
    if (alreadyParticipatedNames.has(trimmedName.toLowerCase())) {
      setError(`${trimmedName} sudah pernah menerima THR`);
      return;
    }
    
    onSubmit(trimmedName);
    setName('');
    setError('');
  };

  const checkNameAvailability = (inputName: string) => {
    const trimmedName = inputName.trim();
    
    if (trimmedName && alreadyParticipatedNames.has(trimmedName.toLowerCase())) {
      setError(`${trimmedName} sudah pernah menerima THR`);
    } else {
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden islamic-pattern"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-6 bg-white bg-opacity-95">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary-dark">Nama Penerima THR</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Masukkan Nama Penerima
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    checkNameAvailability(e.target.value);
                  }}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Nama Lengkap"
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
              <p className="mt-2 text-sm text-red-500">
                Setiap orang hanya boleh menerima THR satu kali.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!!error}
                className={`px-4 py-2 rounded-md ${
                  error 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                Mulai Gacha
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecipientModal;