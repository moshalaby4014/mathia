import React, { useState } from 'react';
import { sound } from '../../../services/audio';
import { Sparkles, RotateCcw, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

interface Props {
  initialCount1: number; // e.g. 8
  initialCount2: number; // e.g. 5
  mode?: 'make_ten' | 'doubles' | 'free';
  token1Emoji?: string;
  token2Emoji?: string;
  onSuccess?: () => void;
}

export const TenFrameEngine: React.FC<Props> = ({
  initialCount1,
  initialCount2,
  mode = 'make_ten',
  token1Emoji = '🍎',
  token2Emoji = '🍏',
  onSuccess,
}) => {
  const [count1, setCount1] = useState(initialCount1);
  const [count2, setCount2] = useState(initialCount2);
  const [transferredCount, setTransferredCount] = useState(0);

  const neededToMakeTen = Math.max(0, 10 - initialCount1);
  const isTenMade = count1 === 10;
  const total = count1 + count2;

  const handleTransferOneToTen = () => {
    if (count2 <= 0 || count1 >= 10) return;
    setCount1((prev) => prev + 1);
    setCount2((prev) => prev - 1);
    setTransferredCount((prev) => prev + 1);
    sound.playSfx('click');

    if (count1 + 1 === 10) {
      sound.playSfx('success');
      onSuccess?.();
    }
  };

  const handleReset = () => {
    setCount1(initialCount1);
    setCount2(initialCount2);
    setTransferredCount(0);
    sound.playSfx('click');
  };

  const renderFrame = (
    count: number,
    colorClass: string,
    borderColor: string,
    emoji: string,
    label: string,
    isFullTen: boolean
  ) => {
    const cells = Array.from({ length: 10 }, (_, i) => i < count);

    return (
      <div className={`flex flex-col items-center bg-white rounded-3xl p-3.5 sm:p-4 border-3 ${borderColor} shadow-md transition-all ${isFullTen ? 'ring-4 ring-emerald-400/70 bg-emerald-50/50' : ''}`}>
        <div className="flex items-center justify-between w-full mb-2.5 px-1">
          <span className="text-xs font-black text-slate-700">{label}</span>
          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${isFullTen ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
            {count} / 10
          </span>
        </div>

        {/* 2 rows of 5 columns */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {cells.map((filled, idx) => (
            <div
              key={idx}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl transition-all duration-200 ${
                filled
                  ? `${colorClass} shadow-inner scale-95`
                  : 'border-dashed border-slate-300 bg-slate-50'
              }`}
            >
              {filled ? emoji : null}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-orange-50/60 border-3 border-orange-200 rounded-3xl p-4 sm:p-6 shadow-md flex flex-col items-center select-none">
      {/* Header & Concept */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧺</span>
            <span className="text-sm font-black text-amber-950">
              {mode === 'make_ten'
                ? 'استراتيجية تكوين العشرة في إطار العشرة'
                : 'استراتيجية المضاعفة'}
            </span>
          </div>
          <div className="text-xs font-bold text-amber-800 mt-0.5">
            {mode === 'make_ten'
              ? `انقل ${neededToMakeTen} من السلة الثانية لتملأ إطار العشرة الأول!`
              : 'قارن بين المجموعتين ولاحظ التماثل والمضاعفة.'}
          </div>
        </div>

        {/* Live Mathematical Model Badge */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border-2 border-amber-300 shadow-sm font-black text-sm sm:text-base text-slate-800">
          <span className="text-rose-600">{initialCount1}</span>
          <span>+</span>
          <span className="text-emerald-600">{initialCount2}</span>
          <span>=</span>
          {isTenMade ? (
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xl animate-pulse">
              <span>(10 + {count2}) = {total}</span>
            </span>
          ) : (
            <span className="text-amber-800 px-2">{total}</span>
          )}
        </div>
      </div>

      {/* Visual Frames Container */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 my-2 w-full">
        {/* Frame 1 */}
        {renderFrame(
          count1,
          'bg-rose-100 border-rose-400 text-rose-700',
          isTenMade ? 'border-emerald-500' : 'border-rose-300',
          token1Emoji,
          'الإطار الأول (الهدف: 10 كاملة)',
          isTenMade
        )}

        {/* Transfer Action Arrow Button */}
        {mode === 'make_ten' && (
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={handleTransferOneToTen}
              disabled={isTenMade || count2 === 0}
              className={`p-3 sm:p-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-90 ${
                isTenMade
                  ? 'bg-emerald-500 text-white cursor-default'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-600 animate-pulse'
              }`}
            >
              <ArrowLeftRight className="w-5 h-5" />
              <span className="text-xs sm:text-sm">
                {isTenMade ? 'اكتملت 10! ✨' : 'انقل تفاحة لملء العشرة'}
              </span>
            </button>
            <span className="text-[11px] font-extrabold text-amber-900">
              {isTenMade ? 'تم تكوين 10 كاملة' : `باقي ${10 - count1} تفاحات`}
            </span>
          </div>
        )}

        {/* Frame 2 */}
        {renderFrame(
          count2,
          'bg-emerald-100 border-emerald-400 text-emerald-700',
          'border-emerald-300',
          token2Emoji,
          'الإطار الثاني (المتبقي)',
          false
        )}
      </div>

      {/* Step-by-Step Discovery Feedback */}
      {isTenMade ? (
        <div className="mt-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl p-3 px-5 text-emerald-950 font-bold text-xs sm:text-sm text-center animate-bounce">
          🎉 عبقري! نقلنا {transferredCount} عناصر فصارت المسألة: <span className="font-black text-emerald-800">10 + {count2} = {total}</span>!
          الجمع مع العدد 10 سهل وسريع جداً ذهنياً!
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-600">
          <span>💡 فكرة ميرو: "أسهل طريقة للجمع الذهني هي أن نصنع 10 أولاً!"</span>
        </div>
      )}

      {/* Reset */}
      <div className="mt-3">
        <button
          onClick={handleReset}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 py-1 px-3 rounded-lg hover:bg-slate-200/60"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة المحاولة من البداية</span>
        </button>
      </div>
    </div>
  );
};
