import React, { useState } from 'react';
import { CURRICULUM_LESSONS } from '../../services/curriculumLessons';
import { Lesson, LessonCategory } from '../../types/teaching';
import { PlayerProfile } from '../../types/game';
import { storage } from '../../services/storage';
import { sound } from '../../services/audio';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Star,
  Award,
  ChevronLeft,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  onSelectLesson: (lesson: Lesson) => void;
  onReturnToMap: () => void;
}

export const LessonSelectHub: React.FC<Props> = ({
  profile,
  onSelectLesson,
  onReturnToMap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory | 'all'>('all');
  const masteryData = storage.loadMastery();

  const CATEGORIES: { id: LessonCategory | 'all'; titleAr: string; icon: string }[] = [
    { id: 'all', titleAr: 'جميع الدروس', icon: '🌟' },
    { id: 'addition_strategies', titleAr: 'استراتيجيات الجمع', icon: '➕' },
    { id: 'subtraction_strategies', titleAr: 'استراتيجيات الطرح', icon: '➖' },
    { id: 'place_value_regrouping', titleAr: 'القيمة المكانية وإعادة التجميع', icon: '🧱' },
    { id: 'story_problems', titleAr: 'المسائل الكلامية', icon: '📖' },
    { id: 'number_patterns', titleAr: 'لوحة الـ 120 والأنماط', icon: '🔢' },
    { id: 'time_and_measurement', titleAr: 'الوقت والقياس', icon: '⏰' },
  ];

  const filteredLessons = selectedCategory === 'all'
    ? CURRICULUM_LESSONS
    : CURRICULUM_LESSONS.filter((l) => l.category === selectedCategory);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center p-3 sm:p-6 select-none text-right pb-24 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between gap-3 mb-4">
        <button
          onClick={onReturnToMap}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 shadow-sm transition"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لخريطة المغامرة</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl text-xs font-black text-amber-950">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{profile.stars} نجمة</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-3 border-white/40 mb-6 text-right relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>منهج الصف الثاني الابتدائي التفاعلي الحديث 🇪🇬</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            مختبر المفاهيم والاستراتيجيات الحسابية
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 font-bold leading-relaxed">
            تعلم الرياضيات بالتجربة البصرية والحركة الحية! شاهد المفهوم، المسه، تنبأ بما سيحدث، واكتشف سر "ليه؟" مع ميرو!
          </p>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playSfx('click');
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.titleAr}</span>
            </button>
          );
        })}
      </div>

      {/* Lesson Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLessons.map((lesson) => {
          const mastery = masteryData[lesson.id];
          const isMastered = mastery?.masteryLevel === 'mastered' || mastery?.masteryLevel === 'good';

          return (
            <div
              key={lesson.id}
              onClick={() => {
                sound.playSfx('click');
                onSelectLesson(lesson);
              }}
              className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lesson.colorTheme} text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform`}>
                    {lesson.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 group-hover:text-amber-700 transition-colors">
                      {lesson.titleAr}
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      {lesson.subtitleAr}
                    </p>
                  </div>
                </div>

                {isMastered ? (
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl text-xs font-black border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>متقن</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl text-xs font-black border border-amber-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>جاهز للبدء</span>
                  </div>
                )}
              </div>

              {/* Story Context / Concept */}
              <div className="bg-slate-50 rounded-2xl p-3 mb-3 border border-slate-100 text-xs font-bold text-slate-700">
                <p className="line-clamp-2">
                  {lesson.conceptAr}
                </p>
              </div>

              {/* Card Footer: Why Badge & Start Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg">
                  💡 يتضمن ميزة "ليه؟" و "وريني إزاي"
                </span>

                <button className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow transition group-hover:translate-x-[-4px]">
                  <span>ادخل المختبر</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
