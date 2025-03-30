import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Recipient } from '../types';
import { formatCurrency } from '../utils/gacha';

interface ShareImageProps {
  recipients: Recipient[];
  isOpen: boolean;
  onClose: () => void;
  shareId?: string;
}

const ShareImage: React.FC<ShareImageProps> = ({ 
  recipients, 
  isOpen, 
  onClose,
  shareId 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const shareRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Sort recipients by amount (highest first)
  const sortedRecipients = [...recipients].sort((a, b) => b.amount - a.amount);
  
  // Split recipients into chunks of 10 for multiple pages
  const recipientChunks = [];
  for (let i = 0; i < sortedRecipients.length; i += 10) {
    recipientChunks.push(sortedRecipients.slice(i, i + 10));
  }
  
  // Initialize refs array with the right length
  if (shareRefs.current.length !== recipientChunks.length) {
    shareRefs.current = Array(recipientChunks.length).fill(null);
  }
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Truncate text with ellipsis if longer than maxLength
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };
  
  const generateAndDownloadImages = async () => {
    if (shareRefs.current.some(ref => !ref)) return;
    
    setIsGenerating(true);
    
    try {
      // Process each chunk/page
      for (let pageIndex = 0; pageIndex < recipientChunks.length; pageIndex++) {
        const ref = shareRefs.current[pageIndex];
        if (!ref) continue;
        
        // Create a temporary clone of the content with fixed width for export
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = ref.outerHTML;
        const tempElement = tempContainer.firstChild as HTMLElement;
        
        // Set fixed width for the clone
        tempElement.style.width = '576px';
        tempElement.style.maxWidth = '576px';
        
        // Apply padding to table header elements
        const tableHeaders = ['nama-penerima', 'jumlah-thr'];
        tableHeaders.forEach(id => {
          const element = tempElement.querySelector(`#${id}`);
          if (element instanceof HTMLElement) {
            element.style.paddingBottom = '20px';
          }
        });
        
        // Apply padding to dynamic recipient row elements
        const chunk = recipientChunks[pageIndex];
        chunk.forEach((_, index) => {
          const nameElement = tempElement.querySelector(`#nama-penerima-key-${index}`);
          const amountElement = tempElement.querySelector(`#jumlah-thr-key-${index}`);
          
          if (nameElement instanceof HTMLElement) {
            nameElement.style.paddingBottom = '20px';
          }
          
          if (amountElement instanceof HTMLElement) {
            amountElement.style.paddingBottom = '20px';
          }
        });
        
        // Apply margin-top to total-penerima element
        const totalElement = tempElement.querySelector('#total-penerima');
        if (totalElement instanceof HTMLElement) {
          totalElement.style.marginTop = '-14px';
        }
        
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
        
        // Create and trigger download
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        
        // Name files with page numbers if multiple pages
        const pageSuffix = recipientChunks.length > 1 ? `-${pageIndex + 1}` : '';
        link.download = `THR-Lebaran-${new Date().getFullYear()}${pageSuffix}.png`;
        
        link.click();
        
        // Add a small delay between downloads to prevent browser issues
        if (pageIndex < recipientChunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setIsGenerating(false);
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
        className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-auto max-h-screen"
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
          
          {/* Status message */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-center text-gray-700">
              {recipientChunks.length > 1 
                ? `Data akan dipisahkan menjadi ${recipientChunks.length} gambar.` 
                : "Data akan diunduh sebagai gambar."}
            </p>
          </div>
          
          {/* Hidden containers for image generation */}
          <div className="hidden">
            {recipientChunks.map((chunk, pageIndex) => (
              <div 
                key={pageIndex}
                ref={el => shareRefs.current[pageIndex] = el}
                className="p-6 bg-gradient-to-br from-primary-light to-primary w-full"
              >
                <div className="bg-white bg-opacity-95 rounded-lg p-6 shadow-lg">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-primary-dark mb-1">
                      {shareId ? `THR Gacha Lebaran - By ${shareId}` : "THR Gacha Lebaran"}
                    </h3>
                    <p className="text-lg font-arabic text-primary">
                      عيد مبارك - Selamat Hari Raya
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(new Date())}
                    </p>
                    {recipientChunks.length > 1 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Halaman {pageIndex + 1} dari {recipientChunks.length}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-primary bg-opacity-10">
                          <th className="px-4 py-2 text-left text-primary-dark" id="nama-penerima">Nama</th>
                          <th className="px-4 py-2 text-right text-primary-dark" id="jumlah-thr">Jumlah THR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chunk.map((recipient, index) => (
                          <tr 
                            key={index}
                            className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100`}
                          >
                            <td className="px-4 py-3 font-medium" id={`nama-penerima-key-${index}`}>
                              {truncateText(recipient.name, 20)}
                            </td>
                            <td className="px-4 py-3 text-right font-medium" id={`jumlah-thr-key-${index}`}>
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
                    <span className="text-sm text-gray-500" id="total-penerima">
                      Total Penerima: {recipients.length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-4">
                    THR Gacha © {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={generateAndDownloadImages}
              disabled={isGenerating}
              className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-400"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Menghasilkan Gambar...
                </>
              ) : (
                <>
                  <Download size={18} className="mr-2" />
                  Download Gambar
                </>
              )}
            </button>
            
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