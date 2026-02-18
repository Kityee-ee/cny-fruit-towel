export enum FruitType {
  APPLE = 'APPLE',
  ORANGE = 'ORANGE',
  PINEAPPLE = 'PINEAPPLE',
  GRAPES = 'GRAPES',
  SHINE_MUSCAT = 'SHINE_MUSCAT',
  PEACH = 'PEACH',
  PERSIMMON = 'PERSIMMON',
  POMELO = 'POMELO',
  DRAGONFRUIT = 'DRAGONFRUIT',
  SUGAR_CANE = 'SUGAR_CANE',
  PEANUT = 'PEANUT',
  INGOT = 'INGOT', 
  // Stickers / Decor
  STICKER_FU = 'STICKER_FU',
  STICKER_ENVELOPE = 'STICKER_ENVELOPE',
  STICKER_LANTERN = 'STICKER_LANTERN',
  STICKER_FIRECRACKER = 'STICKER_FIRECRACKER'
}

export interface FruitDef {
  id: FruitType;
  name: string;
  emoji: string;
  imageUrl?: string; // Optional image URL to override emoji
  meaning: string;
  scale: number;
  category: 'fruit' | 'sticker' | 'special';
}

export interface PlacedItem {
  uuid: string;
  type: FruitType;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
}

export interface GeminiBlessingResponse {
  blessing: string;
  luckyNumbers: string;
}
