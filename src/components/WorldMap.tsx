import React, { useState } from 'react';
import { WorldRegion, PlayerProfile } from '../types/game';
import { WORLDS } from '../services/curriculum';
import { Lock, Star, Sparkles, CheckCircle2, ChevronLeft, Trophy, HeartHandshake } from 'lucide-react';
import { sound } from '../services/audio';
import { ParentGuideModal } from './teaching/ParentGuideModal';
import { getParentGuideForWorld } from '../services/parentGuideService';
import { TextbookCurriculumIndex } from './TextbookCurriculumIndex';
import { SelakhAlTelmeezHub } from './selakh/SelakhAlTelmeezHub';

interface Props {
  profile: PlayerProfile;
  onSelectWorld: (world: WorldRegion) => void;
  onOpenTeachingLab?: () => void;
  onUpdateProfile?: (updated: PlayerProfile) => void;
}

export const WorldMap: React.FC<Props> = ({
  profile,
  onSelectWorld,
  onOpenTeachingLab,
  onUpdateProfile,
}) => {
  const [viewMode, setViewMode] = useState<'curriculum' | 'map' | 'selakh'>('curriculum');
  const [previewWorldGuide, setPreviewWorldGuide] = useState<WorldRegion | null>(null);
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
    // Forest and Time are unlocked by default
    if (world.id === 'forest' || world.id === 'time') return true;
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
    <div className="relative w-full min-h-[calc(100vh-130px)] pb-24 p-2 sm:p-6 flex flex-col items-center select-none overflow-x-hidden">
      {/* Parent Guide Modal */}
      {previewWorldGuide && (
        <ParentGuideModal
          titleAr={previewWorldGuide.titleAr || previewWorldGuide.nameAr}
          guide={getParentGuideForWorld(previewWorldGuide.id)}
          onClose={() => setPreviewWorldGuide(null)}
        />
      )}

      {/* View Mode Switcher Tab (Textbook 9 Chapters vs Selakh Al-Telmeez vs Kingdom Map) */}
      <div className="w-full max-w-4xl flex items-center justify-center gap-1.5 sm:gap-2 mb-4 bg-amber-100/90 p-1.5 rounded-2xl border-2 border-amber-300 shadow-sm flex-wrap">
        <button
          onClick={() => {
            sound.playSfx('click');
            setViewMode('curriculum');
          }}
          className={`flex-1 py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            viewMode === 'curriculum'
              ? 'bg-amber-500 text-white shadow-md scale-102 ring-2 ring-amber-300'
              : 'text-amber-950 hover:bg-amber-200/60'
          }`}
        >
          <span>🎒 فصول الكتاب (٩ فصول)</span>
        </button>

        <button
          onClick={() => {
            sound.playSfx('click');
            setViewMode('selakh');
          }}
          className={`flex-1 py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            viewMode === 'selakh'
              ? 'bg-emerald-600 text-white shadow-md scale-102 ring-2 ring-yellow-400'
              : 'text-emerald-950 hover:bg-emerald-100 bg-white/70 border border-emerald-300'
          }`}
        >
          <span className="text-base">📚</span>
          <span>سلاح التلميذ التفاعلي</span>
          <span className="text-[10px] bg-yellow-400 text-emerald-950 px-1.5 py-0.2 rounded-full font-black">
            جديد
          </span>
        </button>

        <button
          onClick={() => {
            sound.playSfx('click');
            setViewMode('map');
          }}
          className={`flex-1 py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            viewMode === 'map'
              ? 'bg-amber-500 text-white shadow-md scale-102 ring-2 ring-amber-300'
              : 'text-amber-950 hover:bg-amber-200/60'
          }`}
        >
          <span>🗺️ خريطة المغامرة</span>
        </button>
      </div>

      {/* Render either Textbook Curriculum Index, Selakh Al-Telmeez Hub, or Kingdom Landscape Map */}
      {viewMode === 'selakh' ? (
        <SelakhAlTelmeezHub
          profile={profile}
          onUpdateProfile={onUpdateProfile || (() => {})}
          onReturnToMap={() => setViewMode('map')}
        />
      ) : viewMode === 'curriculum' ? (
        <TextbookCurriculumIndex
          profile={profile}
          onSelectWorld={onSelectWorld}
          onOpenTeachingLab={onOpenTeachingLab}
          onOpenSelakh={() => setViewMode('selakh')}
        />
      ) : (
        <>
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

      {/* Interactive Teaching Engine Lab Portal Banner */}
      {onOpenTeachingLab && (
        <div
          onClick={() => {
            sound.playSfx('sparkle');
            onOpenTeachingLab();
          }}
          className="w-full max-w-4xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-amber-300 text-white mb-6 cursor-pointer hover:scale-[1.01] transition-all flex flex-col sm:flex-row items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner group-hover:rotate-12 transition-transform shrink-0">
              🧪
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>المنهج التفاعلي الحديث — الصف الثاني</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black">
                مختبر الرياضيات التفاعلي (Interactive Math Lab)
              </h3>
              <p className="text-xs sm:text-sm text-purple-100 font-bold">
                استكشف الجمع والطرح بخط الأعداد، وإطار العشرة، وقيم الخانات، وسر "ليه؟" مع ميرو!
              </p>
            </div>
          </div>

          <div className="px-5 py-2.5 bg-white text-indigo-950 font-black text-xs sm:text-sm rounded-2xl shadow-md group-hover:bg-amber-300 transition-colors flex items-center gap-1 shrink-0">
            <span>دخول المختبر</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </div>
      )}

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
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-500">
                    {unlocked ? world.bossNameAr : `تحتاج ${world.requiredStars} نجوم لفتح العالم`}
                  </span>

                  {unlocked && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playSfx('sparkle');
                          setPreviewWorldGuide(world);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black transition active:scale-95"
                        title="عرض دليل ولي الأمر لتبسيط الفكرة قبل البدء"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                        <span>شرح لولي الأمر 💡</span>
                      </button>

                      <div className="flex items-center gap-1 text-amber-700 text-xs font-black group-hover:-translate-x-1 transition-transform bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-xl">
                        <span>دخول</span>
                        <ChevronLeft className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  )}
</div>
  );
};
