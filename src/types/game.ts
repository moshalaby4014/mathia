export type Gender = 'boy' | 'girl';

export type SkinTone = '#ffd8b3' | '#f1c27d' | '#e0ac69' | '#c68642' | '#8d5524';
export type HairStyle = 'curly' | 'short' | 'long' | 'braids' | 'cap';
export type OutfitColor = 'amber' | 'emerald' | 'sky' | 'rose' | 'purple';

export interface PlayerAvatar {
  gender: Gender;
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: string;
  outfitColor: OutfitColor;
  accessory: 'none' | 'pharaoh_band' | 'explorer_hat' | 'flower' | 'crown';
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: PlayerAvatar;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  stars: number;
  crystals: {
    forest: boolean;      // غابة البيانات
    addition: boolean;    // وادي الجمع
    subtraction: boolean; // كهف الطرح
    time: boolean;        // مدينة الزمن
    measurement: boolean; // قرية القياس
    numbers: boolean;     // صحراء الأعداد
    capacity: boolean;    // مختبر السعة
    mixed: boolean;       // مدينة الجمع والطرح
    castle: boolean;      // قلعة الحساب
  };
  unlockedWorlds: string[];
  activePetId: string;
  unlockedPets: string[];
  homeItems: string[];
  createdAt: string;
  lastPlayedAt: string;
  totalPlayMinutes: number;
}

export type MasteryLevel = 'needs_practice' | 'learning' | 'good' | 'mastered';

export interface SkillMasteryRecord {
  skillId: string;
  attempts: number;
  successes: number;
  hintsUsed: number;
  masteryLevel: MasteryLevel;
  lastPracticed: string;
  misconceptions: string[];
}

export interface Misconception {
  tag: string;
  labelAr: string;
  remedyAr: string;
  sampleTrigger: string;
}

export interface Skill {
  id: string;
  worldId: string;
  titleAr: string;
  grade2Competency: string;
  conceptAr: string;
  difficulty: 1 | 2 | 3;
  hints: string[];
  commonMistakes: Misconception[];
}

export interface WorldRegion {
  id: string;
  nameAr: string;
  titleAr: string;
  descriptionAr: string;
  themeColor: string;
  requiredStars: number;
  crystalNameAr: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  bossNameAr: string;
  icon: string;
  x: number; // map coordinates percentage
  y: number;
}

export interface HomeItem {
  id: string;
  nameAr: string;
  category: 'furniture' | 'decoration' | 'trophy' | 'plant';
  cost: number;
  icon: string;
  unlockedByDefault?: boolean;
}

export interface Pet {
  id: string;
  nameAr: string;
  animalAr: string;
  descriptionAr: string;
  cost: number;
  icon: string;
  animation: string;
  unlockedByDefault?: boolean;
}

export type ActiveScreen = 'intro' | 'map' | 'quest' | 'home' | 'pets' | 'parent' | 'teaching';
