import React from 'react';
import { WorldRegion, PlayerProfile } from '../types/game';
import { WORLDS } from '../services/curriculum';
import { Lock, Star, Sparkles, CheckCircle2, ChevronLeft, Trophy } from 'lucide-react';
import { sound } from '../services/audio';

interface Props {
  profile: PlayerProfile;
  onSelectWorld: (world: WorldRegion) => void;
}

export const WorldMap: React.FC<Props> = ({ profile, onSelectWorld }) => {
  const isWorldCompleted = (worldId: string) => {
    if (worldId === 'forest') return profile.crystals.forest;
    if (worldId === 'addition') return profile.crystals.addition;
    if (worldId === 'subtraction') return profile.crystals.subtraction;
    if (worldId === 'time') return profile.crystals.time;
    if (worldId === 'measurement') return profile.crystals.measurement;
    if (worldId === 'numbers') return profile.crystals.numbers;
    if (worldId === 'capacity') return profile.crystals.capacity;
    if (worldId === 'mixed') return profile.crystals.mixed;
    if (worldId === 'castle') return profile.crystals.castle;
    return false;
  };

  const isWorldUnlocked = (world: WorldRegion) => {
    // Forest is always unlocked. Others unlock with star count or previous completion
    if (world.id === 'forest') return true;
    return profile.stars >= world.requiredStars || profile.unlockedWorlds.includes(world.id);
  };

  const handleWorldClick = (world: WorldRegion) => {
    const unlocked = isWorldUnlocked(world);
    if (!unlocked) {
      sound.playSfx('error');
      return;
    }
    sound.playSfx('click');
    onSelectWorld(world);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-130px)] pb-24 p-3 sm:p-6 flex flex-col items-center select-none overflow-x-hidden">
      {/* World Map Header Banner */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-amber-200 text-white mb-6 relative overflow-hidden">
        {/* Subtle Egyptian decorative pattern */}
        <div className="absolute -left-10 -bottom-10 text-8xl opacity-20 pointer-events-none">
          🏺
        </div>
        <div className="absolute -right-6 -top-6 text-8xl opacity-20 pointer-events-none">
          🌴
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs sm:text-sm font-black mb-2">
              <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
              <span>خريطة مملكة الأرقام السحرية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-950">
              اختر العالم الذي تريد إنقاذه!
            </h1>
            <p className="text-sm sm:text-base font-bold text-amber-900 mt-1 max-w-lg">
              حل التحديات الرياضية، اجمع النجوم، واستعد البلورات التسع لإضاءة المملكة بالكامل!
            </p>
          </div>

          {/* Forest Crystal Status Badge */}
          <div className="bg-amber-900/30 backdrop-blur-md rounded-2xl p-3 border border-white/30 flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner ${
              profile.crystals.forest
                ? 'bg-emerald-400 text-emerald-950 animate-pulse-glow'
                : 'bg-slate-700/60 text-slate-400'
            }`}>
              💎
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-amber-200">بلورة الغابة الخضراء</div>
              <div className="text-sm font-black text-white">
                {profile.crystals.forest ? 'مستعادة ومضيئة! ✨' : 'في انتظار البطل...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Illustrated Kingdom Landscape Canvas Container */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-sky-200 via-amber-100 to-emerald-200 rounded-3xl border-4 border-amber-300 shadow-2xl p-4 sm:p-8 min-h-[580px] overflow-hidden">
        {/* Winding River Nile SVG Background */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
          preserveAspectRatio="none"
          viewBox="0 0 1000 700"
        >
          {/* Subtle River Nile flow */}
          <path
            d="M 500 700 C 420 550, 650 480, 520 340 C 400 220, 600 120, 480 0"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="70"
            strokeLinecap="round"
          />
          <path
            d="M 500 700 C 420 550, 650 480, 520 340 C 400 220, 600 120, 480 0"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="45"
            strokeLinecap="round"
          />
          {/* Nile Papyrus & Palms along the river */}
          <text x="560" y="620" fontSize="30">🌴</text>
          <text x="390" y="530" fontSize="30">⛵</text>
          <text x="580" y="420" fontSize="30">🌴</text>
          <text x="360" y="320" fontSize="30">🪷</text>
          <text x="560" y="220" fontSize="30">⛵</text>
          <text x="410" y="100" fontSize="30">🌴</text>
        </svg>

        {/* Dynamic World Region Nodes Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {WORLDS.map((world, idx) => {
            const unlocked = isWorldUnlocked(world);
            const completed = isWorldCompleted(world.id);
            const isForest = world.id === 'forest';

            return (
              <div
                key={world.id}
                onClick={() => handleWorldClick(world)}
                className={`relative rounded-3xl p-5 border-3 transition-all duration-300 text-right cursor-pointer group flex flex-col justify-between min-h-[170px] ${
                  unlocked
                    ? 'bg-white/95 hover:bg-white border-amber-300 hover:border-amber-400 hover:-translate-y-1.5 shadow-lg hover:shadow-xl'
                    : 'bg-slate-100/90 border-slate-300 opacity-75 cursor-not-allowed'
                } ${isForest && !completed ? 'ring-4 ring-emerald-400 animate-pulse-glow' : ''}`}
              >
                {/* Status Ribbons */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-3xl filter drop-shadow">{world.icon}</span>
                    {completed && (
                      <span className="bg-emerald-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مكتمل</span>
                      </span>
                    )}
                    {isForest && !completed && (
                      <span className="bg-amber-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full animate-bounce shadow">
                        ابدأ هنا! ⭐
                      </span>
                    )}
                  </div>

                  {/* Lock / Star Requirement */}
                  {!unlocked ? (
                    <div className="flex items-center gap-1 bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full text-xs font-black">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{world.requiredStars} ⭐</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-xs font-black text-amber-900">
                        {completed ? '3/3' : '0/3'}
                      </span>
                    </div>
                  )}
                </div>

                {/* World Title & Description */}
                <div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-amber-700 transition-colors">
                    {world.nameAr}
                  </h3>
                  <p className="text-xs font-bold text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {world.descriptionAr}
                  </p>
                </div>

                {/* Card Bottom CTA bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-500">
                    {unlocked ? world.bossNameAr : `تحتاج ${world.requiredStars} نجوم لفتح العالم`}
                  </span>

                  {unlocked && (
                    <div className="flex items-center gap-1 text-amber-700 text-xs font-black group-hover:-translate-x-1 transition-transform">
                      <span>دخول</span>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
