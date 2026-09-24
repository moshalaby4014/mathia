import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, FastForward, Play, ShieldAlert } from 'lucide-react';
import { sound } from '../services/audio';

interface Props {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<Props> = ({ onComplete }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'مملكة الأرقام الساحرة',
      description: 'منذ قديم الزمان، كانت مملكة الأرقام تعيش في أمان وسعادة على ضفاف نهر النيل العظيم، بفضل قوة بلورات الحساب السحرية! ✨',
      visual: 'kingdom',
      btnText: 'ماذا حدث بعد ذلك؟',
    },
    {
      title: 'انكسار البلورة الكبرى!',
      description: 'وفجأة.. تفرقت بلورات الحساب السحرية في أرجاء المملكة! أغلقت الغابة أبوابها، وتوقفت الساعات، واختفت الأرقام!',
      visual: 'shatter',
      btnText: 'يا للغرابة! ماذا سنفعل؟',
    },
    {
      title: 'لقاء الصديق ميرو',
      description: 'أنا ميرو، حارس المملكة الصغير! مملكة الأرقام محتاجة مساعدتك وذكاءك لجمع البلورات وإعادة النور!',
      visual: 'miro_appear',
      btnText: 'أنا مستعد تماماً!',
    },
    {
      title: 'أنت بطل المملكة القادم!',
      description: 'ستبدأ رحلتك في "غابة البيانات"، تجمع الفواكه، وتبني المدرج البياني، وتهزم الحارس الحكيم!',
      visual: 'hero_call',
      btnText: 'هيا نبدأ المغامرة! 🚀',
    },
  ];

  useEffect(() => {
    sound.initOnUserGesture();
    if (slide === 1) {
      sound.playSfx('bossHit');
    } else if (slide === 3) {
      sound.playSfx('fanfare');
    } else {
      sound.playSfx('sparkle');
    }
  }, [slide]);

  const handleNext = () => {
    sound.playSfx('click');
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      sound.playSfx('levelUp');
      onComplete();
    }
  };

  const current = slides[slide];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-950 flex flex-col justify-between p-4 sm:p-8 text-white select-none overflow-hidden">
      {/* Top bar with Skip button */}
      <div className="flex items-center justify-between z-20 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 bg-purple-900/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-purple-500/40">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          <span className="text-sm font-bold text-amber-200">بداية الأسطورة</span>
        </div>

        <button
          onClick={() => {
            sound.playSfx('click');
            onComplete();
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-full text-xs sm:text-sm font-bold border border-white/20 transition-all"
        >
          <span>تخطي المشهد</span>
          <FastForward className="w-4 h-4" />
        </button>
      </div>

      {/* Main Cinematic Visual Stage */}
      <div className="flex-1 flex flex-col items-center justify-center my-4 z-20 max-w-2xl mx-auto w-full text-center">
        {/* Animated Visual Card */}
        <div className="relative w-full max-w-md aspect-video sm:aspect-square max-h-[300px] flex items-center justify-center mb-6">
          {/* Slide 0: Kingdom */}
          {slide === 0 && (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/30 to-amber-400/20 rounded-3xl blur-2xl animate-pulse" />
              <div className="text-8xl sm:text-9xl animate-float">🏰</div>
              <div className="absolute -bottom-2 text-6xl animate-pulse">🌴 🌊 🌴</div>
              <div className="absolute -top-3 text-4xl animate-bounce">✨ 💎 ✨</div>
            </div>
          )}

          {/* Slide 1: Crystal Breaking */}
          {slide === 1 && (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-red-600/20 rounded-3xl blur-2xl animate-pulse" />
              <div className="text-8xl sm:text-9xl transform rotate-12 scale-110 transition-transform">
                🔮
              </div>
              <div className="absolute top-2 right-10 text-4xl animate-ping">⚡</div>
              <div className="absolute bottom-6 left-12 text-4xl animate-bounce">💥</div>
              <div className="absolute text-2xl font-black bg-rose-600 text-white px-4 py-1.5 rounded-full -rotate-6 shadow-lg">
                انشطرت البلورة!
              </div>
            </div>
          )}

          {/* Slide 2: Miro Appears */}
          {slide === 2 && (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-2xl" />
              <div className="w-44 h-44 animate-bounce">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  {/* Fennec big ears */}
                  <path d="M 30 45 C 8 15, 10 -5, 24 12 C 32 22, 36 34, 36 45 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                  <path d="M 70 45 C 92 15, 90 -5, 76 12 C 68 22, 64 34, 64 45 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                  <ellipse cx="50" cy="74" rx="22" ry="18" fill="#f59e0b" />
                  <circle cx="50" cy="46" r="23" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                  <ellipse cx="40" cy="50" rx="9" ry="7" fill="#fffbeb" />
                  <ellipse cx="60" cy="50" rx="9" ry="7" fill="#fffbeb" />
                  {/* Big shining eyes */}
                  <ellipse cx="42" cy="45" rx="5" ry="6" fill="#1e293b" />
                  <circle cx="44" cy="43" r="2" fill="#ffffff" />
                  <ellipse cx="58" cy="45" rx="5" ry="6" fill="#1e293b" />
                  <circle cx="60" cy="43" r="2" fill="#ffffff" />
                  <polygon points="50,52 46,49 54,49" fill="#1e293b" />
                  <path d="M 46 54 Q 50 58 54 54" stroke="#451a03" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="absolute -top-3 right-6 bg-amber-400 text-amber-950 font-black px-3.5 py-1 rounded-full text-sm animate-pulse">
                أهلاً يا بطل! 👋
              </div>
            </div>
          )}

          {/* Slide 3: Hero Call */}
          {slide === 3 && (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/25 rounded-3xl blur-2xl animate-pulse" />
              <div className="text-8xl sm:text-9xl animate-pulse">🌟</div>
              <div className="absolute text-6xl animate-bounce">🧭 👑 💎</div>
            </div>
          )}
        </div>

        {/* Narrative Box */}
        <div className="bg-slate-900/85 backdrop-blur-md border-2 border-purple-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl w-full">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 mb-3">
            {current.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-bold">
            {current.description}
          </p>

          {/* Step Indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === slide ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Action Button */}
      <div className="z-20 max-w-md mx-auto w-full pb-4">
        <button
          onClick={handleNext}
          className="w-full py-4 px-8 game-btn-primary rounded-2xl text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-3 shadow-2xl transition-all"
        >
          <span>{current.btnText}</span>
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
