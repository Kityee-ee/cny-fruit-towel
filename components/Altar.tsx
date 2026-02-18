import React, { useRef } from 'react';
import { PlacedItem } from '../types';
import { FruitItem } from './FruitItem';
import { AnimatePresence } from 'framer-motion';

interface AltarProps {
  items: PlacedItem[];
  setItems: React.Dispatch<React.SetStateAction<PlacedItem[]>>;
  selectedItemId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateItem: (id: string, updates: Partial<PlacedItem>) => void;
  trashRef: React.RefObject<HTMLDivElement>;
}

export const Altar: React.FC<AltarProps> = ({ 
  items, 
  setItems, 
  selectedItemId, 
  onSelect,
  onUpdateItem,
  trashRef 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(item => item.uuid !== id));
    if (selectedItemId === id) onSelect(null);
  };

  // Background pattern component
  const Pattern = () => (
    <div className="absolute inset-0 opacity-10 pointer-events-none" 
         style={{ 
           backgroundImage: 'radial-gradient(#fbbf24 2px, transparent 2px)', 
           backgroundSize: '30px 30px' 
         }}>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex justify-center items-end pb-32 overflow-hidden bg-gradient-to-t from-red-900 to-red-800"
      onClick={() => onSelect(null)} // Click background to deselect
    >
      <Pattern />
      
      {/* Background Graphic */}
      <div className="absolute top-10 w-full text-center pointer-events-none opacity-30">
         <div className="font-calligraphy text-9xl text-yellow-500 drop-shadow-2xl">財</div>
         <div className="font-calligraphy text-6xl text-yellow-600 mt-4">2026</div>
      </div>

      {/* The Plate/Altar Table */}
      <div className="absolute bottom-24 flex flex-col items-center pointer-events-none z-0">
         <div className="w-80 h-24 md:w-96 md:h-32 bg-gradient-to-b from-yellow-200 to-yellow-600 rounded-[100%] border-b-8 border-yellow-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center transform translate-y-12">
            <div className="w-[90%] h-[80%] bg-gradient-to-b from-yellow-100 to-yellow-500 rounded-[100%] border border-yellow-300/50"></div>
         </div>
         <div className="w-[120%] h-20 bg-red-950 translate-y-[-20px] -z-10 rounded-t-lg shadow-2xl"></div>
      </div>

      {/* Fruits Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <AnimatePresence>
          {items.map(item => (
            <FruitItem 
              key={item.uuid} 
              item={item} 
              isSelected={selectedItemId === item.uuid}
              onSelect={onSelect}
              onUpdateItem={onUpdateItem} 
              onRemove={handleRemove}
              containerRef={containerRef}
              trashRef={trashRef}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Instructions */}
      {items.length === 0 && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-yellow-200/50 text-xl font-bold animate-pulse">点击下方水果开始摆放</p>
         </div>
      )}
    </div>
  );
};
