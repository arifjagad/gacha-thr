import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { X, Plus, Trash2 } from 'lucide-react';
import { THRRate } from '../types';
import { validateRates } from '../utils/gacha';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rates: THRRate[], initialFreeRolls: number) => void;
  initialRates?: THRRate[];
  initialFreeRolls?: number;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialRates,
  initialFreeRolls = 1
}) => {
  const [rates, setRates] = useState<THRRate[]>(initialRates || [
    { amount: 10000, rate: 50, id: uuidv4() },
    { amount: 50000, rate: 30, id: uuidv4() },
    { amount: 100000, rate: 20, id: uuidv4() }
  ]);
  
  const [freeRolls, setFreeRolls] = useState<number>(initialFreeRolls);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [totalRate, setTotalRate] = useState<number>(100);

  useEffect(() => {
    const total = rates.reduce((sum, rate) => sum + rate.rate, 0);
    setTotalRate(total);
    setIsValid(validateRates(rates));
  }, [rates]);

  const handleAddRate = () => {
    setRates([...rates, { amount: 0, rate: 0, id: uuidv4() }]);
  };

  const handleRemoveRate = (id: string) => {
    if (rates.length > 1) {
      setRates(rates.filter(rate => rate.id !== id));
    }
  };

  const handleRateChange = (id: string, field: 'amount' | 'rate', value: number) => {
    setRates(rates.map(rate => 
      rate.id === id ? { ...rate, [field]: value } : rate
    ));
  };

  const handleSave = () => {
    if (isValid) {
      onSave(rates, freeRolls);
      onClose();
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
            <h2 className="text-2xl font-bold text-primary-dark">Konfigurasi THR</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Free Roll per Penerima
            </label>
            <input
              type="number"
              min="1"
              value={freeRolls}
              onChange={(e) => setFreeRolls(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Denominasi THR</h3>
              <button 
                onClick={handleAddRate}
                className="flex items-center text-sm bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition-colors"
              >
                <Plus size={16} className="mr-1" /> Tambah
              </button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {rates.map((rate) => (
                <div key={rate.id} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Jumlah (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      value={rate.amount}
                      onChange={(e) => handleRateChange(rate.id, 'amount', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Persentase (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={rate.rate}
                      onChange={(e) => handleRateChange(rate.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <button 
                    onClick={() => handleRemoveRate(rate.id)}
                    className="mt-6 text-red hover:text-red-dark"
                    disabled={rates.length <= 1}
                  >
                    <Trash2 size={20} className="text-red" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className={`mt-4 text-sm ${isValid ? 'text-green-600' : 'text-red'}`}>
              Total: {totalRate.toFixed(1)}% {isValid ? '✓' : `(Harus 100%)`}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`px-4 py-2 rounded-md text-white ${
                isValid 
                  ? 'bg-primary hover:bg-primary-dark' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Simpan Konfigurasi
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfigModal;