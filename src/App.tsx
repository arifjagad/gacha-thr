import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Gift } from 'lucide-react';

// Components
import ConfigModal from './components/ConfigModal';
import RecipientModal from './components/RecipientModal';
import GachaAnimation from './components/GachaAnimation';
import ResultsTable from './components/ResultsTable';
import ShareImage from './components/ShareImage';
import ConfirmationDialog from './components/ConfirmationDialog';
import Header from './components/Header';
import Footer from './components/Footer';

// Types and Utils
import { AppState, THRRate, Recipient } from './types';
import { saveState, loadState, resetAllData } from './utils/storage';
import { performGachaRoll, validateRates } from './utils/gacha';

const DEFAULT_RATES: THRRate[] = [
  { amount: 10000, rate: 50, id: uuidv4() },
  { amount: 50000, rate: 30, id: uuidv4() },
  { amount: 100000, rate: 20, id: uuidv4() }
];

const DEFAULT_STATE: AppState = {
  rates: DEFAULT_RATES,
  recipients: [],
  totalRolls: 0,
  isConfigured: false,
  initialFreeRolls: 1
};

function App() {
  // App State
  const [appState, setAppState] = useState<AppState>(DEFAULT_STATE);
  
  // UI State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  
  // Gacha State
  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const [currentRecipient, setCurrentRecipient] = useState<string>('');
  
  // Load state from localStorage on initial render
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setAppState(savedState);
    } else {
      // Show config modal on first visit
      setShowConfigModal(true);
    }
  }, []);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(appState);
  }, [appState]);
  
  // Handle configuration save
  const handleSaveConfig = (rates: THRRate[], initialFreeRolls: number) => {
    if (validateRates(rates)) {
      setAppState(prev => ({
        ...prev,
        rates,
        initialFreeRolls,
        isConfigured: true
      }));
    }
  };
  
  // Handle reset all data
  const handleResetAll = () => {
    resetAllData();
    setAppState(DEFAULT_STATE);
    setShowConfigModal(true);
  };
  
  // Handle recipient submission
  const handleRecipientSubmit = (name: string) => {
    setCurrentRecipient(name);
    setShowRecipientModal(false);
    
    // Start the gacha roll
    setIsRolling(true);
    const result = performGachaRoll(appState.rates);
    // console.log('Gacha roll result:', result); // Debug log
    setCurrentResult(result.amount);
    
    // Update app state with the new roll
    setAppState(prev => ({
      ...prev,
      totalRolls: prev.totalRolls + 1
    }));
  };
  
  // Handle gacha roll completion
  const handleRollComplete = () => {
    // console.log('Roll complete. Current result:', currentResult, 'Current recipient:', currentRecipient); // Debug log
    if (currentResult !== null && currentRecipient) {
      // Add the recipient to the list
      const newRecipient: Recipient = {
        name: currentRecipient,
        amount: currentResult,
        timestamp: new Date().toISOString(),
        freeRollsRemaining: appState.initialFreeRolls - 1
      };
      
      setAppState(prev => ({
        ...prev,
        recipients: [...prev.recipients, newRecipient]
      }));
      
      // Reset current roll state
      setIsRolling(false);
      setCurrentResult(null);
      setCurrentRecipient('');
    }
  };
  
  // Create floating ketupat elements for background
  const renderFloatingKetupatElements = () => {
    const elements = [];
    for (let i = 0; i < 5; i++) {
      const size = 30 + Math.random() * 40;
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 15 + Math.random() * 10;
      
      elements.push(
        <div 
          key={i}
          className="absolute opacity-10"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `-${size}px`,
            animation: `floating ${duration}s ease-in-out ${delay}s infinite`
          }}
        >
          <img 
            src="/ketupat-icon.svg" 
            alt="Ketupat" 
            className="w-full h-full"
          />
        </div>
      );
    }
    return elements;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 islamic-pattern">
      <Header 
        onEditRates={() => setShowConfigModal(true)}
        onReset={() => setShowResetConfirmation(true)}
        onShare={() => setShowShareModal(true)}
        hasRecipients={appState.recipients.length > 0}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 relative overflow-hidden">
        {/* Floating Ketupat Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {renderFloatingKetupatElements()}
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Main Gacha Section */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 mb-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 left-0 w-full h-full ketupat-pattern opacity-5"></div>
            
            <div className="relative">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-primary-dark mb-2">
                  THR Gacha Lebaran
                </h2>
                <p className="text-gray-600">
                  Dapatkan THR dengan cara yang menyenangkan!
                </p>
              </div>
              
              {/* Gacha Animation Area */}
              <GachaAnimation 
                isRolling={isRolling}
                result={currentResult}
                onComplete={handleRollComplete}
              />
              
              {/* Roll Button */}
              {!isRolling && !currentResult && (
                <div className="text-center mt-6">
                  <motion.button
                    onClick={() => setShowRecipientModal(true)}
                    className="px-6 py-3 bg-primary text-white rounded-full text-lg font-semibold shadow-lg hover:bg-primary-dark transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Gift className="inline-block mr-2" size={20} />
                    Roll THR
                  </motion.button>
                  
                  {appState.rates.length > 0 && (
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Konfigurasi THR:</p>
                      <ul className="flex flex-wrap justify-center gap-2 mt-1">
                        {appState.rates.map((rate) => (
                          <li 
                            key={rate.id}
                            className="bg-gray-100 px-2 py-1 rounded-md"
                          >
                            Rp {rate.amount.toLocaleString('id-ID')} - {rate.rate}%
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Results Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ResultsTable recipients={appState.recipients} />
          </motion.div>
        </div>
      </main>
      
      <Footer />
      
      {/* Modals */}
      <AnimatePresence>
        {showConfigModal && (
          <ConfigModal 
            isOpen={showConfigModal}
            onClose={() => setShowConfigModal(false)}
            onSave={handleSaveConfig}
            initialRates={appState.rates}
            initialFreeRolls={appState.initialFreeRolls}
          />
        )}
        
        {showRecipientModal && (
          <RecipientModal 
            isOpen={showRecipientModal}
            onClose={() => setShowRecipientModal(false)}
            onSubmit={handleRecipientSubmit}
            recipients={appState.recipients}
          />
        )}
        
        {showShareModal && (
          <ShareImage 
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            recipients={appState.recipients}
          />
        )}
        
        {showResetConfirmation && (
          <ConfirmationDialog 
            isOpen={showResetConfirmation}
            onClose={() => setShowResetConfirmation(false)}
            onConfirm={handleResetAll}
            title="Reset Semua Data"
            message="Apakah Anda yakin ingin menghapus semua data THR? Tindakan ini tidak dapat dibatalkan."
            confirmText="Ya, Reset"
            cancelText="Batal"
            type="danger"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;