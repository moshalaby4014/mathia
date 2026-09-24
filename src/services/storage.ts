import { PlayerProfile, SkillMasteryRecord } from '../types/game';

const PROFILE_KEY = 'mathia_player_profile_v1';
const MASTERY_KEY = 'mathia_skill_mastery_v1';
const PLAY_TIME_KEY = 'mathia_play_timer_v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  id: 'hero_1',
  name: 'بطل الرياضيات',
  avatar: {
    gender: 'boy',
    skinTone: '#f1c27d',
    hairStyle: 'curly',
    hairColor: '#4a2810',
    outfitColor: 'amber',
    accessory: 'none',
  },
  level: 1,
  xp: 40,
  xpToNextLevel: 100,
  coins: 80,
  stars: 3,
  crystals: {
    forest: false,
    addition: false,
    subtraction: false,
    time: false,
    measurement: false,
    numbers: false,
    capacity: false,
    mixed: false,
    castle: false,
  },
  unlockedWorlds: ['forest'],
  activePetId: 'fennec',
  unlockedPets: ['fennec'],
  homeItems: ['cozy_bed', 'plant_pot'],
  createdAt: new Date().toISOString(),
  lastPlayedAt: new Date().toISOString(),
  totalPlayMinutes: 12,
};

export const storage = {
  loadProfile(): PlayerProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (!data) return DEFAULT_PROFILE;
      const parsed = JSON.parse(data);
      // Merge with defaults in case of new schema keys
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        crystals: {
          ...DEFAULT_PROFILE.crystals,
          ...(parsed.crystals || {}),
        },
      };
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: PlayerProfile): void {
    try {
      profile.lastPlayedAt = new Date().toISOString();
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // LocalStorage error fallback
    }
  },

  loadMastery(): Record<string, SkillMasteryRecord> {
    try {
      const data = localStorage.getItem(MASTERY_KEY);
      if (!data) return {};
      return JSON.parse(data);
    } catch {
      return {};
    }
  },

  saveMastery(mastery: Record<string, SkillMasteryRecord>): void {
    try {
      localStorage.setItem(MASTERY_KEY, JSON.stringify(mastery));
    } catch {
      // ignore
    }
  },

  updateSkillOutcome(
    skillId: string,
    isSuccess: boolean,
    hintsUsed: number,
    misconceptionTag?: string
  ): SkillMasteryRecord {
    const all = this.loadMastery();
    const current = all[skillId] || {
      skillId,
      attempts: 0,
      successes: 0,
      hintsUsed: 0,
      masteryLevel: 'learning',
      lastPracticed: new Date().toISOString(),
      misconceptions: [],
    };

    current.attempts += 1;
    if (isSuccess) current.successes += 1;
    current.hintsUsed += hintsUsed;
    current.lastPracticed = new Date().toISOString();

    if (misconceptionTag && !current.misconceptions.includes(misconceptionTag)) {
      current.misconceptions.push(misconceptionTag);
    }

    const accuracy = current.attempts > 0 ? (current.successes / current.attempts) * 100 : 0;

    if (current.attempts >= 4 && accuracy >= 80 && current.hintsUsed <= 2) {
      current.masteryLevel = 'mastered';
    } else if (current.attempts >= 2 && accuracy >= 60) {
      current.masteryLevel = 'good';
    } else if (current.attempts >= 2 && accuracy < 50) {
      current.masteryLevel = 'needs_practice';
    } else {
      current.masteryLevel = 'learning';
    }

    all[skillId] = current;
    this.saveMastery(all);
    return current;
  },

  incrementPlayTime(minutes: number): void {
    try {
      const profile = this.loadProfile();
      profile.totalPlayMinutes = (profile.totalPlayMinutes || 0) + minutes;
      this.saveProfile(profile);
    } catch {
      // ignore
    }
  },

  resetAll(): void {
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(MASTERY_KEY);
      localStorage.removeItem(PLAY_TIME_KEY);
    } catch {
      // ignore
    }
  }
};
