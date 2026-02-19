import { FruitType, FruitDef } from './types';

// Custom SVG for Shine Muscat to ensure it looks like the premium green grapes
const SHINE_MUSCAT_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 130'><defs><radialGradient id='grad' cx='35%25' cy='35%25' r='60%25'><stop offset='0%25' stop-color='%23f7ffe6'/><stop offset='40%25' stop-color='%23aef233'/><stop offset='100%25' stop-color='%235b9100'/></radialGradient><filter id='shadow'><feDropShadow dx='0' dy='2' stdDeviation='2' flood-color='%23000' flood-opacity='0.2'/></filter></defs><path d='M50 15 C 50 15, 52 5, 58 0' stroke='%235c4d28' stroke-width='3' fill='none' stroke-linecap='round' /><g filter='url(%23shadow)'><circle cx='50' cy='115' r='11' fill='url(%23grad)' /><circle cx='39' cy='100' r='12' fill='url(%23grad)' /><circle cx='61' cy='100' r='12' fill='url(%23grad)' /><circle cx='28' cy='83' r='12.5' fill='url(%23grad)' /><circle cx='50' cy='85' r='12.5' fill='url(%23grad)' /><circle cx='72' cy='83' r='12.5' fill='url(%23grad)' /><circle cx='20' cy='64' r='12.5' fill='url(%23grad)' /><circle cx='40' cy='66' r='13' fill='url(%23grad)' /><circle cx='60' cy='66' r='13' fill='url(%23grad)' /><circle cx='80' cy='64' r='12.5' fill='url(%23grad)' /><circle cx='28' cy='45' r='13' fill='url(%23grad)' /><circle cx='50' cy='48' r='13.5' fill='url(%23grad)' /><circle cx='72' cy='45' r='13' fill='url(%23grad)' /><circle cx='38' cy='28' r='12.5' fill='url(%23grad)' /><circle cx='62' cy='28' r='12.5' fill='url(%23grad)' /></g></svg>`;

// Custom SVG for Ingot (Yuan Bao)
const INGOT_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 110'><defs><linearGradient id='bodyGold' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='%23FFC107'/><stop offset='0.2' stop-color='%23FFD54F'/><stop offset='0.5' stop-color='%23FFECB3'/><stop offset='0.8' stop-color='%23FFD54F'/><stop offset='1' stop-color='%23FFC107'/></linearGradient><radialGradient id='domeGold' cx='0.3' cy='0.3' r='0.7'><stop offset='0' stop-color='%23FFF9C4'/><stop offset='1' stop-color='%23FF8F00'/></radialGradient><filter id='glow'><feDropShadow dx='0' dy='0' stdDeviation='1.5' flood-color='white' flood-opacity='0.7'/></filter></defs><!-- Back Rim (Inside) --><path d='M 10,40 Q 64,25 118,40 L 118,45 L 10,45 Z' fill='%23F57F17'/><!-- Central Dome --><ellipse cx='64' cy='45' rx='34' ry='26' fill='url(%23domeGold)' stroke='%23F57F17' stroke-width='0.5'/><!-- Dome Highlight --><ellipse cx='50' cy='35' rx='12' ry='8' fill='white' opacity='0.5' transform='rotate(-20 50 35)'/><!-- Front Body (Hull) --><path d='M 10,40 Q 10,80 64,100 Q 118,80 118,40 Q 64,70 10,40 Z' fill='url(%23bodyGold)' stroke='%23FF6F00' stroke-width='1.5'/><!-- Side/Rim Highlight --><path d='M 12,42 Q 64,70 116,42' fill='none' stroke='%23FFF' stroke-width='2' opacity='0.6' stroke-linecap='round'/><!-- Body Shine --><path d='M 20,55 Q 35,80 50,85' fill='none' stroke='white' stroke-width='3' opacity='0.2' stroke-linecap='round'/><!-- Sparkles --><g fill='white' filter='url(%23glow)'><path d='M 30,40 C 30,40 33,30 33,30 C 33,30 36,40 36,40 C 36,40 46,43 46,43 C 46,43 36,46 36,46 C 36,46 33,56 33,56 C 33,56 30,46 30,46 C 30,46 20,43 20,43 C 20,43 30,40 30,40' transform='scale(0.5) translate(30, -10)'/><path d='M 90,50 C 90,50 93,40 93,40 C 93,40 96,50 96,50 C 96,50 106,53 106,53 C 106,53 96,56 96,56 C 96,56 93,66 93,66 C 93,66 90,56 90,56 C 90,56 80,53 80,53 C 80,53 90,50 90,50' transform='scale(0.6) translate(140, 20)'/><path d='M 100,70 C 100,70 102,64 102,64 C 102,64 104,70 104,70 C 104,70 110,72 110,72 C 110,72 104,74 104,74 C 104,74 102,80 102,80 C 102,80 100,74 100,74 C 100,74 94,72 94,72 C 94,72 100,70 100,70' transform='scale(0.5) translate(180, 80)'/></g></svg>`;

// Horse is now using a PNG image for better quality
// PNG file: /public/assets/horse.png (900x1200px)
// You can replace this PNG with your own image file!

// Cai Shen is now using a high-resolution PNG for better clarity on mobile
// PNG file: /public/assets/cai-shen.png (1200x1440px)

export const FRUIT_DEFS: Record<FruitType, FruitDef> = {
  // Fruits
  [FruitType.PINEAPPLE]: { id: FruitType.PINEAPPLE, name: '旺来 (Pineapple)', emoji: '🍍', meaning: '好运旺旺来 (Wealth Comes)', scale: 1.2, category: 'fruit' },
  [FruitType.POMELO]: { id: FruitType.POMELO, name: '柚子 (Pomelo)', emoji: '🍐', meaning: '保佑平安 (Blessing)', scale: 1.1, category: 'fruit' },
  [FruitType.APPLE]: { id: FruitType.APPLE, name: '苹果 (Apple)', emoji: '🍎', meaning: '平平安安 (Peace)', scale: 1.0, category: 'fruit' },
  [FruitType.ORANGE]: { id: FruitType.ORANGE, name: '橘子 (Orange)', emoji: '🍊', meaning: '大吉大利 (Good Luck)', scale: 0.9, category: 'fruit' },
  [FruitType.PERSIMMON]: { 
    id: FruitType.PERSIMMON, 
    name: '柿子 (Persimmon)', 
    emoji: '🍅', 
    imageUrl: '/assets/persimon.png',
    meaning: '事事如意 (Everything goes well)', 
    scale: 0.9, 
    category: 'fruit' 
  }, 
  [FruitType.PEACH]: { id: FruitType.PEACH, name: '寿桃 (Peach)', emoji: '🍑', meaning: '健康长寿 (Longevity)', scale: 0.95, category: 'fruit' },
  [FruitType.DRAGONFRUIT]: { 
    id: FruitType.DRAGONFRUIT, 
    name: '马 (Horse)', 
    emoji: '🐴', 
    imageUrl: '/assets/horse.png',
    meaning: '马到成功 (Success)', 
    scale: 1.0, 
    category: 'fruit' 
  },
  [FruitType.GRAPES]: { id: FruitType.GRAPES, name: '葡萄 (Grapes)', emoji: '🍇', meaning: '多子多福 (Abundance)', scale: 0.9, category: 'fruit' },
  [FruitType.SHINE_MUSCAT]: { 
    id: FruitType.SHINE_MUSCAT, 
    name: '晴王 (Shine Muscat)', 
    emoji: '🍇', 
    imageUrl: SHINE_MUSCAT_SVG,
    meaning: '硕果累累 (Fruitful)', 
    scale: 1.1, 
    category: 'fruit' 
  },
  [FruitType.SUGAR_CANE]: { id: FruitType.SUGAR_CANE, name: '甘蔗 (Sugar Cane)', emoji: '🎋', meaning: '节节高升 (Promotion)', scale: 1.1, category: 'fruit' },
  [FruitType.PEANUT]: { id: FruitType.PEANUT, name: '花生 (Peanut)', emoji: '🥜', meaning: '好事发生 (Good things happen)', scale: 0.8, category: 'fruit' },
  
  // Special
  [FruitType.INGOT]: { 
    id: FruitType.INGOT, 
    name: '金元宝 (Ingot)', 
    emoji: '🪙', 
    imageUrl: INGOT_SVG,
    meaning: '招财进宝 (Wealth)', 
    scale: 1.0, 
    category: 'special' 
  },
  [FruitType.CAI_SHEN]: {
    id: FruitType.CAI_SHEN,
    name: '财神爷 (Cai Shen)',
    emoji: '🧧',
    imageUrl: '/assets/cai-shen.png',
    meaning: '财神到 (God of Wealth)',
    scale: 1.4,
    category: 'special'
  },
  
  // Stickers
  [FruitType.STICKER_FU]: { id: FruitType.STICKER_FU, name: '福字 (Fu)', emoji: '福', meaning: '福气满满 (Fortune)', scale: 1.0, category: 'sticker' },
  [FruitType.STICKER_ENVELOPE]: { id: FruitType.STICKER_ENVELOPE, name: '红包 (Envelope)', emoji: '🧧', meaning: '恭喜发财 (Red Packet)', scale: 0.9, category: 'sticker' },
  [FruitType.STICKER_LANTERN]: { 
    id: FruitType.STICKER_LANTERN, 
    name: '灯笼 (Lantern)', 
    emoji: '🏮', 
    imageUrl: '/assets/lantern.png',
    meaning: '红红火火 (Festive)', 
    scale: 1.1, 
    category: 'sticker' 
  },
  [FruitType.STICKER_FIRECRACKER]: { 
    id: FruitType.STICKER_FIRECRACKER, 
    name: '鞭炮 (Firecracker)', 
    emoji: '🧨', 
    imageUrl: '/assets/firecracker.png',
    meaning: '岁岁平安 (Peace)', 
    scale: 1.0, 
    category: 'sticker' 
  },
};

// Fix specific emojis if needed
FRUIT_DEFS[FruitType.PERSIMMON].emoji = '🍅'; 

export const INITIAL_BLESSING = "点击下方按钮，祈求财神赐福...";