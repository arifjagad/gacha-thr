import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check, Share2, AlertTriangle } from 'lucide-react';
import { saveToSupabase, checkShareIdExists } from '../utils/supabase';
import { THRRate, Recipient } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: THRRate[];
  recipients: Recipient[];
}

const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  rates,
  recipients
}) => {
  const [shareId, setShareId] = useState<string>('');
  const [isValidId, setIsValidId] = useState<boolean>(true);
  const [isIdAvailable, setIsIdAvailable] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Check if share ID is valid and available
  useEffect(() => {
    const checkId = async () => {
      if (!shareId) {
        setIsValidId(true);
        setIsIdAvailable(true);
        return;
      }
      
      // Check if ID is valid (alphanumeric, dash, underscore only)
      const isValid = /^[a-zA-Z0-9_-]+$/.test(shareId);
      setIsValidId(isValid);
      
      if (isValid) {
        setIsChecking(true);
        const exists = await checkShareIdExists(shareId);
        setIsIdAvailable(!exists);
        setIsChecking(false);
      }
    };
    
    const debounce = setTimeout(checkId, 500);
    return () => clearTimeout(debounce);
  }, [shareId]);
  
  const handleCreateShare = async () => {
    if (!shareId || !isValidId || !isIdAvailable) return;
    
    setIsSaving(true);
    setError('');
    
    try {
      const success = await saveToSupabase(shareId, rates, recipients);
      
      if (success) {
        const url = `${window.location.origin}/?share=${shareId}`;
        setShareUrl(url);
      } else {
        setError('Gagal menyimpan data. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Error creating share:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <h2 className="text-2xl font-bold text-primary-dark">Bagikan THR Gacha</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          
          {!shareUrl ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Buat ID unik untuk berbagi THR Gacha ini dengan orang lain. 
                  Mereka dapat melakukan gacha THR di link yang kamu bagikan.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Berbagi (hanya huruf, angka, - dan _)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={shareId}
                      onChange={(e) => setShareId(e.target.value.trim())}
                      className={`w-full p-3 border rounded-md focus:ring-primary focus:border-primary ${
                        !isValidId || !isIdAvailable 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="contoh: thr-lebaran-2025"
                    />
                    {isChecking && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  {!isValidId && (
                    <p className="mt-2 text-sm text-red-500">
                      ID hanya boleh berisi huruf, angka, - dan _
                    </p>
                  )}
                  
                  {isValidId && !isIdAvailable && (
                    <p className="mt-2 text-sm text-red-500">
                      ID ini sudah digunakan. Silakan pilih ID lain.
                    </p>
                  )}
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center">
                      <AlertTriangle size={18} className="text-red-500 mr-2" />
                      <p className="text-sm text-red-500">{error}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateShare}
                  disabled={!shareId || !isValidId || !isIdAvailable || isChecking || isSaving}
                  className={`px-4 py-2 rounded-md text-white flex items-center ${
                    !shareId || !isValidId || !isIdAvailable || isChecking || isSaving
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-dark'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Share2 size={18} className="mr-2" />
                      Buat Link Berbagi
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Link berbagi berhasil dibuat! Salin link di bawah ini dan bagikan kepada orang lain.
                </p>
                
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="w-full p-3 pr-12 border border-gray-300 rounded-md bg-gray-50"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-2 top-2 p-1 text-gray-500 hover:text-primary"
                    title="Salin ke clipboard"
                  >
                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
                
                <div className="p-3 bg-primary bg-opacity-10 border border-primary-light rounded-md">
                  <p className="text-sm text-primary-dark">
                    <strong>Catatan:</strong> Semua perubahan pada konfigurasi dan penerima THR akan otomatis disimpan ke link berbagi ini.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Tutup
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareModal;