import React, { useState } from 'react';
import { PlayerProfile, WorldRegion } from '../types/game';
import { WORLDS } from '../services/curriculum';
import { sound } from '../services/audio';
import { ParentGuideModal } from './teaching/ParentGuideModal';
import { getParentGuideForWorld } from '../services/parentGuideService';
import {
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  BookOpen,
  Star,
  Trophy,
  HeartHandshake,
  Compass,
} from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  onSelectWorld: (world: WorldRegion) => void;
  onOpenTeachingLab?: () => void;
  onOpenSelakh?: () => void;
  onReturnToMap?: () => void;
}

export const TextbookCurriculumIndex: React.FC<Props> = ({
  profile,
  onSelectWorld,
  onOpenTeachingLab,
  onOpenSelakh,
  onReturnToMap,
}) => {
  const [selectedParentGuideWorld, setSelectedParentGuideWorld] = useState<WorldRegion | null>(null);

  const isWorldCompleted = (worldId: string) => {
    return Boolean(profile.crystals[worldId as keyof typeof profile.crystals]);
  };

  const completedCount = WORLDS.filter((w) => isWorldCompleted(w.id)).length;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center p-3 sm:p-6 select-none text-right pb-24 animate-fade-in">
      {/* Parent Guide Modal */}
      {selectedParentGuideWorld && (
        <ParentGuideModal
          titleAr={selectedParentGuideWorld.nameAr}
          guide={getParentGuideForWorld(selectedParentGuideWorld.id)}
          onClose={() => setSelectedParentGuideWorld(null)}
        />
      )}

      {/* Top Navigation Bar */}
      {onReturnToMap && (
        <div className="w-full flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => {
              sound.playSfx('click');
              onReturnToMap();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 shadow-sm transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للخريطة الجغرافية</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-xl">
              تم إنجاز {completedCount} من ٩ فصول 🏆
            </span>
          </div>
        </div>
      )}

      {/* Main Roadmap Header (Matching Textbook Page) */}
      <div className="w-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 mb-6 text-center relative overflow-hidden">
        {/* Decorative Floating Clouds and Icons */}
        <div className="absolute top-2 left-4 text-4xl opacity-30 animate-float pointer-events-none">☁️</div>
        <div className="absolute bottom-2 right-4 text-4xl opacity-30 animate-float pointer-events-none">🌟</div>
        <div className="absolute -top-6 -right-6 text-8xl opacity-15 pointer-events-none">🧭</div>

        <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-4 py-1 rounded-full text-xs sm:text-sm font-black shadow-md">
            <Compass className="w-4 h-4" />
            <span>٩ فصول من التعلم والمغامرة والتحدي</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
            رحلة في فصول الكتاب 🎒
          </h1>

          <p className="text-sm sm:text-base text-sky-100 font-bold leading-relaxed max-w-lg">
            انطلق معنا في مغامرة ممتعة، نتعلّم فيها أشياء رائعة ونصبح أبطال الرياضيات!
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-md bg-black/20 rounded-full h-3.5 p-0.5 border border-white/30 mt-2">
            <div
              className="bg-gradient-to-r from-amber-300 to-yellow-400 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${(completedCount / 9) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Selakh Al-Telmeez Callout Banner */}
      {onOpenSelakh && (
        <div
          onClick={() => {
            sound.playSfx('sparkle');
            onOpenSelakh();
          }}
          className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white rounded-3xl p-4 sm:p-5 shadow-xl border-3 border-yellow-300 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer hover:shadow-2xl hover:scale-101 active:scale-98 transition-all group"
        >
          <div className="flex items-center gap-3.5 text-right">
            <div className="w-14 h-14 bg-yellow-400 text-emerald-950 rounded-2xl flex flex-col items-center justify-center font-black shadow-md shrink-0 group-hover:rotate-6 transition-transform">
              <span className="text-2xl">📚</span>
              <span className="text-[9px] font-black leading-none">سلاح التلميذ</span>
            </div>
            <div>
              <div className="inline-block bg-yellow-300 text-emerald-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full mb-1">
                جديد! المحتوى التفاعلي لسلاح التلميذ 🇪🇬
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                افتح كتاب سلاح التلميذ التفاعلي في الرياضيات ✏️
              </h3>
              <p className="text-xs text-emerald-100 font-bold">
                شرح تفاعلي للأفكار، أنشطة وتدريبات لكل درس، واختبارات «قيِّم نفسك»، وتحديات الأذكياء!
              </p>
            </div>
          </div>

          <button className="game-btn-primary px-5 py-2.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow whitespace-nowrap">
            <span>تصفح وحل تمارين سلاح التلميذ</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 9 Chapters Grid (Ordered exactly 1 to 9 as in the book) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {WORLDS.map((world, idx) => {
          const completed = isWorldCompleted(world.id);
          const chapterNum = world.chapterNumber || idx + 1;

          // Distinct chapter color palettes matching textbook icons
          const chapterColors: Record<number, { badge: string; border: string; bg: string; iconBg: string }> = {
            1: { badge: 'bg-rose-500 text-white', border: 'border-rose-300', bg: 'hover:border-rose-400', iconBg: 'bg-rose-100 text-rose-700' },
            2: { badge: 'bg-blue-500 text-white', border: 'border-blue-300', bg: 'hover:border-blue-400', iconBg: 'bg-blue-100 text-blue-700' },
            3: { badge: 'bg-emerald-500 text-white', border: 'border-emerald-300', bg: 'hover:border-emerald-400', iconBg: 'bg-emerald-100 text-emerald-700' },
            4: { badge: 'bg-sky-500 text-white', border: 'border-sky-300', bg: 'hover:border-sky-400', iconBg: 'bg-sky-100 text-sky-700' },
            5: { badge: 'bg-amber-500 text-white', border: 'border-amber-300', bg: 'hover:border-amber-400', iconBg: 'bg-amber-100 text-amber-700' },
            6: { badge: 'bg-purple-500 text-white', border: 'border-purple-300', bg: 'hover:border-purple-400', iconBg: 'bg-purple-100 text-purple-700' },
            7: { badge: 'bg-teal-500 text-white', border: 'border-teal-300', bg: 'hover:border-teal-400', iconBg: 'bg-teal-100 text-teal-700' },
            8: { badge: 'bg-indigo-500 text-white', border: 'border-indigo-300', bg: 'hover:border-indigo-400', iconBg: 'bg-indigo-100 text-indigo-700' },
            9: { badge: 'bg-orange-500 text-white', border: 'border-orange-300', bg: 'hover:border-orange-400', iconBg: 'bg-orange-100 text-orange-700' },
          };

          const style = chapterColors[chapterNum] || chapterColors[1];

          return (
            <div
              key={world.id}
              onClick={() => {
                sound.playSfx('click');
                onSelectWorld(world);
              }}
              className={`relative bg-white rounded-3xl p-5 border-3 ${style.border} ${style.bg} shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between transform hover:-translate-y-1`}
            >
              {/* Chapter Badge Number Top Right */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full ${style.badge} font-black text-sm flex items-center justify-center shadow-md`}>
                    {chapterNum}
                  </span>
                  <span className="text-xs font-black text-slate-800">
                    الفصل {['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع'][chapterNum - 1]}
                  </span>
                </div>

                {completed ? (
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-black border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>مكتمل 💎</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-black border border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>محطة جديدة</span>
                  </div>
                )}
              </div>

              {/* Icon & Chapter Name */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform`}>
                    {world.icon}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                      {world.titleAr}
                    </h3>
                  </div>
                </div>

                {/* Subtitle / Objective from the book */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-xs font-bold text-slate-700 leading-relaxed min-h-[58px]">
                  {world.chapterSubtitleAr || world.descriptionAr}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                {/* Parent Guide Coaching Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playSfx('sparkle');
                    setSelectedParentGuideWorld(world);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black transition active:scale-95"
                  title="دليل ولي الأمر لشرح هذا الفصل لطفلك"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                  <span>شرح لولي الأمر 💡</span>
                </button>

                {/* Enter Quest */}
                <div className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow transition group-hover:translate-x-[-3px]">
                  <span>ابدأ الفصل</span>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Banner (From the bottom of textbook page) */}
      <div className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-3xl p-4 sm:p-5 text-amber-950 font-black text-center shadow-lg border-2 border-amber-300 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-900" />
        <span className="text-sm sm:text-base">
          كل فصل محطة جديدة نحو التميز! هيّا بنا نبدأ رحلتنا ونجمع كنوز المعرفة معًا! ⭐
        </span>
      </div>
    </div>
  );
};
