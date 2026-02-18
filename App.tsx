import React, { useState, useRef } from 'react';
import { PlacedItem, FruitType } from './types';
import { FruitPicker } from './components/FruitPicker';
import { Altar } from './components/Altar';
import { BlessingModal } from './components/BlessingModal';
import { generateBlessing } from './services/geminiService';
import { soundService } from './services/soundService';
import { RotateCcw, Sparkles, Trash2 } from 'lucide-react';

// Simple UUID generator
const simpleId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blessingData, setBlessingData] = useState<{ blessing: string, luckyNumbers: number[] } | null>(null);
  const [loading, setLoading] = useState(false);
  
  const trashRef = useRef<HTMLDivElement>(null);

  const getCenterPosition = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return { x: w / 2, y: h - 250 };
  };

  const handleAddFruit = (type: FruitType) => {
    soundService.playSpawn();
    const center = getCenterPosition();
    const randomOffset = () => (Math.random() - 0.5) * 40;
    
    const newItem: PlacedItem = {
      uuid: simpleId(),
      type,
      x: center.x + randomOffset(), 
      y: center.y - (items.length * 15) + randomOffset(),
      rotation: (Math.random() - 0.5) * 20,
      scale: 1,
      zIndex: items.length + 1
    };
    
    setItems(prev => [...prev, newItem]);
    setSelectedItemId(newItem.uuid); // Auto-select new item
  };

  const handleUpdateItem = (id: string, updates: Partial<PlacedItem>) => {
    setItems(prev => prev.map(item => 
      item.uuid === id ? { ...item, ...updates } : item
    ));
  };

  const handleReset = () => {
    if (confirm("确定要清空水果塔重新开始吗？(Clear all?)")) {
      soundService.playDelete();
      setItems([]);
      setBlessingData(null);
      setSelectedItemId(null);
    }
  };

  const handlePray = async () => {
    if (items.length === 0) {
      alert("请先摆放水果供品！(Please place some fruits first)");
      return;
    }
    
    setIsModalOpen(true);
    if (!blessingData) {
      setLoading(true);
      try {
        const result = await generateBlessing(items);
        setBlessingData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col relative text-yellow-50 bg-red-900">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-50 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
           <button 
             onClick={handleReset}
             className="bg-red-900/80 backdrop-blur text-yellow-200 p-3 rounded-full border border-yellow-600/50 hover:bg-red-800 transition shadow-lg"
             title="Reset"
           >
             <RotateCcw size={20} />
           </button>
        </div>

        <div className="pointer-events-auto">
           <button 
             onClick={handlePray}
             className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-red-900 font-bold py-2 px-6 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center gap-2 hover:scale-105 transition animate-bounce-slow"
           >
             <Sparkles size={20} />
             <span>拜财神 (Pray)</span>
           </button>
        </div>
      </div>

      {/* Trash Bin - Repositioned to Top Left */}
      <div 
        ref={trashRef}
        className="fixed top-20 left-4 z-40 p-4 border-2 border-dashed border-red-400/50 rounded-2xl bg-red-950/50 backdrop-blur-sm text-red-300 transition-colors hover:bg-red-800/80 hover:border-red-400 hover:text-red-100 flex flex-col items-center justify-center gap-1 group"
      >
        <Trash2 size={32} />
        <span className="text-xs font-bold opacity-70 group-hover:opacity-100">拖到这里删除</span>
      </div>

      {/* Main Area */}
      <main className="flex-1 relative">
        <Altar 
          items={items} 
          setItems={setItems} 
          selectedItemId={selectedItemId}
          onSelect={setSelectedItemId}
          onUpdateItem={handleUpdateItem}
          trashRef={trashRef}
        />
      </main>
      
      {/* Bottom Picker */}
      <FruitPicker onAdd={handleAddFruit} />

      {/* Modals */}
      <BlessingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        blessing={blessingData?.blessing || ''}
        luckyNumbers={blessingData?.luckyNumbers || []}
        loading={loading}
      />
    </div>
  );
};

export default App;
