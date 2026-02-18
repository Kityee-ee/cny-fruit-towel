import React from 'react';
import { Sliders, RotateCw, Maximize, X } from 'lucide-react';
import { PlacedItem, FruitType } from '../types';
import { FRUIT_DEFS } from '../constants';

interface EditPanelProps {
  item: PlacedItem;
  onUpdate: (id: string, updates: Partial<PlacedItem>) => void;
  onClose: () => void;
}

export const EditPanel: React.FC<EditPanelProps> = ({ item, onUpdate, onClose }) => {
  const def = FRUIT_DEFS[item.type];

  return (
    <div className="absolute top-20 right-4 z-50 w-64 bg-red-900/90 backdrop-blur-md border border-yellow-500/50 rounded-xl shadow-2xl p-4 text-yellow-100 animate-in fade-in slide-in-from-right-10">
      <div className="flex justify-between items-center mb-4 border-b border-yellow-500/30 pb-2">
        <h3 className="font-bold text-yellow-400 flex items-center gap-2">
          {def.emoji} {def.name}
        </h3>
        <button onClick={onClose} className="hover:text-yellow-400">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Scale Control */}
        <div>
          <div className="flex justify-between text-xs mb-1 text-yellow-200/80">
            <span className="flex items-center gap-1"><Maximize size={12}/> 大小 (Size)</span>
            <span>{(item.scale).toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={item.scale}
            onChange={(e) => onUpdate(item.uuid, { scale: parseFloat(e.target.value) })}
            className="w-full h-2 bg-red-950 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>

        {/* Rotation Control */}
        <div>
          <div className="flex justify-between text-xs mb-1 text-yellow-200/80">
            <span className="flex items-center gap-1"><RotateCw size={12}/> 旋转 (Rotate)</span>
            <span>{Math.round(item.rotation)}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            step="5"
            value={item.rotation}
            onChange={(e) => onUpdate(item.uuid, { rotation: parseFloat(e.target.value) })}
            className="w-full h-2 bg-red-950 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>
      </div>
    </div>
  );
};
