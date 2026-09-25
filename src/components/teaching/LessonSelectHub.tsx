import React, { useState } from 'react';
import { CURRICULUM_LESSONS } from '../../services/curriculumLessons';
import { Lesson } from '../../types/teaching';
import { PlayerProfile } from '../../types/game';
import { WORLDS } from '../../services/curriculum';
import { storage } from '../../services/storage';
import { sound } from '../../services/audio';
import { ParentGuideModal } from './ParentGuideModal';
import { getParentGuideForLesson } from '../../services/parentGuideService';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Star,
  Award,
  ChevronLeft,
  ArrowRight,
  Flame,
  HeartHandshake,
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
  const [selectedChapter, setSelectedChapter] = useState<string | 'all'>('all');
  const [previewParentGuideLesson, setPreviewParentGuideLesson] = useState<Lesson | null>(null);
  const masteryData = storage.loadMastery();

  const CHAPTER_TABS: { id: string; titleAr: string; icon: string }[] = [
    { id: 'all', titleAr: 'جميع فصول الكتاب (٩ فصول)', icon: '🎒' },
    { id: 'forest', titleAr: 'فصل ١: الرسوم البيانية', icon: '📊' },
    { id: 'addition', titleAr: 'فصل ٢: الجمع الرأسي', icon: '➕' },
    { id: 'subtraction', titleAr: 'فصل ٣: الطرح الرأسي', icon: '➖' },
    { id: 'time', titleAr: 'فصل ٤: الوقت والزمن', icon: '⏰' },
    { id: 'measurement', titleAr: 'فصل ٥: وحدات الطول', icon: '📏' },
    { id: 'numbers', titleAr: 'فصل ٦: أعداد أكبر من ١٠٠', icon: '🧱' },
    { id: 'capacity', titleAr: 'فصل ٧: وحدات السعة', icon: '🧪' },
    { id: 'mixed', titleAr: 'فصل ٨: الجمع والطرح الرأسي', icon: '📝' },
    { id: 'castle', titleAr: 'فصل ٩: طرق الحساب الذهني', icon: '🧮' },
  ];

  const filteredLessons = selectedChapter === 'all'
    ? CURRICULUM_LESSONS
    : CURRICULUM_LESSONS.filter((l) => l.worldId === selectedChapter);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center p-3 sm:p-6 select-none text-right pb-24 animate-in fade-in duration-300">
      {/* Parent Guide Preview Modal */}
      {previewParentGuideLesson && (
        <ParentGuideModal
          titleAr={previewParentGuideLesson.titleAr}
          guide={
            previewParentGuideLesson.parentGuide ||
            getParentGuideForLesson(previewParentGuideLesson.id)
          }
          onClose={() => setPreviewParentGuideLesson(null)}
        />
      )}

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
      <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-3 border-white/40 mb-4 text-right relative overflow-hidden">
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

      {/* Parent Guidance Global Callout */}
      <div className="w-full mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
            👨‍👧‍👦
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-emerald-950">
              دليل أولياء الأمور: تبسيط الفكرة قبل أن يبدأ طفلك
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-emerald-800/80">
              اضغط على زر "شرح لولي الأمر" عند أي درس لقراءة حوار تمهيدي سريع ونشاط بيتي في دقيقة واحدة!
            </p>
          </div>
        </div>
      </div>

      {/* Textbook Chapters Filter Tabs */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {CHAPTER_TABS.map((chap) => {
          const isActive = selectedChapter === chap.id;
          return (
            <button
              key={chap.id}
              onClick={() => {
                sound.playSfx('click');
                setSelectedChapter(chap.id);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <span>{chap.icon}</span>
              <span>{chap.titleAr}</span>
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
                    {(() => {
                      const world = WORLDS.find((w) => w.id === lesson.worldId);
                      return world ? (
                        <div className="inline-block text-[10px] font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md mb-1">
                          الفصل {world.chapterNumber}: {world.titleAr}
                        </div>
                      ) : null;
                    })()}
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

              {/* Card Footer: Parent Guide & Start Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2 flex-wrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playSfx('sparkle');
                    setPreviewParentGuideLesson(lesson);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black text-xs transition active:scale-95"
                  title="عرض نصائح وشرح لولي الأمر قبل التفاعل"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                  <span>شرح لولي الأمر 👨‍👧‍👦</span>
                </button>

                <button
                  onClick={() => {
                    sound.playSfx('click');
                    onSelectLesson(lesson);
                  }}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow transition group-hover:translate-x-[-4px]"
                >
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
