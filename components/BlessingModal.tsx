import React from 'react';
import { motion } from 'framer-motion';

interface BlessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  blessing: string;
  luckyNumbers: number[];
  loading: boolean;
}

export const BlessingModal: React.FC<BlessingModalProps> = ({ isOpen, onClose, blessing, luckyNumbers, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={loading ? undefined : onClose}></div>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-red-800 border-4 border-yellow-500 rounded-2xl p-8 max-w-lg w-full shadow-2xl overflow-hidden"
      >
        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br-lg"></div>

        <div className="text-center">
          <h2 className="text-3xl font-calligraphy text-yellow-400 mb-6 drop-shadow-md">✨ 财神赐福 ✨</h2>
          
          {loading ? (
             <div className="flex flex-col items-center py-8">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-yellow-100 animate-pulse">财神正在为您写诗...</p>
             </div>
          ) : (
            <>
              <div className="bg-red-900/50 p-6 rounded-lg border border-yellow-500/30 mb-6">
                <p className="text-xl md:text-2xl text-yellow-100 leading-loose font-serif whitespace-pre-line">
                  {blessing}
                </p>
              </div>

              <div className="mb-8">
                <p className="text-yellow-400/80 text-sm mb-2 uppercase tracking-widest">您的幸运号码</p>
                <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
                  {luckyNumbers.map((num, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-full flex items-center justify-center text-red-900 font-bold text-lg shadow-lg border-2 border-yellow-200"
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </div>

              <button 
                onClick={onClose}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-red-900 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:from-yellow-400 hover:to-yellow-500 transform transition hover:scale-105 active:scale-95"
              >
                谢财神 (Close)
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
