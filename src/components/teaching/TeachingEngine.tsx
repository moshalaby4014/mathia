import React, { useState } from 'react';
import { Lesson, LessonPhase, MathRepresentation } from '../../types/teaching';
import { PlayerProfile } from '../../types/game';
import { sound } from '../../services/audio';
import { storage } from '../../services/storage';
import { WhyModal } from './modes/WhyModal';
import { ShowMeHowModal } from './modes/ShowMeHowModal';
import { PredictionStep } from './modes/PredictionStep';
import { NumberLineEngine } from './manipulatives/NumberLineEngine';
import { TenFrameEngine } from './manipulatives/TenFrameEngine';
import { PlaceValueBlocksEngine } from './manipulatives/PlaceValueBlocksEngine';
import { VerticalAlgorithmEngine } from './manipulatives/VerticalAlgorithmEngine';
import { FactFamilyEngine } from './manipulatives/FactFamilyEngine';
import { Chart120Engine } from './manipulatives/Chart120Engine';
import { InteractiveClockEngine } from './manipulatives/InteractiveClockEngine';
import { RulerEngine } from './manipulatives/RulerEngine';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Eye,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Star,
  Award,
  BookOpen,
} from 'lucide-react';

interface Props {
  lesson: Lesson;
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
  onReturnToMap: () => void;
  onSelectNextLesson?: () => void;
}

export const TeachingEngine: React.FC<Props> = ({
  lesson,
  profile,
  onUpdateProfile,
  onReturnToMap,
  onSelectNextLesson,
}) => {
  // Lesson phase progression
  const [currentPhase, setCurrentPhase] = useState<LessonPhase>('discover');
  const [activeRepresentation, setActiveRepresentation] = useState<MathRepresentation>(
    lesson.discoveryActivity.defaultRepresentation || lesson.supportedRepresentations[0]
  );

  // Modals
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showShowMeHowModal, setShowShowMeHowModal] = useState(false);

  // Activity interaction state
  const [isActivityCompleted, setIsActivityCompleted] = useState(false);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [misconceptionsFound, setMisconceptionsFound] = useState<string[]>([]);
  const [miroMessage, setMiroMessage] = useState<string>(lesson.storyIntro.dialogueAr);
  const [miroMood, setMiroMood] = useState<'happy' | 'thinking' | 'cheering' | 'talking'>('talking');

  // Phases array in pedagogical order
  const PHASES: { id: LessonPhase; titleAr: string; icon: string }[] = [
    { id: 'discover', titleAr: 'اكتشف', icon: '🔍' },
    { id: 'visualize', titleAr: 'شاهد', icon: '👀' },
    { id: 'predict', titleAr: 'توقع', icon: '🔮' },
    { id: 'interact', titleAr: 'جرب', icon: '🧪' },
    { id: 'explain', titleAr: 'افهم', icon: '💡' },
    { id: 'practice', titleAr: 'تدرب', icon: '⚡' },
    { id: 'apply', titleAr: 'طبق', icon: '🌍' },
    { id: 'master', titleAr: 'أتقن', icon: '👑' },
  ];

  const currentPhaseIndex = PHASES.findIndex((p) => p.id === currentPhase);

  // Handle successful interaction inside manipulative
  const handleManipulativeSuccess = () => {
    setIsActivityCompleted(true);
    setMiroMood('cheering');
    setMiroMessage('رائع جداً يا بطل! لقد قمت بالعملية الرياضية بدقة واكتشفت المفهوم بنفسك!');
    sound.playSfx('success');
  };

  const handleMisconception = (tag: string) => {
    if (!misconceptionsFound.includes(tag)) {
      setMisconceptionsFound((prev) => [...prev, tag]);
    }
    setMiroMood('thinking');
    setMiroMessage('💡 انتبه يا بطل، راجع الخطوة جيداً ولا تتعجل!');
    storage.updateSkillOutcome(lesson.id, false, hintsUsedCount + 1, tag);
  };

  const handleNextPhase = () => {
    sound.playSfx('click');
    setIsActivityCompleted(false);

    if (currentPhaseIndex < PHASES.length - 1) {
      const nextPhase = PHASES[currentPhaseIndex + 1].id;
      setCurrentPhase(nextPhase);

      // Tailor Miro guidance per phase
      if (nextPhase === 'visualize') {
        setMiroMessage('انظر كيف يظهر المفهوم بصرياً! يمكنك التبديل بين التمثيلات الرياضية المختلفة.');
      } else if (nextPhase === 'predict') {
        setMiroMessage('تحدي التوقع الذكي: فكر جيداً ماذا سيحدث قبل أن ننفذ العملية!');
      } else if (nextPhase === 'interact') {
        setMiroMessage('حان دورك لتلمس وتحرك العناصر وتصنع الناتج بنفسك!');
      } else if (nextPhase === 'explain') {
        setMiroMessage(lesson.discoveryActivity.whyExplanation.answerAr);
      } else if (nextPhase === 'practice') {
        setMiroMessage('مسألة جديدة لنفس المفهوم! هل تستطيع حلها بنفس الاستراتيجية؟');
      } else if (nextPhase === 'apply') {
        setMiroMessage(`موقف من الحياة الواقعية: ${lesson.realWorldApplication.scenarioAr}`);
      } else if (nextPhase === 'master') {
        setMiroMessage('اختبار النقل والإتقان: حل المسألة بتمثيل رياضي جديد لإثبات الفهم العميق!');
      }
    } else {
      // Completed all phases -> Award Stars, Coins, Crystals & Record Mastery!
      sound.playSfx('fanfare');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      const updatedProfile: PlayerProfile = {
        ...profile,
        stars: profile.stars + 3,
        coins: profile.coins + 25,
        xp: profile.xp + 50,
      };

      // If lesson belongs to a world crystal, illuminate it
      if (lesson.worldId === 'addition') {
        updatedProfile.crystals = { ...updatedProfile.crystals, addition: true };
      } else if (lesson.worldId === 'subtraction') {
        updatedProfile.crystals = { ...updatedProfile.crystals, subtraction: true };
      } else if (lesson.worldId === 'numbers') {
        updatedProfile.crystals = { ...updatedProfile.crystals, numbers: true };
      } else if (lesson.worldId === 'time') {
        updatedProfile.crystals = { ...updatedProfile.crystals, time: true };
      } else if (lesson.worldId === 'measurement') {
        updatedProfile.crystals = { ...updatedProfile.crystals, measurement: true };
      } else if (lesson.worldId === 'mixed') {
        updatedProfile.crystals = { ...updatedProfile.crystals, mixed: true };
      }

      onUpdateProfile(updatedProfile);
      storage.saveProfile(updatedProfile);
      storage.updateSkillOutcome(lesson.id, true, hintsUsedCount);
    }
  };

  const handlePrevPhase = () => {
    if (currentPhaseIndex > 0) {
      sound.playSfx('click');
      setCurrentPhase(PHASES[currentPhaseIndex - 1].id);
      setIsActivityCompleted(false);
    }
  };

  // Render the appropriate manipulative based on active representation
  const renderManipulative = () => {
    // Specific representations
    switch (activeRepresentation) {
      case 'number_line': {
        const isSub = lesson.category === 'subtraction_strategies';
        return (
          <NumberLineEngine
            startNumber={isSub ? 15 : 7}
            stepsToJump={4}
            operation={isSub ? 'subtract' : 'add'}
            label={lesson.titleAr}
            onSuccess={handleManipulativeSuccess}
          />
        );
      }

      case 'ten_frame': {
        return (
          <TenFrameEngine
            initialCount1={lesson.id === 'add_doubles' ? 6 : 8}
            initialCount2={lesson.id === 'add_doubles' ? 6 : 5}
            mode={lesson.id === 'add_doubles' ? 'doubles' : 'make_ten'}
            onSuccess={handleManipulativeSuccess}
          />
        );
      }

      case 'place_value': {
        return (
          <PlaceValueBlocksEngine
            initialHundreds={lesson.id === 'place_value_h_t_o' ? 2 : 0}
            initialTens={lesson.id === 'sub_vertical_regroup' ? 4 : (lesson.id === 'place_value_h_t_o' ? 4 : 2)}
            initialOnes={lesson.id === 'sub_vertical_regroup' ? 2 : 7}
            targetTotal={lesson.id === 'add_vertical_regroup' ? 45 : (lesson.id === 'sub_vertical_regroup' ? 24 : undefined)}
            label={lesson.titleAr}
            problemStatement={
              lesson.id === 'add_vertical_regroup'
                ? '27 + 18'
                : lesson.id === 'sub_vertical_regroup'
                ? '42 − 18'
                : undefined
            }
            onSuccess={handleManipulativeSuccess}
            onRegroupOccurred={(type) => {
              if (type === 'bundle_tens') {
                setMiroMessage('✨ أحسنت! تجمعت 10 مكعبات آحاد وصنعت عمود عشرة واحدة!');
              } else {
                setMiroMessage('🔨 ممتاز! فككنا عشرة واحدة إلى 10 آحاد، والآن نستطيع الطرح بسهولة!');
              }
            }}
          />
        );
      }

      case 'vertical_equation': {
        return (
          <VerticalAlgorithmEngine
            num1={lesson.id === 'sub_vertical_regroup' ? 42 : 27}
            num2={18}
            operation={lesson.category === 'subtraction_strategies' ? 'subtract' : 'add'}
            onSuccess={handleManipulativeSuccess}
            onErrorMisconception={handleMisconception}
          />
        );
      }

      case 'fact_family': {
        return (
          <FactFamilyEngine
            part1={8}
            part2={5}
            total={13}
            onSuccess={handleManipulativeSuccess}
          />
        );
      }

      case 'chart_120': {
        return (
          <Chart120Engine
            initialNumber={37}
            targetNumber={47}
            onSuccess={handleManipulativeSuccess}
          />
        );
      }

      case 'clock': {
        return (
          <InteractiveClockEngine
            targetHours={7}
            targetMinutes={30}
            onSuccess={handleManipulativeSuccess}
          />
        );
      }

      case 'ruler': {
        return (
          <RulerEngine
            objectNameAr="قلم القصب البردي"
            actualLengthCm={12}
            onSuccess={handleManipulativeSuccess}
          />
        );
      }

      case 'objects':
      default: {
        return (
          <div className="w-full bg-white border-3 border-amber-300 rounded-3xl p-6 shadow-md flex flex-col items-center select-none text-center space-y-4">
            <div className="text-5xl my-2">
              {lesson.storyIntro.sceneEmoji}
            </div>
            <h4 className="text-lg font-black text-amber-950">
              {lesson.discoveryActivity.promptAr}
            </h4>
            <p className="text-sm font-bold text-slate-600 max-w-md">
              {lesson.discoveryActivity.instructionAr}
            </p>
            <button
              onClick={handleManipulativeSuccess}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-2xl shadow-md active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>تنفيذ واكتشاف الحل التفاعلي</span>
            </button>
          </div>
        );
      }
    }
  };

  const representationLabels: Record<MathRepresentation, { labelAr: string; icon: string }> = {
    objects: { labelAr: 'مجسمات وأشياء', icon: '🍎' },
    number_line: { labelAr: 'خط الأعداد', icon: '📏' },
    ten_frame: { labelAr: 'إطار العشرة', icon: '🧺' },
    place_value: { labelAr: 'قطع القيمة المكانية', icon: '🧱' },
    vertical_equation: { labelAr: 'الخوارزمية الرأسية', icon: '📝' },
    fact_family: { labelAr: 'عائلة الحقائق', icon: '🔺' },
    chart_120: { labelAr: 'لوحة الـ 120', icon: '🔢' },
    clock: { labelAr: 'الساعة التناظرية', icon: '⏰' },
    ruler: { labelAr: 'المسطرة المترية', icon: '📐' },
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center p-3 sm:p-6 select-none text-right pb-24">
      {/* Modals */}
      {showWhyModal && (
        <WhyModal
          questionAr={lesson.whyExplanation.questionAr}
          answerAr={lesson.whyExplanation.answerAr}
          visualConcept={lesson.discoveryActivity.whyExplanation.visualConcept}
          onClose={() => setShowWhyModal(false)}
        />
      )}

      {showShowMeHowModal && (
        <ShowMeHowModal
          titleAr={lesson.titleAr}
          steps={lesson.discoveryActivity.walkthroughSteps}
          onClose={() => setShowShowMeHowModal(false)}
        />
      )}

      {/* Top Breadcrumb Bar */}
      <div className="w-full flex items-center justify-between gap-2 mb-4">
        <button
          onClick={onReturnToMap}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 shadow-sm transition"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للخريطة</span>
        </button>

        <div className="flex items-center gap-2">
          {/* "وريني إزاي" Button */}
          <button
            onClick={() => {
              sound.playSfx('click');
              setHintsUsedCount((prev) => prev + 1);
              setShowShowMeHowModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 font-black text-xs sm:text-sm border border-sky-300 shadow-sm transition active:scale-95"
          >
            <Eye className="w-4 h-4 text-sky-700" />
            <span>وريني إزاي</span>
          </button>

          {/* "ليه؟" Button */}
          <button
            onClick={() => {
              sound.playSfx('click');
              setShowWhyModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95 animate-pulse"
          >
            <HelpCircle className="w-4 h-4 text-amber-900" />
            <span>ليه؟ 🤔</span>
          </button>
        </div>
      </div>

      {/* Lesson Header Banner */}
      <div className={`w-full bg-gradient-to-r ${lesson.colorTheme} text-white rounded-3xl p-4 sm:p-6 shadow-xl border-3 border-white/40 mb-4 relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
              {lesson.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-amber-100">
                مختبر الرياضيات التفاعلي — الصف الثاني الابتدائي
              </div>
              <h1 className="text-xl sm:text-2xl font-black">{lesson.titleAr}</h1>
              <p className="text-xs sm:text-sm text-white/90 font-bold">{lesson.subtitleAr}</p>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-black flex items-center gap-2">
            <span>المرحلة الحالية:</span>
            <span className="bg-white text-slate-900 px-2 py-0.5 rounded-lg shadow-sm">
              {PHASES.find((p) => p.id === currentPhase)?.titleAr}
            </span>
          </div>
        </div>
      </div>

      {/* 8-Phase Learning Journey Bar */}
      <div className="w-full bg-white/90 border-2 border-amber-200 rounded-2xl p-2 mb-4 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between gap-1 min-w-[550px]">
          {PHASES.map((phase, idx) => {
            const isCurrent = phase.id === currentPhase;
            const isPassed = idx < currentPhaseIndex;
            return (
              <button
                key={phase.id}
                onClick={() => {
                  sound.playSfx('click');
                  setCurrentPhase(phase.id);
                  setIsActivityCompleted(false);
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center gap-0.5 text-xs font-black transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-white shadow-md scale-105 ring-2 ring-amber-300'
                    : isPassed
                    ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    : 'bg-slate-50 text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className="text-sm">{phase.icon}</span>
                <span className="text-[11px]">{phase.titleAr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Miro Companion Live Dialogue Card */}
      <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-md flex items-center gap-3.5 mb-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-600 flex items-center justify-center text-3xl shadow-md shrink-0 animate-float">
          🦊
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
              ميرو — رفيقك الذكي
            </span>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-800 leading-relaxed">
            {miroMessage}
          </p>
        </div>
      </div>

      {/* Representation Switcher (Multi-Representation Support) */}
      {lesson.supportedRepresentations.length > 1 && (
        <div className="w-full mb-4 bg-slate-100 p-2 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs font-black text-slate-600 px-2">التمثيل الرياضي:</span>
          {lesson.supportedRepresentations.map((rep) => {
            const info = representationLabels[rep] || { labelAr: rep, icon: '✨' };
            const isActive = activeRepresentation === rep;
            return (
              <button
                key={rep}
                onClick={() => {
                  sound.playSfx('click');
                  setActiveRepresentation(rep);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <span>{info.icon}</span>
                <span>{info.labelAr}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Phase 3 Special: PREDICTION MODE */}
      {currentPhase === 'predict' && lesson.prediction && (
        <div className="w-full mb-4">
          <PredictionStep
            prompt={lesson.prediction}
            onPredictionAnswered={(isCorrect) => {
              if (isCorrect) {
                handleManipulativeSuccess();
              }
            }}
          />
        </div>
      )}

      {/* Active Manipulative Interactive Canvas */}
      <div className="w-full my-2">
        {renderManipulative()}
      </div>

      {/* Bottom Phase Navigation Controller */}
      <div className="w-full mt-6 flex items-center justify-between gap-3 pt-4 border-t-2 border-slate-200">
        <button
          onClick={handlePrevPhase}
          disabled={currentPhaseIndex === 0}
          className={`px-4 py-2.5 rounded-2xl border border-slate-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 ${
            currentPhaseIndex === 0 ? 'opacity-30 cursor-not-allowed text-slate-400' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
          <span>المرحلة السابقة</span>
        </button>

        <button
          onClick={handleNextPhase}
          className="flex-1 max-w-xs py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-800/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span>
            {currentPhaseIndex === PHASES.length - 1
              ? 'إتمام الدرس والحصول على النجوم! ⭐'
              : `المرحلة التالية (${PHASES[currentPhaseIndex + 1]?.titleAr})`}
          </span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
