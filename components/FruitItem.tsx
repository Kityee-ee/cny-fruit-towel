import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { PlacedItem, FruitType } from '../types';
import { FRUIT_DEFS } from '../constants';
import { soundService } from '../services/soundService';

interface FruitItemProps {
  item: PlacedItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<PlacedItem>) => void;
  onRemove: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  trashRef: React.RefObject<HTMLDivElement>;
}

export const FruitItem: React.FC<FruitItemProps> = ({ 
  item, 
  isSelected, 
  onSelect, 
  onUpdateItem, 
  onRemove, 
  trashRef 
}) => {
  const def = FRUIT_DEFS[item.type];
  const isSticker = def.category === 'sticker';
  const isFu = item.type === FruitType.STICKER_FU;
  const isImage = !!def.imageUrl;

  const ref = useRef<HTMLDivElement>(null);

  // Motion values for performant gesture handling
  const x = useMotionValue(item.x);
  const y = useMotionValue(item.y);
  const scale = useMotionValue(item.scale);
  const rotate = useMotionValue(item.rotation);

  useEffect(() => {
    x.set(item.x);
    y.set(item.y);
    scale.set(item.scale);
    rotate.set(item.rotation);
  }, [item.x, item.y, item.scale, item.rotation]);

  useGesture({
    onDrag: ({ offset: [ox, oy], xy: [client_x, client_y], first, last, down }) => {
      // Sound: Pickup
      if (first) {
        soundService.playPickup();
      }

      x.set(ox);
      y.set(oy);
      
      if (down && !isSelected) onSelect(item.uuid);

      if (last) {
        if (trashRef.current) {
          const trashRect = trashRef.current.getBoundingClientRect();
          if (
            client_x >= trashRect.left && 
            client_x <= trashRect.right && 
            client_y >= trashRect.top && 
            client_y <= trashRect.bottom
          ) {
            // Sound: Delete
            soundService.playDelete();
            onRemove(item.uuid);
            return;
          }
        }
        // Sound: Drop
        soundService.playDrop();
        onUpdateItem(item.uuid, { x: ox, y: oy });
      }
    },
    onPinch: ({ offset: [s, a], last, down }) => {
      scale.set(s);
      rotate.set(a);
      
      if (down && !isSelected) onSelect(item.uuid);

      if (last) {
        onUpdateItem(item.uuid, { scale: s, rotation: a });
      }
    },
    onClick: ({ event }) => {
      event.stopPropagation();
      onSelect(item.uuid);
    }
  }, {
    target: ref,
    drag: { from: () => [x.get(), y.get()] },
    pinch: { from: () => [scale.get(), rotate.get()], scaleBounds: { min: 0.5, max: 3 } }
  });

  return (
    <motion.div
      ref={ref}
      style={{
        x,
        y,
        rotate,
        scale: useTransform(scale, s => s * def.scale),
        position: 'absolute',
        top: 0, 
        left: 0,
        zIndex: isSelected ? 999 : item.zIndex,
        userSelect: 'none',
        fontSize: '4rem',
        filter: isSticker 
                ? 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))' 
                : 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))',
        touchAction: 'none',
        cursor: 'grab',
        pointerEvents: 'auto'
      }}
      className="flex justify-center items-center"
    >
      <div className={`relative transition-all duration-200 ${isSelected ? 'bg-white/10 rounded-full' : ''}`}>
         {isImage ? (
           <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
             <img src={def.imageUrl} alt={def.name} className="w-full h-full object-contain pointer-events-none" />
           </div>
         ) : isFu ? (
           <div className="bg-red-600 w-16 h-16 flex items-center justify-center shadow-sm transform rotate-45 border border-yellow-800/20">
              <span className="text-black font-calligraphy text-5xl transform -rotate-45 block leading-none mt-[-5px]">{def.emoji}</span>
           </div>
         ) : (
           <>
             {def.emoji}
             {!isSticker && (
                <div className="absolute inset-0 bg-white opacity-10 rounded-full blur-xl transform -translate-y-2 scale-75 pointer-events-none"></div>
             )}
           </>
         )}
      </div>
    </motion.div>
  );
};
