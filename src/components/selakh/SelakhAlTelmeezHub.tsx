import React, { useState } from 'react';
import { PlayerProfile } from '../../types/game';
import {
  SELAKH_UNITS,
  SelakhUnit,
  SelakhLesson,
  SelakhActivity,
} from '../../services/selakhCurriculumData';
import { sound } from '../../services/audio';
import { storage } from '../../services/storage';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Coins,
  Brain,
  Lightbulb,
  HeartHandshake,
  Check,
  RotateCcw,
} from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
  onReturnToMap: () => void;
}

type TabMode = 'learn' | 'activities' | 'quiz' | 'genius' | 'parentTip';

export const SelakhAlTelmeezHub: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  onReturnToMap,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(SELAKH_UNITS[0].id);
  const currentUnit = SELAKH_UNITS.find((u) => u.id === selectedUnitId) || SELAKH_UNITS[0];

  const [selectedLessonId, setSelectedLessonId] = useState<string>(currentUnit.lessons[0].id);
  const currentLesson =
    currentUnit.lessons.find((l) => l.id === selectedLessonId) || currentUnit.lessons[0];

  const [activeTab, setActiveTab] = useState<TabMode>('learn');

  // Activities state
  const [activityAnswers, setActivityAnswers] = useState<Record<string, number | string>>({});
  const [activityFeedback, setActivityFeedback] = useState<Record<string, boolean | null>>({});

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Genius riddle state
  const [geniusAnswer, setGeniusAnswer] = useState<number | null>(null);
  const [geniusSolved, setGeniusSolved] = useState(false);

  const handleSelectUnit = (unitId: string) => {
    sound.playSfx('click');
    setSelectedUnitId(unitId);
    const unit = SELAKH_UNITS.find((u) => u.id === unitId) || SELAKH_UNITS[0];
    setSelectedLessonId(unit.lessons[0].id);
    setActiveTab('learn');
    resetQuizAndActivities();
  };

  const resetQuizAndActivities = () => {
    setActivityAnswers({});
    setActivityFeedback({});
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setGeniusAnswer(null);
    setGeniusSolved(false);
  };

  const handleSelectActivityChoice = (act: SelakhActivity, choiceIdx: number) => {
    if (!act.choices) return;
    const choice = act.choices[choiceIdx];
    setActivityAnswers((prev) => ({ ...prev, [act.id]: choiceIdx }));

    if (choice.correct) {
      sound.playSfx('success');
      setActivityFeedback((prev) => ({ ...prev, [act.id]: true }));
    } else {
      sound.playSfx('error');
      setActivityFeedback((prev) => ({ ...prev, [act.id]: false }));
    }
  };

  const handleSelectCompare = (act: SelakhActivity, sign: '>' | '<' | '=') => {
    if (!act.compareData) return;
    setActivityAnswers((prev) => ({ ...prev, [act.id]: sign }));
    const isCorrect = sign === act.compareData.correctSign;

    if (isCorrect) {
      sound.playSfx('success');
      setActivityFeedback((prev) => ({ ...prev, [act.id]: true }));
    } else {
      sound.playSfx('error');
      setActivityFeedback((prev) => ({ ...prev, [act.id]: false }));
    }
  };

  const handleQuizAnswer = (qIdx: number, cIdx: number) => {
    if (quizSubmitted) return;
    sound.playSfx('click');
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: cIdx }));
  };

  const handleSubmitQuiz = () => {
    const questions = currentLesson.selfCheckQuiz.questions;
    let score = 0;
    questions.forEach((q, idx) => {
      const selected = quizAnswers[idx];
      if (selected !== undefined && q.choices[selected]?.correct) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === questions.length) {
      sound.playSfx('fanfare');
      confetti({ particleCount: 70, spread: 60 });
      // Reward player
      const updated = {
        ...profile,
        stars: profile.stars + currentLesson.selfCheckQuiz.starsReward,
        coins: profile.coins + currentLesson.selfCheckQuiz.coinsReward,
        xp: profile.xp + currentLesson.selfCheckQuiz.xpReward,
      };
      onUpdateProfile(updated);
      storage.saveProfile(updated);
    } else if (score > 0) {
      sound.playSfx('success');
    } else {
      sound.playSfx('error');
    }
  };

  const handleGeniusChoice = (optIdx: number) => {
    setGeniusAnswer(optIdx);
    const opt = currentLesson.geniusChallenge.options[optIdx];

    if (opt.correct) {
      sound.playSfx('fanfare');
      setGeniusSolved(true);
      confetti({ particleCount: 60, spread: 50 });
      // Reward
      const updated = {
        ...profile,
        coins: profile.coins + currentLesson.geniusChallenge.bonusCoins,
        xp: profile.xp + 40,
      };
      onUpdateProfile(updated);
      storage.saveProfile(updated);
    } else {
      sound.playSfx('error');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center p-3 sm:p-6 select-none text-right pb-28 animate-fade-in">
      {/* Top Header Bar: Selakh Al-Telmeez Emblem */}
      <div className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-yellow-300 relative overflow-hidden mb-5">
        {/* Subtle decorative shapes */}
        <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute right-4 top-2 text-6xl opacity-15 pointer-events-none">📚</div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-right">
            {/* Textbook Mascot Emblem */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 text-emerald-950 rounded-2xl border-2 border-white flex flex-col items-center justify-center font-black shadow-lg shrink-0">
              <span className="text-2xl sm:text-3xl">📚</span>
              <span className="text-[10px] leading-tight font-black">سلاح التلميذ</span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 bg-yellow-300 text-emerald-950 px-3 py-0.5 rounded-full text-xs font-black mb-1 shadow-sm">
                <span>🇪🇬 المنهج المصري المطور • الصف الثاني الابتدائي</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                سلاح التلميذ التفاعلي في الرياضيات
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 font-bold max-w-xl">
                شرح تفاعلي خطوة بخطوة، أنشطة ذكية، واختبارات «قيِّم نفسك»، وتحديات الأذكياء!
              </p>
            </div>
          </div>

          {/* Action: Return to Map */}
          <button
            onClick={() => {
              sound.playSfx('click');
              onReturnToMap();
            }}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-2xl text-xs sm:text-sm font-black shadow flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للخريطة</span>
          </button>
        </div>
      </div>

      {/* Units Carousel / Selector Tabs */}
      <div className="w-full mb-4">
        <div className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>اختر الوحدة الدراسية من كتاب سلاح التلميذ:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SELAKH_UNITS.map((unit) => {
            const isSelected = unit.id === selectedUnitId;
            return (
              <button
                key={unit.id}
                onClick={() => handleSelectUnit(unit.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all text-center ${
                  isSelected
                    ? 'bg-gradient-to-b from-yellow-100 to-amber-200 border-yellow-500 shadow-md scale-102 font-black text-emerald-950 ring-2 ring-yellow-400'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold'
                }`}
              >
                <span className="text-2xl mb-1">{unit.icon}</span>
                <span className="text-xs font-black leading-tight line-clamp-1">
                  الوحدة {unit.number}
                </span>
                <span className="text-[10px] text-slate-500 font-bold mt-0.5 truncate w-full">
                  {unit.lessonsRangeAr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Unit Banner Details */}
      <div className="w-full bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 sm:p-4 mb-4 flex items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-sm sm:text-base font-black text-emerald-950">
            {currentUnit.titleAr}
          </h2>
          <p className="text-xs text-emerald-800 font-bold">
            {currentUnit.subtitleAr}
          </p>
        </div>
        <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-3 py-1 rounded-xl whitespace-nowrap">
          {currentLesson.lessonNumberAr}
        </span>
      </div>

      {/* Pillar Tabs (تعلَّم، أنشطة، قيِّم نفسك، تحدي العباقرة، نصيحة ولي الأمر) */}
      <div className="w-full flex items-center justify-start gap-1.5 sm:gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => {
            sound.playSfx('click');
            setActiveTab('learn');
          }}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'learn'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-yellow-300" />
          <span>💡 تعلَّم مع سلاح التلميذ</span>
        </button>

        <button
          onClick={() => {
            sound.playSfx('click');
            setActiveTab('activities');
          }}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'activities'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>✏️ أنشطة وتدريبات ({currentLesson.activities.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playSfx('click');
            setActiveTab('quiz');
          }}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'quiz'
              ? 'bg-yellow-500 text-slate-900 shadow-md font-black'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-yellow-50'
          }`}
        >
          <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>⭐ قيِّم نفسك (اختبار سريع)</span>
        </button>

        <button
          onClick={() => {
            sound.playSfx('click');
            setActiveTab('genius');
          }}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'genius'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
          }`}
        >
          <Brain className="w-4 h-4 text-yellow-300" />
          <span>🧠 تحدي المتفوقين</span>
        </button>

        <button
          onClick={() => {
            sound.playSfx('click');
            setActiveTab('parentTip');
          }}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'parentTip'
              ? 'bg-teal-700 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-teal-50'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          <span>👨‍🏫 إرشاد المعلم وولي الأمر</span>
        </button>
      </div>

      {/* Main Tab Content Card */}
      <div className="w-full bg-white rounded-3xl border-3 border-emerald-300 shadow-xl p-5 sm:p-7 space-y-6">
        {/* ===================== TAB 1: LEARN (تعلَّم) ===================== */}
        {activeTab === 'learn' && (
          <div className="space-y-5 animate-fade-in">
            {/* Title */}
            <div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {currentLesson.lessonNumberAr} • {currentLesson.unitTitleAr}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {currentLesson.learnSection.conceptTitleAr}
              </h2>
            </div>

            {/* Explanation Paragraph */}
            <div className="bg-amber-50/70 border-r-4 border-amber-500 p-4 rounded-xl text-sm sm:text-base text-slate-800 leading-relaxed font-bold">
              {currentLesson.learnSection.explanationAr}
            </div>

            {/* Visual Diagram Box */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 text-center shadow-inner">
              <div className="text-xs font-black text-emerald-800 mb-2">
                مخطط الشرح البصري:
              </div>
              <div className="text-base sm:text-xl font-black text-emerald-950 leading-loose">
                {currentLesson.learnSection.visualDiagram}
              </div>
            </div>

            {/* Golden Rule Callout (علامة سلاح التلميذ الذهبية) */}
            <div className="bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <span className="text-2xl">⭐</span>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-amber-950 mb-0.5">
                  قاعدة سلاح التلميذ الذهبية للنجاح
                </h4>
                <p className="text-xs sm:text-sm font-bold text-amber-900 leading-relaxed">
                  {currentLesson.learnSection.goldenRuleAr}
                </p>
              </div>
            </div>

            {/* Solved Model Example (مثال محلول خطوة بخطوة) */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>مثال محلول نموذجي من الكتاب:</span>
              </div>

              <div className="bg-white border border-slate-300 p-3 rounded-xl font-black text-slate-800 text-sm sm:text-base">
                {currentLesson.learnSection.solvedExample.problemAr}
              </div>

              <div className="space-y-1.5 pr-2">
                <div className="text-xs font-black text-slate-500">خطوات الحل والتفكير الذكي:</div>
                {currentLesson.learnSection.solvedExample.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2 text-xs sm:text-sm font-bold text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-100 text-emerald-950 p-2.5 rounded-xl text-xs sm:text-sm font-black border border-emerald-300">
                ✅ النتيجة النهائية: {currentLesson.learnSection.solvedExample.answerAr}
              </div>
            </div>

            {/* Next Step Action Button */}
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  sound.playSfx('click');
                  setActiveTab('activities');
                }}
                className="game-btn-primary px-8 py-3 rounded-2xl text-white font-black text-sm shadow flex items-center justify-center gap-2 mx-auto"
              >
                <span>انتقل إلى أنشطة وتدريبات سلاح التلميذ ✏️</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ACTIVITIES (أنشطة وتدريبات) ===================== */}
        {activeTab === 'activities' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between gap-2 border-b pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  أنشطة وتدريبات سلاح التلميذ التفاعلية ✏️
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  أجب عن الأسئلة واكتشف التقييم والشرح الفوري لكل خطوة!
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playSfx('click');
                  setActivityAnswers({});
                  setActivityFeedback({});
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 flex items-center gap-1 text-xs font-bold"
                title="إعادة حل الأنشطة"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة التدريب</span>
              </button>
            </div>

            {/* Activities List */}
            <div className="space-y-5">
              {currentLesson.activities.map((act, aIdx) => {
                const isAnswered = activityAnswers[act.id] !== undefined;
                const isCorrect = activityFeedback[act.id] === true;

                return (
                  <div
                    key={act.id}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                      isAnswered
                        ? isCorrect
                          ? 'bg-emerald-50/60 border-emerald-400'
                          : 'bg-rose-50/60 border-rose-300'
                        : 'bg-slate-50/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                        {aIdx + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-slate-800">
                        {act.questionAr}
                      </h4>
                    </div>

                    {/* Visual Prompt if any */}
                    {act.visualPrompt && (
                      <div className="bg-white border border-slate-300 p-2.5 rounded-xl my-2 text-center text-xs sm:text-sm font-black text-amber-950 shadow-inner">
                        {act.visualPrompt}
                      </div>
                    )}

                    {/* Compare question type (> < =) */}
                    {act.type === 'compare' && act.compareData && (
                      <div className="my-3 flex flex-col items-center gap-3">
                        <div className="flex items-center justify-center gap-4 bg-white border-2 border-amber-300 py-3 px-6 rounded-2xl shadow-sm">
                          <span className="text-sm sm:text-base font-black text-slate-800">
                            {act.compareData.leftLabel}
                          </span>
                          <span className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-lg font-black text-amber-950">
                            {(activityAnswers[act.id] as string) || '؟'}
                          </span>
                          <span className="text-sm sm:text-base font-black text-slate-800">
                            {act.compareData.rightLabel}
                          </span>
                        </div>

                        {/* Sign buttons */}
                        <div className="flex items-center gap-3">
                          {(['>', '<', '='] as const).map((sign) => (
                            <button
                              key={sign}
                              onClick={() => handleSelectCompare(act, sign)}
                              className={`w-12 h-10 rounded-xl font-black text-lg border-2 transition-transform active:scale-90 ${
                                activityAnswers[act.id] === sign
                                  ? sign === act.compareData?.correctSign
                                    ? 'bg-emerald-600 text-white border-emerald-700 shadow'
                                    : 'bg-rose-500 text-white border-rose-600 shadow'
                                  : 'bg-white hover:bg-amber-100 border-amber-300 text-amber-950'
                              }`}
                            >
                              {sign}
                            </button>
                          ))}
                        </div>

                        {isAnswered && (
                          <div className="text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 mt-1">
                            {act.compareData.explanation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Choice question type */}
                    {act.type === 'choice' && act.choices && (
                      <div className="space-y-2 mt-3">
                        {act.choices.map((choice, cIdx) => {
                          const isSelected = activityAnswers[act.id] === cIdx;
                          return (
                            <button
                              key={cIdx}
                              onClick={() => handleSelectActivityChoice(act, cIdx)}
                              className={`w-full py-2.5 px-3.5 rounded-xl text-right text-xs sm:text-sm font-bold border-2 transition-all flex items-center justify-between ${
                                isSelected
                                  ? choice.correct
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black shadow-sm'
                                    : 'bg-rose-100 border-rose-400 text-rose-950 font-black shadow-sm'
                                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                              }`}
                            >
                              <span>{choice.text}</span>
                              {isSelected && (
                                <span>{choice.correct ? '✅ أحسنت!' : '❌ حاول مجدداً'}</span>
                              )}
                            </button>
                          );
                        })}

                        {/* Explanation callout */}
                        {isAnswered && typeof activityAnswers[act.id] === 'number' && (
                          <div className="text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 mt-1">
                            💡 {act.choices[activityAnswers[act.id] as number].explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Next Step Action Button */}
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  sound.playSfx('click');
                  setActiveTab('quiz');
                }}
                className="game-btn-primary px-8 py-3 rounded-2xl text-white font-black text-sm shadow flex items-center justify-center gap-2 mx-auto"
              >
                <span>خض اختبار «قيِّم نفسك» واكسب النجوم ⭐</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: SELF-CHECK QUIZ (قيِّم نفسك) ===================== */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-yellow-50 via-amber-100 to-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⭐</span>
                <div>
                  <h3 className="text-base font-black text-amber-950">
                    {currentLesson.selfCheckQuiz.titleAr}
                  </h3>
                  <p className="text-xs text-amber-900 font-bold">
                    اختبار تقييم ختامي سريع يقيس مدى فهمك وإتقانك لأفكار الدرس!
                  </p>
                </div>
              </div>

              {/* Reward preview */}
              <div className="flex items-center gap-2 bg-white/80 border border-yellow-400 px-3 py-1.5 rounded-xl text-xs font-black text-amber-900">
                <span>المكافأة:</span>
                <span className="text-amber-600">⭐ +{currentLesson.selfCheckQuiz.starsReward}</span>
                <span className="text-yellow-600">🪙 +{currentLesson.selfCheckQuiz.coinsReward}</span>
              </div>
            </div>

            {/* Quiz Questions */}
            <div className="space-y-4">
              {currentLesson.selfCheckQuiz.questions.map((q, qIdx) => {
                const selected = quizAnswers[qIdx];
                return (
                  <div key={qIdx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                        {qIdx + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-slate-800">
                        {q.prompt}
                      </h4>
                    </div>

                    <div className="space-y-1.5">
                      {q.choices.map((choice, cIdx) => {
                        const isChosen = selected === cIdx;
                        return (
                          <button
                            key={cIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleQuizAnswer(qIdx, cIdx)}
                            className={`w-full py-2 px-3 rounded-xl text-right text-xs sm:text-sm font-bold border-2 transition-all flex items-center justify-between ${
                              quizSubmitted
                                ? choice.correct
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black'
                                  : isChosen
                                  ? 'bg-rose-100 border-rose-400 text-rose-950 font-black'
                                  : 'bg-white border-slate-200 text-slate-500 opacity-60'
                                : isChosen
                                ? 'bg-amber-100 border-amber-500 text-amber-950 font-black'
                                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span>{choice.text}</span>
                            {quizSubmitted && choice.correct && <span>✅</span>}
                            {quizSubmitted && isChosen && !choice.correct && <span>❌</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit Button & Results */}
            {!quizSubmitted ? (
              <div className="text-center pt-2">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={
                    Object.keys(quizAnswers).length <
                    currentLesson.selfCheckQuiz.questions.length
                  }
                  className={`px-8 py-3 rounded-2xl font-black text-sm shadow transition-all ${
                    Object.keys(quizAnswers).length >=
                    currentLesson.selfCheckQuiz.questions.length
                      ? 'game-btn-primary text-white scale-102 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  تصحيح الاختبار وإظهار النتيجة 🚀
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 text-center space-y-3 animate-fade-in">
                <div className="text-4xl animate-bounce">
                  {quizScore === currentLesson.selfCheckQuiz.questions.length ? '🏆' : '👏'}
                </div>
                <h4 className="text-lg sm:text-xl font-black text-emerald-950">
                  درجتك في اختبار سلاح التلميذ: {quizScore} من{' '}
                  {currentLesson.selfCheckQuiz.questions.length}
                </h4>
                <div className="flex items-center justify-center gap-1.5 text-2xl text-amber-500">
                  {Array.from({ length: currentLesson.selfCheckQuiz.questions.length }).map(
                    (_, i) => (
                      <span key={i}>{i < quizScore ? '⭐' : '☆'}</span>
                    )
                  )}
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  {quizScore === currentLesson.selfCheckQuiz.questions.length
                    ? 'ممتاز مع مرتبة الشرف! تم إيداع النجوم والعملات في حسابك بنجاح!'
                    : 'محاولة جيدة جداً! راجع الأسئلة الخاطئة بالأعلى لتتقن الفكرة 100%!'}
                </p>

                <button
                  onClick={() => {
                    sound.playSfx('click');
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black shadow-xs hover:bg-emerald-100"
                >
                  إعادة الاختبار 🔄
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: GENIUS CHALLENGE (تحدي المتفوقين) ===================== */}
        {activeTab === 'genius' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-gradient-to-r from-purple-100 via-indigo-100 to-purple-100 border-2 border-purple-400 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧠</span>
                <div>
                  <h3 className="text-base font-black text-purple-950">
                    {currentLesson.geniusChallenge.titleAr}
                  </h3>
                  <p className="text-xs text-purple-900 font-bold">
                    مسألة ذكاء للمتميزين فقط! حلها لتكسب مكافأة الـ 50 عملة ذهبية!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-white border border-purple-300 px-3 py-1 rounded-xl text-xs font-black text-purple-900">
                <Coins className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                <span>+{currentLesson.geniusChallenge.bonusCoins} عملة</span>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-purple-200 rounded-2xl p-5 space-y-4">
              <div className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
                🧩 {currentLesson.geniusChallenge.riddleAr}
              </div>

              <div className="space-y-2">
                {currentLesson.geniusChallenge.options.map((opt, oIdx) => {
                  const isSelected = geniusAnswer === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleGeniusChoice(oIdx)}
                      className={`w-full py-3 px-4 rounded-xl text-right text-xs sm:text-sm font-black border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? opt.correct
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow'
                            : 'bg-rose-100 border-rose-400 text-rose-950 shadow'
                          : 'bg-white hover:bg-purple-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && (
                        <span>{opt.correct ? '🏆 عبقري!' : '❌ فكر مرة أخرى'}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {geniusSolved && (
                <div className="bg-emerald-100 border border-emerald-400 text-emerald-950 p-3 rounded-xl text-xs sm:text-sm font-black text-center animate-fade-in">
                  🎉 أحسنت صنعاً! أثبتّ أنك تلميذ عبقري وموهوب! تمت إضافة 50 عملة ذهبية لحسابك!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: PARENT TIP (إرشاد ولي الأمر) ===================== */}
        {activeTab === 'parentTip' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-300 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <span className="text-3xl">👨‍🏫</span>
              <div>
                <h3 className="text-base font-black text-teal-950">
                  إرشاد سلاح التلميذ لولي الأمر والمعلم
                </h3>
                <p className="text-xs text-teal-800 font-bold">
                  توصيات تربوية عملية من مؤلفي كتاب سلاح التلميذ لمساعدة التلميذ في المنزل
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 text-sm sm:text-base font-bold text-slate-800 leading-relaxed space-y-3">
              <div className="text-amber-600 font-black text-sm">
                📌 كيف تساعد طفلك على إتقان ({currentLesson.titleAr})؟
              </div>
              <p className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                {currentLesson.parentCoachTipAr}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
