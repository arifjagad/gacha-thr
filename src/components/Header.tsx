import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Settings, RefreshCw, Share2, Link } from 'lucide-react';

interface HeaderProps {
  onEditRates: () => void;
  onReset: () => void;
  onShare: () => void;
  onShareLink: () => void;
  hasRecipients: boolean;
  isShared?: boolean;
  isViewMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onEditRates, 
  onReset, 
  onShare,
  onShareLink,
  hasRecipients,
  isShared = false,
  isViewMode = false
}) => {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
            >
              <Gift size={32} className="mr-3" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">THR Gacha</h1>
              <p className="text-sm text-primary-light font-arabic">عيد مبارك - Selamat Hari Raya</p>
            </div>
          </div>
          
          {/* Always render a div to maintain consistent padding/spacing */}
          <div className="flex flex-wrap gap-2 justify-center">
            {/* Only show Edit Rates, Share Link, Reset buttons if not in view mode */}
            {!isViewMode && (
              <>
                <button
                  onClick={onEditRates}
                  className="flex items-center px-3 py-2 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors"
                >
                  <Settings size={18} className="mr-1" />
                  <span className="text-sm">Edit Rates</span>
                </button>
                
                <button
                  onClick={onShareLink}
                  className="flex items-center px-3 py-2 bg-gold text-primary-dark rounded-md hover:bg-opacity-90 transition-colors"
                >
                  <Link size={18} className="mr-1" />
                  <span className="text-sm">{isShared ? 'Link Berbagi' : 'Buat Link'}</span>
                </button>
                
                <button
                  onClick={onReset}
                  className="flex items-center px-3 py-2 bg-red bg-opacity-80 rounded-md hover:bg-opacity-100 transition-colors"
                >
                  <RefreshCw size={18} className="mr-1" />
                  <span className="text-sm">Reset</span>
                </button>
              </>
            )}
            
            {/* Always show Share Image button regardless of mode */}
            <button
              onClick={onShare}
              disabled={!hasRecipients}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                hasRecipients 
                  ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
                  : 'bg-white bg-opacity-10 cursor-not-allowed text-white text-opacity-50'
              }`}
            >
              <Share2 size={18} className="mr-1" />
              <span className="text-sm">Share Gambar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;