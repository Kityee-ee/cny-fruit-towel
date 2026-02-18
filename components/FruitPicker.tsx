import React from 'react';
import { FruitType } from '../types';
import { FRUIT_DEFS } from '../constants';

interface FruitPickerProps {
  onAdd: (type: FruitType) => void;
}

export const FruitPicker: React.FC<FruitPickerProps> = ({ onAdd }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-950/90 border-t-4 border-yellow-600 p-4 z-50 backdrop-blur-md">
      <div className="flex overflow-x-auto gap-4 pb-2 items-center justify-start md:justify-center px-4 no-scrollbar">
        {Object.values(FRUIT_DEFS).map((def) => (
          <button
            key={def.id}
            onClick={() => onAdd(def.id)}
            className="flex flex-col items-center justify-center flex-shrink-0 group transition-transform active:scale-90"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-900/50 rounded-xl border-2 border-yellow-600/30 group-hover:border-yellow-500 group-hover:bg-red-800 flex items-center justify-center text-4xl md:text-5xl shadow-lg relative overflow-hidden">
               {/* Glow effect */}
               <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
               {def.imageUrl ? (
                 <img src={def.imageUrl} alt={def.name} className="w-4/5 h-4/5 object-contain drop-shadow-md" />
               ) : (
                 def.emoji
               )}
            </div>
            <span className="text-yellow-100 text-xs md:text-sm mt-1 font-bold shadow-black drop-shadow-md">{def.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
