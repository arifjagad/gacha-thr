import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Recipient } from '../types';
import { formatCurrency } from '../utils/gacha';

interface ShareImageProps {
  recipients: Recipient[];
  isOpen: boolean;
  onClose: () => void;
}

const ShareImage: React.FC<ShareImageProps> = ({ recipients, isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const generateImage = async () => {
    if (!shareRef.current) return;
    
    setIsGenerating(true);
    
    try {
      // Create a temporary clone of the content with fixed width for export
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = shareRef.current.outerHTML;
      const tempElement = tempContainer.firstChild as HTMLElement;
      
      // Set fixed width for the clone
      tempElement.style.width = '576px';
      tempElement.style.maxWidth = '576px';
      
      // Hide the temp element but add to DOM for rendering
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      document.body.appendChild(tempElement);
      
      // Generate canvas from the temp element
      const canvas = await html2canvas(tempElement, {
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      
      // Remove temp element
      document.body.removeChild(tempElement);
      
      const image = canvas.toDataURL('image/png');
      setGeneratedImage(image);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `THR-Lebaran-${new Date().getFullYear()}.png`;
    link.click();
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Sort recipients by amount (highest first)
  const sortedRecipients = [...recipients].sort((a, b) => b.amount - a.amount);
  
  if (!isOpen) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        ref={containerRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary-dark">Bagikan Data Penerima THR</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
            <div 
              ref={shareRef}
              className="p-6 bg-gradient-to-br from-primary-light to-primary w-full"
            >
              <div className="bg-white bg-opacity-95 rounded-lg p-6 shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-primary-dark mb-1">
                    Daftar Penerima THR
                  </h3>
                  <p className="text-lg font-arabic text-primary">
                    عيد مبارك - Selamat Hari Raya
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(new Date())}
                  </p>
                </div>
                
                <div className="mb-6">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-primary bg-opacity-10">
                        <th className="px-4 py-2 text-left text-primary-dark">Nama</th>
                        <th className="px-4 py-2 text-right text-primary-dark">Jumlah THR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRecipients.map((recipient, index) => (
                        <tr 
                          key={index}
                          className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100`}
                        >
                          <td className="px-4 py-3 font-medium">{recipient.name}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            {formatCurrency(recipient.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center">
                  <img 
                    src="/ketupat-icon.svg" 
                    alt="Ketupat" 
                    className="w-10 h-10 mr-2"
                  />
                  <span className="text-sm text-gray-500">
                    Total Penerima: {recipients.length}
                  </span>
                </div>
                <p className="text-xs text-gray-400 text-center mt-4">
                  THR Gacha App © {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            {!generatedImage ? (
              <button
                onClick={generateImage}
                disabled={isGenerating}
                className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-400"
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Share2 size={18} className="mr-2" />
                    Generate Gambar
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={downloadImage}
                className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                <Download size={18} className="mr-2" />
                Download Gambar
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Tutup
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareImage;