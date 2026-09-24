import React, { useState } from 'react';
import { PlayerProfile, SkillMasteryRecord } from '../types/game';
import { GRADE_2_SKILLS, MISCONCEPTIONS_CATALOG } from '../services/curriculum';
import { CURRICULUM_LESSONS } from '../services/curriculumLessons';
import { storage } from '../services/storage';
import { sound } from '../services/audio';
import {
  ShieldCheck,
  Clock,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  onClose: () => void;
  onResetProgress: () => void;
}

export const ParentDashboard: React.FC<Props> = ({
  profile,
  onClose,
  onResetProgress,
}) => {
  // Adult Gate State: e.g. 7 x 8 = 56
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gateAnswer, setGateAnswer] = useState('');
  const [gateError, setGateError] = useState(false);

  // Mastery records
  const masteryData = storage.loadMastery();

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (gateAnswer.trim() === '56') {
      sound.playSfx('success');
      setIsAuthenticated(true);
      setGateError(false);
    } else {
      sound.playSfx('error');
      setGateError(true);
    }
  };

  const getMasteryColor = (level?: string) => {
    switch (level) {
      case 'mastered':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          label: 'متقن ⭐',
        };
      case 'good':
        return {
          bg: 'bg-teal-100 text-teal-900 border-teal-300',
          label: 'جيد 👍',
        };
      case 'learning':
        return {
          bg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
          label: 'يتعلم ⏳',
        };
      case 'needs_practice':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          label: 'يحتاج تدريب ⚠️',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          label: 'لم يبدأ بعد',
        };
    }
  };

  // Adult gate modal if not authenticated yet
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
        <div className="bg-white rounded-3xl border-4 border-slate-700 p-6 sm:p-8 max-w-md w-full text-right shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xl font-black text-slate-800">بوابة ولي الأمر والمعلم</span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-black text-lg"
            >
              ✕
            </button>
          </div>

          <p className="text-sm font-bold text-slate-600">
            للتأكد من أنك ولي الأمر أو المعلم، يرجى حل المسألة الرياضية التالية للدخول:
          </p>

          <form onSubmit={handleVerifyGate} className="space-y-4">
            <div className="bg-slate-100 p-4 rounded-2xl text-center text-2xl font-black text-slate-800 tracking-wider">
              7 × 8 = ؟
            </div>

            <input
              type="number"
              value={gateAnswer}
              onChange={(e) => setGateAnswer(e.target.value)}
              placeholder="اكتب الناتج بالأرقام..."
              className="w-full text-center py-3 text-xl font-black border-2 border-slate-300 focus:border-slate-800 rounded-xl outline-none"
              autoFocus
            />

            {gateError && (
              <p className="text-xs font-black text-rose-600 text-center">
                إجابة غير صحيحة، تذكر جدول الضرب أو حاول ثانية!
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50"
              >
                رجوع للطفل
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black shadow"
              >
                تأكيد الدخول
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const crystalCount = Object.values(profile.crystals).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 select-none flex justify-center">
      <div className="bg-white rounded-3xl border-4 border-slate-700 shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col text-right">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                لوحة تقرير ولي الأمر والمعلم
              </h2>
              <p className="text-xs text-slate-400">
                متابعة تقدم الطالب: {profile.name} (الصف الثاني الابتدائي - المنهج المصري)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black border border-white/20"
          >
            العودة للعبة
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3.5 text-center">
              <div className="flex items-center justify-center text-sky-600 mb-1">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-sky-950">
                {profile.totalPlayMinutes || 12} دقيقة
              </div>
              <div className="text-xs font-bold text-sky-700">وقت التعلم النشط</div>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3.5 text-center">
              <div className="text-2xl mb-1">🔮</div>
              <div className="text-xl font-black text-purple-950">
                {crystalCount} من 9
              </div>
              <div className="text-xs font-bold text-purple-700">بلورات مستعادة</div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5 text-center">
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-xl font-black text-amber-950">
                {profile.stars} نجوم
              </div>
              <div className="text-xs font-bold text-amber-700">نجوم الإتقان</div>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3.5 text-center">
              <div className="flex items-center justify-center text-emerald-600 mb-1">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-emerald-950">
                المستوى {profile.level}
              </div>
              <div className="text-xs font-bold text-emerald-700">خبرة البطل</div>
            </div>
          </div>

          {/* Egyptian Curriculum Mastery Competencies */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-800 font-black text-base">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>مصفوفة نواتج تعلم الصف الثاني الابتدائي</span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                وفق الإطار التعليمي لوزارة التربية والتعليم المصرية
              </span>
            </div>

            <div className="space-y-2">
              {GRADE_2_SKILLS.map((skill) => {
                const record = masteryData[skill.id];
                const mastery = getMasteryColor(record?.masteryLevel);

                return (
                  <div
                    key={skill.id}
                    className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-right"
                  >
                    <div>
                      <div className="text-sm font-black text-slate-800">
                        {skill.titleAr}
                      </div>
                      <div className="text-xs font-bold text-slate-500">
                        {skill.grade2Competency}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {record && (
                        <span className="text-xs font-bold text-slate-500">
                          {record.successes}/{record.attempts} محاولات صحيحة
                        </span>
                      )}
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full border ${mastery.bg}`}
                      >
                        {mastery.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Teaching Engine Lab Lessons Progress */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-purple-950 font-black text-base">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>دروس مختبر المفاهيم والاستراتيجيات التفاعلية</span>
              </div>
              <span className="text-xs font-bold text-purple-700">
                14 درساً تفاعلياً عملياً
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CURRICULUM_LESSONS.map((lesson) => {
                const record = masteryData[lesson.id];
                const mastery = getMasteryColor(record?.masteryLevel);

                return (
                  <div
                    key={lesson.id}
                    className="bg-white p-2.5 rounded-xl border border-purple-200 flex items-center justify-between gap-2 text-right"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{lesson.icon}</span>
                      <div>
                        <div className="text-xs font-black text-slate-800">
                          {lesson.titleAr}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400">
                          {lesson.subtitleAr}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${mastery.bg}`}>
                      {mastery.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detected Misconceptions & Pedagogical Advice */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-black text-base">
              <AlertCircle className="w-5 h-5 text-amber-700" />
              <span>رؤى تربوية وتوصيات لدعم الطفل في المنزل</span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm font-bold text-amber-900 leading-relaxed">
              <div className="bg-white/80 p-3 rounded-xl border border-amber-300">
                <div className="font-black text-amber-950 mb-1">
                  💡 نشاط مقترح (5 دقائق):
                </div>
                اطلب من طفلك إحصاء أنواع الفاكهة أو الملاعق والشوك في المطبخ، ومقارنة أيها أكثر باستخدام الترتيب بالأعمدة على ورقة بيضاء.
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-amber-300">
                <div className="font-black text-amber-950 mb-1">
                  🌟 أسلوب التشجيع الذاتي:
                </div>
                المغامرة تركز على التفكير البصري قبل كتابة الرموز الرياضية؛ امدح طفلك على خطوات تفكيره ومحاولاته وليس فقط الوصول السريع للناتج.
              </div>
            </div>
          </div>

          {/* Danger Zone: Reset Progress */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط تقدم اللعبة بالكامل؟')) {
                  storage.resetAll();
                  onResetProgress();
                  onClose();
                }
              }}
              className="text-xs font-black text-rose-600 hover:text-rose-700 flex items-center gap-1 p-2 rounded-lg hover:bg-rose-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة ضبط تقدم اللعبة (بدء رحلة جديدة)</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-black text-sm rounded-xl shadow"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
