import React, { useState } from 'react';
import { WorldRegion, PlayerProfile } from '../../types/game';
import { MiroCompanion } from '../MiroCompanion';
import { sound } from '../../services/audio';
import { storage } from '../../services/storage';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles, CheckCircle2, Star, Trophy } from 'lucide-react';

interface Props {
  world: WorldRegion;
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
  onReturnToMap: () => void;
}

interface QuestionItem {
  prompt: string;
  visual?: string;
  choices: { text: string; correct: boolean; feedback: string }[];
}

export const MathQuestRunner: React.FC<Props> = ({
  world,
  profile,
  onUpdateProfile,
  onReturnToMap,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Generate customized questions based on world
  const getQuestions = (): QuestionItem[] => {
    switch (world.id) {
      case 'addition':
        return [
          {
            prompt: 'يحتاج الجسر الذهبي إلى 28 حجراً أصفر و 15 حجراً أزرق. كم حجراً نحتاج لإتمام الجسر؟',
            visual: '🧱 28 + 15 = ?',
            choices: [
              { text: '43 حجراً', correct: true, feedback: 'ممتاز! 8 + 5 = 13 (3 ونعيد تسمية 1 للعشرات)، ثم 1 + 2 + 1 = 4 عشرات!' },
              { text: '33 حجراً', correct: false, feedback: 'تذكر إعادة تسمية العشرة الزائدة من جمع الآحاد!' },
              { text: '45 حجراً', correct: false, feedback: 'قريب جداً! اجمع الآحاد بعناية: 8 + 5 = 13' },
            ],
          },
          {
            prompt: 'أحضر النجار 36 مسماراً في الصباح و 27 مسماراً في المساء. ما المجموع الكلي؟',
            visual: '🔨 36 + 27 = ?',
            choices: [
              { text: '53 مسماراً', correct: false, feedback: 'تحقق من خانة الآحاد: 6 + 7 = 13' },
              { text: '63 مسماراً', correct: true, feedback: 'إجابة عبقرية! 36 + 27 = 63 مسماراً متيناً!' },
              { text: '60 مسماراً', correct: false, feedback: 'لا تنس الـ 3 المتبقية في الآحاد!' },
            ],
          },
        ];

      case 'time':
        return [
          {
            prompt: 'تشير الساعة إلى استيقاظ بطل النيل في الصباح: العقرب الصغير عند 7 والكبير عند 12. كم الساعة الآن؟',
            visual: '⏰ 07:00',
            choices: [
              { text: 'السابعة تماماً ☀️', correct: true, feedback: 'صحيح! العقرب الصغير للساعات والكبير عند 12 يعني تماماً!' },
              { text: 'الثانية عشرة تماماً', correct: false, feedback: 'العقرب الصغير هو الذي يحدد رقم الساعة.' },
              { text: 'السابعة والنصف', correct: false, feedback: 'النصف يكون عندما يشير العقرب الكبير إلى 6.' },
            ],
          },
          {
            prompt: 'ذهب البطل لرحلة القارب في النيل، والعقرب الصغير بين 4 و 5، والعقرب الكبير عند 6. ما الوقت؟',
            visual: '⛵ 04:30',
            choices: [
              { text: 'الرابعة والنصف', correct: true, feedback: 'بطل! عند الرقم 6 تمر 30 دقيقة، أي نصف ساعة!' },
              { text: 'الخامسة تماماً', correct: false, feedback: 'الساعة لم تصل للخامسة بعد.' },
              { text: 'السادسة والربع', correct: false, feedback: 'تذكر أن 6 تعني 30 دقيقة.' },
            ],
          },
        ];

      case 'measurement':
        return [
          {
            prompt: 'استخدمنا المسطرة لقياس قلم البردي، بدأت المسطرة من الرقم 0 وانتهى القلم عند الرقم 14 سم. ما طول القلم؟',
            visual: '📏 [0 --------- 14 سم]',
            choices: [
              { text: '14 سنتيمتراً ✍️', correct: true, feedback: 'رائع! القياس يبدأ من الصفر، وطرفه عند 14 سم.' },
              { text: '10 سنتيمترات', correct: false, feedback: 'انظر للرقم الذي يقف عنده طرف القلم بالضبط.' },
              { text: '15 سنتيمتراً', correct: false, feedback: 'الرقم المشار إليه هو 14 سم.' },
            ],
          },
        ];

      default:
        return [
          {
            prompt: `تحدي المعرفة السحري في ${world.nameAr}: ما ناتج 40 + 50؟`,
            visual: '✨ 40 + 50 = ?',
            choices: [
              { text: '90', correct: true, feedback: 'أحسنت! 4 عشرات + 5 عشرات = 9 عشرات (90)!' },
              { text: '80', correct: false, feedback: 'اجمع العشرات: 4 + 5 = 9' },
              { text: '100', correct: false, feedback: 'قريب جداً!' },
            ],
          },
        ];
    }
  };

  const questions = getQuestions();
  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectChoice = (choiceIdx: number) => {
    const choice = currentQ.choices[choiceIdx];
    setSelectedAnswer(choiceIdx);

    if (choice.correct) {
      sound.playSfx('success');
      setFeedback(choice.feedback);

      setTimeout(() => {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(currentIdx + 1);
          setSelectedAnswer(null);
          setFeedback(null);
        } else {
          setIsDone(true);
          sound.playSfx('fanfare');
          try {
            confetti({ particleCount: 80, spread: 60 });
          } catch {}
        }
      }, 1500);
    } else {
      sound.playSfx('error');
      setFeedback(choice.feedback);
    }
  };

  const handleCompleteQuest = () => {
    sound.playSfx('crystal');
    const crystalKey = world.id as keyof typeof profile.crystals;
    const updated: PlayerProfile = {
      ...profile,
      xp: profile.xp + 100,
      stars: profile.stars + 2,
      coins: profile.coins + 40,
      crystals: {
        ...profile.crystals,
        [crystalKey]: true,
      },
    };
    storage.saveProfile(updated);
    onUpdateProfile(updated);
    onReturnToMap();
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-130px)] pb-24 p-3 sm:p-6 flex flex-col items-center select-none">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.playSfx('click');
            onReturnToMap();
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-300 rounded-full text-slate-700 text-xs sm:text-sm font-bold shadow-sm"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الخريطة</span>
        </button>

        <span className="text-xs sm:text-sm font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
          {world.nameAr} 🌟
        </span>
      </div>

      {/* Main Challenge Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 text-right space-y-5">
        {!isDone ? (
          <>
            <div>
              <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                السؤال ({currentIdx + 1} من {questions.length})
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 mt-2 leading-relaxed">
                {currentQ.prompt}
              </h2>
            </div>

            {/* Visual Box */}
            {currentQ.visual && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center text-2xl sm:text-3xl font-black text-amber-950 shadow-inner">
                {currentQ.visual}
              </div>
            )}

            {/* Feedback alert */}
            {feedback && (
              <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs sm:text-sm font-bold text-amber-950">
                {feedback}
              </div>
            )}

            {/* Choices */}
            <div className="space-y-2.5">
              {currentQ.choices.map((choice, i) => {
                const isSelected = selectedAnswer === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectChoice(i)}
                    className={`w-full py-3.5 px-4 rounded-xl font-black text-sm sm:text-base border-2 text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? choice.correct
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow'
                          : 'bg-rose-50 border-rose-400 text-rose-900 shadow'
                        : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{choice.text}</span>
                    {isSelected && (
                      <span>{choice.correct ? '✅ أحسنت!' : '❌ حاول مجدداً'}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="text-7xl animate-bounce">🏆</div>
            <h2 className="text-2xl font-black text-emerald-800">
              أتممت تحدي {world.nameAr}!
            </h2>
            <p className="text-slate-600 font-bold text-sm">
              أعدت جزءاً من نور المملكة وحصلت على مكافآت جديدة!
            </p>

            <button
              onClick={handleCompleteQuest}
              className="game-btn-primary px-8 py-3 rounded-2xl text-white font-black text-base shadow"
            >
              استلام الجوائز والعودة 🚀
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 w-full max-w-2xl">
        <MiroCompanion
          mood={isDone ? 'celebrate' : 'guiding'}
          message={
            isDone
              ? 'يا لك من بطل ذكي! أضأت هذا العالم بنجاح!'
              : 'اقرأ المسألة بعناية وتذكر خطوات الحساب الذكية!'
          }
        />
      </div>
    </div>
  );
};
