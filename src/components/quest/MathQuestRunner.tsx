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
  clockHours?: number;
  clockMinutes?: number;
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
            clockHours: 7,
            clockMinutes: 0,
            choices: [
              { text: 'السابعة تماماً ☀️', correct: true, feedback: 'صحيح! العقرب الصغير للساعات والكبير عند 12 يعني تماماً!' },
              { text: 'الثانية عشرة تماماً', correct: false, feedback: 'العقرب الصغير هو الذي يحدد رقم الساعة.' },
              { text: 'السابعة والنصف', correct: false, feedback: 'النصف يكون عندما يشير العقرب الكبير إلى 6.' },
            ],
          },
          {
            prompt: 'ذهب البطل لرحلة القارب في النيل، والعقرب الصغير بين 4 و 5، والعقرب الكبير عند 6. ما الوقت؟',
            visual: '⛵ 04:30',
            clockHours: 4,
            clockMinutes: 30,
            choices: [
              { text: 'الرابعة والنصف', correct: true, feedback: 'بطل! عند الرقم 6 تمر 30 دقيقة، أي نصف ساعة!' },
              { text: 'الخامسة تماماً', correct: false, feedback: 'الساعة لم تصل للخامسة بعد.' },
              { text: 'السادسة والربع', correct: false, feedback: 'تذكر أن 6 تعني 30 دقيقة.' },
            ],
          },
          {
            prompt: 'حان موعد الغداء، يشير العقرب الصغير إلى 12 والعقرب الكبير إلى 3. كم الساعة الآن؟',
            visual: '🍽️ 12:15',
            clockHours: 12,
            clockMinutes: 15,
            choices: [
              { text: 'الثانية عشرة والربع 🥪', correct: true, feedback: 'ممتاز وعبقري! الرقم 3 يعني مرور 15 دقيقة (ربع ساعة)!' },
              { text: 'الثانية عشرة والنصف', correct: false, feedback: 'النصف يكون عند الرقم 6 (30 دقيقة).' },
              { text: 'الثالثة تماماً', correct: false, feedback: 'العقرب الصغير عند 12 هو الذي يحدد الساعة.' },
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

            {/* Clock Visual Representation when available */}
            {currentQ.clockHours !== undefined && currentQ.clockMinutes !== undefined && (
              <div className="flex flex-col items-center justify-center p-3 bg-gradient-to-b from-sky-50 to-blue-50 border-2 border-sky-200 rounded-2xl shadow-inner">
                <svg width="180" height="180" viewBox="0 0 200 200" className="drop-shadow-md">
                  {/* Outer Rim */}
                  <circle cx="100" cy="100" r="92" fill="#ffffff" stroke="#0284c7" strokeWidth="8" />
                  <circle cx="100" cy="100" r="82" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

                  {/* 12 Hour Numbers */}
                  {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
                    const angle = (num * 30 * Math.PI) / 180;
                    const nx = 100 + 64 * Math.sin(angle);
                    const ny = 100 - 64 * Math.cos(angle);
                    return (
                      <text
                        key={num}
                        x={nx}
                        y={ny + 5}
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="900"
                        fill="#1e293b"
                      >
                        {num}
                      </text>
                    );
                  })}

                  {/* Hour Hand (Blue, Thick, Shorter) */}
                  {(() => {
                    const hAngle = (((currentQ.clockHours % 12) + currentQ.clockMinutes / 60) * 30 * Math.PI) / 180;
                    const hx = 100 + 44 * Math.sin(hAngle);
                    const hy = 100 - 44 * Math.cos(hAngle);
                    return (
                      <line
                        x1="100"
                        y1="100"
                        x2={hx}
                        y2={hy}
                        stroke="#0284c7"
                        strokeWidth="7"
                        strokeLinecap="round"
                      />
                    );
                  })()}

                  {/* Minute Hand (Rose, Long) */}
                  {(() => {
                    const mAngle = ((currentQ.clockMinutes / 60) * 360 * Math.PI) / 180;
                    const mx = 100 + 66 * Math.sin(mAngle);
                    const my = 100 - 66 * Math.cos(mAngle);
                    return (
                      <line
                        x1="100"
                        y1="100"
                        x2={mx}
                        y2={my}
                        stroke="#e11d48"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                    );
                  })()}

                  {/* Center Pin */}
                  <circle cx="100" cy="100" r="6" fill="#0f172a" />
                  <circle cx="100" cy="100" r="3" fill="#38bdf8" />
                </svg>

                <div className="mt-2 flex items-center gap-3 text-xs font-black">
                  <span className="flex items-center gap-1 text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"></span>
                    <span>عقرب الساعات (القصير)</span>
                  </span>
                  <span className="flex items-center gap-1 text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
                    <span>عقرب الدقائق (الطويل)</span>
                  </span>
                </div>
              </div>
            )}

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
