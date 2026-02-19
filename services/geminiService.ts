import { PlacedItem } from "../types";

// List of 4-word greetings - you can customize this list
const GREETINGS = [
  "马上有钱，余额暴涨",
  "财神加班，帮我暴富",
  "余额起飞，富到报警",
  "钱别跑路，钞票自来",
  "爆富上线，财神偏爱",
  "马上吸金，钞能力满",
  "给我暴富，发到手软",
  "钱山钱海，富贵失控",
  "马上翻本，暴冲模式",
  "财神盯我，财运外挂",
  "钱浪来袭，马上躺赢",
  "余额起飞，爆富警告",
  "马上印钱，发财冲鸭",
  "富到发慌，余额暴涨",
  "马上躺赢，无需努力",
  "余额暴涨，钱来速来"
];

// Generate a random 4-digit lucky number (1000-9999)
const generateLuckyNumber = (): number => {
  return Math.floor(Math.random() * 9000) + 1000;
};

// Randomly pick a greeting from the list
const getRandomGreeting = (): string => {
  const randomIndex = Math.floor(Math.random() * GREETINGS.length);
  return GREETINGS[randomIndex];
};

export const generateBlessing = async (items: PlacedItem[]): Promise<{ blessing: string; luckyNumbers: number[] }> => {
  // No API call needed - just return random greeting and lucky number
  const greeting = getRandomGreeting();
  const luckyNumber = generateLuckyNumber();
  
  return {
    blessing: greeting,
    luckyNumbers: [luckyNumber] // Return as array with single 4-digit number
  };
};
