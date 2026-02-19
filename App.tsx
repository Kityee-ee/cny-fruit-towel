import React, { useState, useRef, useEffect } from 'react';
import { PlacedItem, FruitType } from './types';
import { FruitPicker } from './components/FruitPicker';
import { Altar } from './components/Altar';
import { BlessingModal } from './components/BlessingModal';
import { generateBlessing } from './services/geminiService';
import { soundService } from './services/soundService';
import { RotateCcw, Sparkles, Trash2, Music, Volume2, VolumeX } from 'lucide-react';

// Simple UUID generator
const simpleId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blessingData, setBlessingData] = useState<{ blessing: string, luckyNumbers: number[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const trashRef = useRef<HTMLDivElement>(null);

  // Initialize background music
  useEffect(() => {
    // Initialize music - the file should be in public/assets/
    // Supports: .mp3, .wav, .ogg, .m4a
    soundService.initBackgroundMusic('/assets/festive-music.wav').catch(() => {
      // If music file doesn't exist, that's okay - it will just be silent
      // You can use .mp3, .wav, .ogg, or .m4a - just update the filename above
      console.log('Background music file not found. Please add festive-music.wav (or .mp3/.ogg/.m4a) to public/assets/');
    });
  }, []);

  // Unlock audio on first user interaction (required for mobile browsers)
  useEffect(() => {
    const unlockAudio = () => {
      soundService.unlockAudio();
    };

    // Try to unlock on mount (works on desktop)
    unlockAudio();

    // Also unlock on first touch/click (required for mobile)
    const events = ['touchstart', 'touchend', 'mousedown', 'click'];
    const handleFirstInteraction = () => {
      unlockAudio();
      // Remove listeners after first interaction
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };

    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, []);

  // Sync music playing state
  useEffect(() => {
    const checkMusicState = () => {
      setIsMusicPlaying(soundService.getMusicPlaying());
    };
    
    // Check periodically to sync state
    const interval = setInterval(checkMusicState, 500);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMusic = async () => {
    try {
      await soundService.toggleBackgroundMusic();
      // Update state after a brief delay to ensure the music state has changed
      setTimeout(() => {
        setIsMusicPlaying(soundService.getMusicPlaying());
      }, 100);
    } catch (error) {
      console.error('Failed to toggle music:', error);
    }
  };

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
    // Immediate reset without confirmation
    soundService.playDelete();
    setItems([]);
    setBlessingData(null);
    setSelectedItemId(null);
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
      <div className="fixed top-0 left-0 right-0 p-4 z-50 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
           <button 
             onClick={handleReset}
             className="bg-red-900/80 backdrop-blur text-yellow-200 py-2 px-4 rounded-full border border-yellow-600/50 hover:bg-red-800 transition shadow-lg flex items-center gap-2"
             title="Reset"
           >
             <RotateCcw size={18} />
             <span className="text-sm font-bold">重置</span>
           </button>
           <button 
             onClick={handleToggleMusic}
             className="bg-red-900/80 backdrop-blur text-yellow-200 py-2 px-3 rounded-full border border-yellow-600/50 hover:bg-red-800 transition shadow-lg flex items-center gap-2 cursor-pointer z-50"
             title={isMusicPlaying ? "Pause Music" : "Play Music"}
             type="button"
           >
             {isMusicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
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

      {/* Trash Bin - Repositioned to Top Left, adjusted for spacing */}
      <div 
        ref={trashRef}
        className="fixed top-24 left-4 z-40 p-4 border-2 border-dashed border-red-400/50 rounded-2xl bg-red-950/50 backdrop-blur-sm text-red-300 transition-colors hover:bg-red-800/80 hover:border-red-400 hover:text-red-100 flex flex-col items-center justify-center gap-1 group"
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