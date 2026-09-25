import React, { useState, useEffect } from 'react';
import { PlayerProfile, SkillMasteryRecord } from '../../types/game';
import { CharacterAvatar } from '../CharacterAvatar';
import { MiroCompanion } from '../MiroCompanion';
import { sound } from '../../services/audio';
import { storage } from '../../services/storage';
import { particles } from '../../services/particles';
import { CrystalAuraCanvas } from '../CrystalAuraCanvas';
import { ParentGuideModal } from '../teaching/ParentGuideModal';
import { getParentGuideForWorld } from '../../services/parentGuideService';
import { certificatesService } from '../../services/certificatesService';
import { CertificateModal } from '../certificates/CertificateModal';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Award,
  ChevronLeft,
  HelpCircle,
  BarChart3,
  Heart,
  Volume2,
  HeartHandshake,
} from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
  onReturnToMap: () => void;
}

type Stage = 'intro' | 'gathering' | 'graph_building' | 'puzzle' | 'boss' | 'victory';

interface FruitItem {
  id: string;
  type: 'apple' | 'banana' | 'orange' | 'grape';
  nameAr: string;
  icon: string;
  color: string;
  targetCount: number;
}

const FRUIT_TYPES: FruitItem[] = [
  { id: 'apple', type: 'apple', nameAr: 'تفاح', icon: '🍎', color: 'bg-rose-500', targetCount: 5 },
  { id: 'banana', type: 'banana', nameAr: 'موز', icon: '🍌', color: 'bg-amber-400', targetCount: 3 },
  { id: 'orange', type: 'orange', nameAr: 'برتقال', icon: '🍊', color: 'bg-orange-500', targetCount: 7 },
  { id: 'grape', type: 'grape', nameAr: 'عنب', icon: '🍇', color: 'bg-purple-600', targetCount: 4 },
];

export const DataQuestEngine: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  onReturnToMap,
}) => {
  const [stage, setStage] = useState<Stage>('intro');
  const [showParentGuide, setShowParentGuide] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const parentGuide = getParentGuideForWorld('forest');
  const forestCert = certificatesService.getCertificateById('cert_forest') || certificatesService.getAllCertificates()[0];

  // Stage 1: Fruit Gathering State
  const [collectedCounts, setCollectedCounts] = useState<Record<string, number>>({
    apple: 0,
    banana: 0,
    orange: 0,
    grape: 0,
  });

  // Stage 2: Graph Column Heights (Interactive graph bars)
  const [graphHeights, setGraphHeights] = useState<Record<string, number>>({
    apple: 0,
    banana: 0,
    orange: 0,
    grape: 0,
  });

  // Stage 3: Puzzle Questions
  const [puzzleStep, setPuzzleStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [puzzleFeedback, setPuzzleFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Stage 4: Boss Encounter State
  const [bossHp, setBossHp] = useState(3);
  const [bossStep, setBossStep] = useState(0);
  const [bossFeedback, setBossFeedback] = useState<string | null>(null);

  // Companion Miro state & progressive hint ladder
  const [miroMessage, setMiroMessage] = useState('أهلاً بك في غابة البيانات! أشجار النيل مليئة بالفواكه اللذيذة!');
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [hintsList, setHintsList] = useState<string[]>([]);
  const [miroMood, setMiroMood] = useState<'happy' | 'thinking' | 'celebrate' | 'guiding' | 'oops' | 'surprised'>('guiding');

  // Initialize stage-specific Miro guides
  useEffect(() => {
    if (stage === 'intro') {
      setMiroMood('guiding');
      setMiroMessage('أهلاً بك في غابة البيانات! أشجار النيل مليئة بالفواكه.. ساعد أهل القرية في جمع فواكه المهرجان وإعداد الرسم البياني!');
      setHintsList([]);
    } else if (stage === 'gathering') {
      setMiroMood('guiding');
      setMiroMessage('اضغط على الفواكه لجمعها في السلال! نريد: 5 تفاح، 3 موز، 7 برتقال، و 4 عنب.');
      setHintsList([
        'اضغط على ثمرة الفاكهة في الشجرة لتنتقل إلى سلتها.',
        'راقب العداد في أسفل الشاشة حتى يكتمل العدد المطلوب.',
      ]);
      setCurrentHintIndex(-1);
    } else if (stage === 'graph_building') {
      setMiroMood('guiding');
      setMiroMessage('رائع! الآن لنبنِ المدرج البياني.. ارفع عمود كل فاكهة ليتطابق مع عددها!');
      setHintsList([
        'استخدم زر (+) لرفع العمود وزر (-) لخفضه.',
        'انظر للأرقام على المسطرة الجانبية: التفاح 5، الموز 3، البرتقال 7، العنب 4.',
      ]);
      setCurrentHintIndex(-1);
    } else if (stage === 'puzzle') {
      loadPuzzleStep(puzzleStep);
    } else if (stage === 'boss') {
      setMiroMood('surprised');
      setMiroMessage('انتبه! ظهر حارس الغابة الحكيم "عم هدهد"! إنه يختبر ذكاءنا قبل إعادة البلورة الخضراء!');
      setHintsList(['أجب عن أسئلة عم هدهد بدقة لهزيمته بلطف واستعادة البلورة!']);
      setCurrentHintIndex(-1);
    } else if (stage === 'victory') {
      sound.playSfx('bossVictory');
      particles.crystalCollect(null, 'forest');
      particles.questVictory();
      setMiroMood('celebrate');
      setMiroMessage('يا للروعة! لقد أعدت بلورة البيانات الخضراء إلى مكانها! أنرت الغابة بأكملها يا بطل!');
    }
  }, [stage]);

  // Helper for Miro Progressive Hints
  const handleAdvanceHint = () => {
    if (currentHintIndex < hintsList.length - 1) {
      const nextIdx = currentHintIndex + 1;
      setCurrentHintIndex(nextIdx);
      setMiroMessage(hintsList[nextIdx]);
      setMiroMood('thinking');
    }
  };

  // -------------------------------------------------------------
  // PHASE 1: FRUIT GATHERING
  // -------------------------------------------------------------
  const handleCollectFruit = (type: string) => {
    const fruit = FRUIT_TYPES.find((f) => f.type === type);
    if (!fruit) return;

    if (collectedCounts[type] < fruit.targetCount) {
      sound.playSfx('pop');
      const nextCount = collectedCounts[type] + 1;
      const updated = { ...collectedCounts, [type]: nextCount };
      setCollectedCounts(updated);

      // Check if all fruits reached target
      const allDone = FRUIT_TYPES.every((f) => updated[f.type] >= f.targetCount);
      if (allDone) {
        sound.playSfx('success');
        particles.correctPop();
        setMiroMood('celebrate');
        setMiroMessage('ممتاز جداً! جمعنا كل فواكه المهرجان بالكامل! حان وقت تشييد المدرج البياني!');
      }
    } else {
      sound.playSfx('click');
    }
  };

  const isGatheringComplete = FRUIT_TYPES.every(
    (f) => collectedCounts[f.type] >= f.targetCount
  );

  // -------------------------------------------------------------
  // PHASE 2: GRAPH BUILDING
  // -------------------------------------------------------------
  const handleAdjustGraph = (type: string, delta: number) => {
    const current = graphHeights[type] || 0;
    const nextVal = Math.max(0, Math.min(8, current + delta));
    sound.playSfx('drop');
    setGraphHeights({ ...graphHeights, [type]: nextVal });
  };

  const isGraphAccurate = FRUIT_TYPES.every(
    (f) => graphHeights[f.type] === f.targetCount
  );

  const handleVerifyGraph = (e?: React.MouseEvent<HTMLElement>) => {
    if (isGraphAccurate) {
      sound.playSfx('success');
      particles.correctPop(e?.currentTarget);
      storage.updateSkillOutcome('skill_graph_build', true, currentHintIndex + 1);
      setMiroMood('celebrate');
      setMiroMessage('إبداع لا يُصدق! كل عمود في مكانه الصحيح تماماً! دعنا نحل ألغاز المقارنة!');
      setTimeout(() => setStage('puzzle'), 1200);
    } else {
      sound.playSfx('error');
      storage.updateSkillOutcome('skill_graph_build', false, currentHintIndex + 1, 'counting_error');
      setMiroMood('oops');
      setMiroMessage('راجع أعمدة الفواكه بدقة.. انظر للأرقام على المسطرة الجانبية: التفاح 5، الموز 3، البرتقال 7، العنب 4.');
    }
  };

  // -------------------------------------------------------------
  // PHASE 3: PUZZLE QUESTIONS
  // -------------------------------------------------------------
  const puzzles = [
    {
      question: 'أي فاكهة هي الأكثر في مهرجان الفواكه؟',
      options: [
        { label: 'الموز 🍌 (3)', val: 'banana', isCorrect: false, errorTag: 'most_least_inverted' },
        { label: 'البرتقال 🍊 (7)', val: 'orange', isCorrect: true },
        { label: 'العنب 🍇 (4)', val: 'grape', isCorrect: false },
        { label: 'التفاح 🍎 (5)', val: 'apple', isCorrect: false },
      ],
      correctExplanation: 'رائع! البرتقال 7 وهو أعلى عمود في الرسم البياني!',
      wrongHint: 'انظر لأطول عمود في المدرج البياني.. إنه يعلو بقية الأعمدة!',
    },
    {
      question: 'أي فاكهة هي الأقل عدداً؟',
      options: [
        { label: 'العنب 🍇 (4)', val: 'grape', isCorrect: false },
        { label: 'البرتقال 🍊 (7)', val: 'orange', isCorrect: false, errorTag: 'most_least_inverted' },
        { label: 'الموز 🍌 (3)', val: 'banana', isCorrect: true },
        { label: 'التفاح 🍎 (5)', val: 'apple', isCorrect: false },
      ],
      correctExplanation: 'بطل! الموز 3 وهو أقصر عمود في المدرج!',
      wrongHint: 'الأقل يعني العمود الأقصر والأصغر ارتفاعاً.',
    },
    {
      question: 'كم يزيد عدد التفاح (5) عن عدد الموز (3)؟',
      options: [
        { label: '8 فواكه', val: 8, isCorrect: false, errorTag: 'difference_vs_sum' },
        { label: '2 ثمرتان', val: 2, isCorrect: true },
        { label: '3 ثمار', val: 3, isCorrect: false },
        { label: '1 ثمرة واحدة', val: 1, isCorrect: false },
      ],
      correctExplanation: 'إجابة مذهلة! 5 - 3 = 2.. التفاح يزيد بثمرتين!',
      wrongHint: 'سؤال "كم يزيد؟" يعني نطرح الفرق بينهما: 5 ناقص 3 = ؟',
    },
  ];

  const loadPuzzleStep = (stepIndex: number) => {
    const current = puzzles[stepIndex];
    if (!current) return;
    setSelectedAnswer(null);
    setPuzzleFeedback('idle');
    setMiroMood('thinking');
    setMiroMessage(current.question);
    setHintsList([current.wrongHint]);
    setCurrentHintIndex(-1);
  };

  const handleSelectPuzzleOption = (
    option: { val: string | number; isCorrect: boolean; errorTag?: string },
    e?: React.MouseEvent<HTMLElement>
  ) => {
    setSelectedAnswer(option.val);
    const currentPuzzle = puzzles[puzzleStep];

    if (option.isCorrect) {
      sound.playSfx('success');
      particles.correctPop(e?.currentTarget);
      setPuzzleFeedback('correct');
      setMiroMood('celebrate');
      setMiroMessage(currentPuzzle.correctExplanation);
      storage.updateSkillOutcome('skill_graph_compare', true, currentHintIndex + 1);

      setTimeout(() => {
        if (puzzleStep < puzzles.length - 1) {
          const nextStep = puzzleStep + 1;
          setPuzzleStep(nextStep);
          loadPuzzleStep(nextStep);
        } else {
          setStage('boss');
        }
      }, 1500);
    } else {
      sound.playSfx('error');
      setPuzzleFeedback('wrong');
      setMiroMood('oops');
      setMiroMessage(currentPuzzle.wrongHint);
      storage.updateSkillOutcome(
        'skill_graph_compare',
        false,
        currentHintIndex + 1,
        option.errorTag || 'comparison_error'
      );
    }
  };

  // -------------------------------------------------------------
  // PHASE 4: BOSS BATTLE (حارس الغابة عم هدهد)
  // -------------------------------------------------------------
  const bossQuestions = [
    {
      q: 'إذا قطفنا ثمرتي برتقال إضافيتين للبرتقال (7)، كم يصبح العدد الإجمالي للبرتقال؟',
      choices: [
        { text: '9 برتقالات 🍊', correct: true },
        { text: '8 برتقالات 🍊', correct: false },
        { text: '10 برتقالات 🍊', correct: false },
      ],
      bossHappyText: 'تفكير عبقري! 7 + 2 = 9!',
    },
    {
      q: 'ما مجموع كل من الموز (3) والعنب (4) معاً في سلة واحدة؟',
      choices: [
        { text: '6 فواكه', correct: false },
        { text: '7 فواكه 🍌🍇', correct: true },
        { text: '8 فواكه', correct: false },
      ],
      bossHappyText: 'أحسنت يا بطل النيل! 3 + 4 = 7!',
    },
    {
      q: 'كم يقل عدد العنب (4) عن عدد البرتقال (7)؟',
      choices: [
        { text: '3 ثمار', correct: true },
        { text: '11 ثمرة', correct: false },
        { text: '4 ثمار', correct: false },
      ],
      bossHappyText: 'ما شاء الله! 7 - 4 = 3! لقد أثبتت جدارتك بامتياز!',
    },
  ];

  const handleAnswerBoss = (
    choice: { text: string; correct: boolean },
    e?: React.MouseEvent<HTMLElement>
  ) => {
    const currentQ = bossQuestions[bossStep];
    if (choice.correct) {
      sound.playSfx('bossHit');
      particles.bossHitSparks(e?.currentTarget);
      setBossFeedback('إصابة موفقة! ' + currentQ.bossHappyText);
      const nextHp = bossHp - 1;
      setBossHp(nextHp);

      if (nextHp <= 0) {
        sound.playSfx('fanfare');
        setTimeout(() => setStage('victory'), 1200);
      } else {
        setTimeout(() => {
          setBossStep(bossStep + 1);
          setBossFeedback(null);
        }, 1300);
      }
    } else {
      sound.playSfx('error');
      setBossFeedback('حاول مجدداً يا بطل.. فكر بروية!');
    }
  };

  // -------------------------------------------------------------
  // PHASE 5: REWARD & COMPLETION
  // -------------------------------------------------------------
  const handleClaimRewardAndExit = (e?: React.MouseEvent<HTMLElement>) => {
    particles.crystalCollect(e?.currentTarget, 'forest');

    // Update player profile with rewards
    const updated: PlayerProfile = {
      ...profile,
      xp: profile.xp + 150,
      stars: profile.stars + 3,
      coins: profile.coins + 60,
      crystals: {
        ...profile.crystals,
        forest: true,
      },
      unlockedWorlds: Array.from(new Set([...profile.unlockedWorlds, 'addition'])),
    };

    // Level up check
    if (updated.xp >= updated.xpToNextLevel) {
      updated.level += 1;
      updated.xp = updated.xp - updated.xpToNextLevel;
      updated.xpToNextLevel = updated.xpToNextLevel + 100;
    }

    storage.saveProfile(updated);
    onUpdateProfile(updated);
    setTimeout(() => {
      onReturnToMap();
    }, 400);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-130px)] pb-24 p-3 sm:p-6 flex flex-col items-center select-none">
      {/* Parent Coaching Guide Modal */}
      {showParentGuide && (
        <ParentGuideModal
          titleAr="غابة البيانات والتمثيل البياني"
          guide={parentGuide}
          onClose={() => setShowParentGuide(false)}
        />
      )}

      {/* Top Quest Header Navigation */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-2 mb-4 flex-wrap">
        <button
          onClick={() => {
            sound.playSfx('click');
            onReturnToMap();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border-2 border-amber-300 rounded-full text-slate-700 font-bold text-xs sm:text-sm hover:bg-amber-50 shadow-sm"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للخريطة</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Parent Guide Button */}
          <button
            onClick={() => {
              sound.playSfx('sparkle');
              setShowParentGuide(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-full text-xs font-black shadow transition active:scale-95 ring-2 ring-emerald-300/60"
            title="دليل ولي الأمر لشرح فكرة جمع البيانات والتمثيل البياني لطفلك قبل البدء"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>شرح لولي الأمر 👨‍👧‍👦</span>
          </button>

          {/* Stage progress pill */}
          <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-xs font-black text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {stage === 'intro' && 'مقدمة المهمة'}
              {stage === 'gathering' && 'المرحلة 1: جمع الفواكه'}
              {stage === 'graph_building' && 'المرحلة 2: بناء المدرج'}
              {stage === 'puzzle' && `المرحلة 3: الألغاز (${puzzleStep + 1}/3)`}
              {stage === 'boss' && 'المرحلة 4: حارس الغابة'}
              {stage === 'victory' && 'النصر واستعادة البلورة!'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Adventure Stage Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col p-4 sm:p-6 mb-6">
        {/* Quick Parent Coaching Callout Banner */}
        {stage !== 'victory' && (
          <div
            onClick={() => {
              sound.playSfx('sparkle');
              setShowParentGuide(true);
            }}
            className="mb-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer transition select-none"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">👨‍👧‍👦</span>
              <span className="text-xs font-black text-emerald-950">
                لولي الأمر: كيف تبسط فكرة تصنيف الفواكه والتمثيل البياني لطفلك قبل البدء؟
              </span>
            </div>
            <span className="text-[11px] font-black text-emerald-900 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300 shadow-sm">
              اقرأ الدليل (دقيقة واحدة) 💡
            </span>
          </div>
        )}

        {/* Stage 0: Intro */}
        {stage === 'intro' && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="text-7xl mb-4 animate-float">🌳🍎🌴</div>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-800 mb-2">
              مهمة غابة البيانات: مهرجان الفواكه
            </h2>
            <p className="text-slate-600 font-bold max-w-md mb-6 leading-relaxed">
              تحتاج الغابة إلى تنظيم بيانات حصاد فواكه النيل لصنع حلوى المهرجان وإنارة بلورة البيانات الخضراء المفقودة!
            </p>

            <button
              onClick={() => {
                sound.playSfx('click');
                setStage('gathering');
              }}
              className="game-btn-primary px-8 py-3.5 rounded-2xl text-white font-black text-lg shadow-xl"
            >
              هيا نجمع الفواكه! 🧺
            </button>
          </div>
        )}

        {/* Stage 1: Fruit Gathering */}
        {stage === 'gathering' && (
          <div className="space-y-6">
            <div className="text-right flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-emerald-900">
                  انقر على الفواكه لجمعها في السلال!
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-500">
                  راقب العداد لكل نوع حتى يكتمل العدد المطلوب للمهرجان
                </p>
              </div>

              {isGatheringComplete && (
                <button
                  onClick={() => {
                    sound.playSfx('success');
                    setStage('graph_building');
                  }}
                  className="game-btn-success px-5 py-2.5 rounded-2xl text-white font-black text-sm animate-bounce shadow"
                >
                  الانتقال لبناء المدرج 📊
                </button>
              )}
            </div>

            {/* Trees & Fruits Field */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {FRUIT_TYPES.map((fruit) => {
                const count = collectedCounts[fruit.type];
                const isComplete = count >= fruit.targetCount;

                return (
                  <div
                    key={fruit.id}
                    onClick={() => handleCollectFruit(fruit.type)}
                    className={`relative rounded-2xl p-4 border-3 transition-all cursor-pointer select-none flex flex-col items-center justify-between min-h-[200px] ${
                      isComplete
                        ? 'bg-emerald-50 border-emerald-400'
                        : 'bg-amber-50/70 hover:bg-amber-100 border-amber-200 hover:scale-102 shadow'
                    }`}
                  >
                    {/* Tree Crown Graphic */}
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl mb-2 animate-float">
                      {fruit.icon}
                    </div>

                    <div className="text-center">
                      <div className="font-black text-slate-800 text-base">
                        {fruit.nameAr}
                      </div>
                      <div className="text-xs font-bold text-slate-500">
                        المطلوب: {fruit.targetCount}
                      </div>
                    </div>

                    {/* Basket Counter Pill */}
                    <div
                      className={`w-full py-1.5 px-2 rounded-xl text-center font-black text-sm mt-3 flex items-center justify-center gap-1.5 ${
                        isComplete
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-amber-400 text-amber-950'
                      }`}
                    >
                      {isComplete ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>اكتمل! ({count})</span>
                        </>
                      ) : (
                        <span>
                          السلة: {count} / {fruit.targetCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage 2: Graph Building */}
        {stage === 'graph_building' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-right">
              <div>
                <h3 className="text-xl font-black text-emerald-900">
                  شيد المدرج البياني بالأعمدة!
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-500">
                  ارفع أو اخفض كل عمود ليطابق عدد الفاكهة المجمعة
                </p>
              </div>

              <button
                onClick={handleVerifyGraph}
                className="game-btn-primary px-6 py-2.5 rounded-2xl text-white font-black text-sm shadow"
              >
                تحقق من المدرج ✨
              </button>
            </div>

            {/* Interactive Bar Graph Arena */}
            <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-4 sm:p-6 flex items-end gap-2 sm:gap-4 relative min-h-[300px]">
              {/* Y-Axis scale guidelines */}
              <div className="flex flex-col justify-between h-[220px] text-xs font-black text-slate-400 pb-8 pl-2">
                {[8, 7, 6, 5, 4, 3, 2, 1, 0].map((num) => (
                  <span key={num}>{num}</span>
                ))}
              </div>

              {/* The 4 Fruit Columns */}
              <div className="flex-1 grid grid-cols-4 gap-2 sm:gap-6 h-[220px] items-end border-b-3 border-r-3 border-slate-300 pr-2 pb-1">
                {FRUIT_TYPES.map((fruit) => {
                  const height = graphHeights[fruit.type] || 0;
                  const target = fruit.targetCount;
                  const isMatch = height === target;

                  return (
                    <div key={fruit.id} className="flex flex-col items-center h-full justify-end">
                      {/* Top controls: + / - buttons */}
                      <div className="flex items-center gap-1 mb-1.5">
                        <button
                          onClick={() => handleAdjustGraph(fruit.type, -1)}
                          disabled={height <= 0}
                          className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-30 font-black text-xs flex items-center justify-center text-slate-700"
                        >
                          -
                        </button>
                        <span className="font-black text-xs sm:text-sm text-slate-800 w-4 text-center">
                          {height}
                        </span>
                        <button
                          onClick={() => handleAdjustGraph(fruit.type, 1)}
                          disabled={height >= 8}
                          className="w-6 h-6 rounded-full bg-amber-400 hover:bg-amber-500 disabled:opacity-30 font-black text-xs flex items-center justify-center text-amber-950 shadow-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Bar blocks */}
                      <div className="w-full max-w-[50px] bg-slate-200/60 rounded-t-xl overflow-hidden flex flex-col justify-end h-[160px] border border-slate-300">
                        <div
                          className={`w-full transition-all duration-300 rounded-t-lg flex items-center justify-center text-white text-xs font-black ${
                            fruit.color
                          } ${isMatch ? 'ring-2 ring-emerald-400 ring-offset-1' : ''}`}
                          style={{ height: `${(height / 8) * 100}%` }}
                        >
                          {height > 0 && <span>{height}</span>}
                        </div>
                      </div>

                      {/* Label under column */}
                      <div className="mt-2 text-center">
                        <div className="text-xl sm:text-2xl">{fruit.icon}</div>
                        <div className="text-xs font-black text-slate-700">
                          {fruit.nameAr}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: Puzzle Questions */}
        {stage === 'puzzle' && (
          <div className="space-y-6">
            <div className="text-right">
              <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                لغز المقارنة ({puzzleStep + 1} من {puzzles.length})
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-2">
                {puzzles[puzzleStep].question}
              </h3>
            </div>

            {/* Answer Choices Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {puzzles[puzzleStep].options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt.val;
                return (
                  <button
                    key={idx}
                    onClick={(e) => handleSelectPuzzleOption(opt, e)}
                    className={`py-3.5 px-4 rounded-2xl font-black text-base border-3 transition-all text-right flex items-center justify-between ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md'
                          : 'bg-rose-50 border-rose-400 text-rose-900 shadow-md'
                        : 'bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span>{opt.isCorrect ? '✅ رائع!' : '❌ حاول مرة ثانية'}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage 4: Boss Battle */}
        {stage === 'boss' && (
          <div className="space-y-6">
            {/* Boss Header / Health Bar */}
            <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-2xl p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center text-4xl animate-bounce">
                  🪶
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-200">حارس الغابة الحكيم</div>
                  <div className="text-lg font-black text-white">عم هدهد 👑</div>
                </div>
              </div>

              {/* Boss Health Crystal Hearts */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((heart) => (
                  <div
                    key={heart}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-transform ${
                      heart <= bossHp
                        ? 'bg-emerald-500 text-white scale-110 shadow-lg animate-pulse'
                        : 'bg-slate-700 text-slate-500 opacity-40'
                    }`}
                  >
                    💚
                  </div>
                ))}
              </div>
            </div>

            {/* Boss Question Stage */}
            <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-5 text-right space-y-4">
              <div className="text-base sm:text-lg font-black text-slate-800">
                {bossQuestions[bossStep]?.q}
              </div>

              {bossFeedback && (
                <div className="text-sm font-black text-emerald-700 bg-emerald-100 p-2 rounded-xl">
                  {bossFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bossQuestions[bossStep]?.choices.map((ch, i) => (
                  <button
                    key={i}
                    onClick={(e) => handleAnswerBoss(ch, e)}
                    className="game-btn-blue py-3 px-4 rounded-xl text-white font-black text-sm shadow hover:scale-102 transition-transform"
                  >
                    {ch.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage 5: Victory Screen */}
        {stage === 'victory' && (
          <div className="relative flex flex-col items-center text-center py-6 space-y-4 overflow-hidden rounded-2xl">
            {/* Ambient Magical Crystal Floating Particles */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <CrystalAuraCanvas colorTheme="emerald" />
            </div>

            <div
              onClick={(e) => particles.crystalCollect(e.currentTarget, 'forest')}
              className="relative z-10 cursor-pointer group transform hover:scale-110 active:scale-95 transition-all p-4 rounded-3xl hover:bg-emerald-50/50"
              title="انقر على البلورة لإطلاق طاقتها السحرية!"
            >
              <div className="text-8xl animate-bounce filter drop-shadow-2xl">💎</div>
              <div className="absolute top-2 right-2 text-4xl animate-spin">✨</div>
              <div className="mt-2 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md animate-pulse">
                انقر البلورة للمفاجأة! ✨
              </div>
            </div>

            <h2 className="relative z-10 text-3xl font-black text-emerald-800">
              استعدت بلورة البيانات الخضراء!
            </h2>
            <p className="relative z-10 text-slate-600 font-bold max-w-md">
              عادت الطاقة السحرية إلى غابة البيانات! زهور النيل تتفتح وأشجار الفواكه تشكرك على براعتك في الرياضيات!
            </p>

            {/* Rewards Summary Box */}
            <div className="relative z-10 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center gap-6 max-w-sm w-full justify-center shadow-md">
              <div className="text-center">
                <div className="text-2xl font-black text-amber-600">+150</div>
                <div className="text-xs font-bold text-slate-500">نقطة خبرة XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-yellow-500">⭐ +3</div>
                <div className="text-xs font-bold text-slate-500">نجوم سحرية</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-amber-700">🪙 +60</div>
                <div className="text-xs font-bold text-slate-500">عملة ذهبية</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  sound.playSfx('sparkle');
                  setShowCertificate(true);
                }}
                className="game-btn-blue px-6 py-3 rounded-2xl text-white font-black text-sm shadow flex items-center justify-center gap-1.5"
              >
                <Award className="w-5 h-5 text-yellow-300" />
                <span>معاينة وطباعة وسام البيانات 📜✨</span>
              </button>

              <button
                onClick={(e) => handleClaimRewardAndExit(e)}
                className="game-btn-primary px-8 py-3 rounded-2xl text-white font-black text-base shadow-xl"
              >
                استلام الجوائز والعودة للخريطة 🚀
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Royal Certificate Modal on Forest Victory */}
      {showCertificate && forestCert && (
        <CertificateModal
          certificate={forestCert}
          profile={profile}
          onClose={() => setShowCertificate(false)}
          onUpdateName={(newName) => {
            const updated = { ...profile, name: newName };
            onUpdateProfile(updated);
          }}
        />
      )}

      {/* Companion Miro Box at the bottom */}
      <MiroCompanion
        mood={miroMood}
        message={miroMessage}
        hintLadder={hintsList}
        currentHintIndex={currentHintIndex}
        onAdvanceHint={handleAdvanceHint}
      />
    </div>
  );
};
