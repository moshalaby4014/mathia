import React, { useState } from 'react';
import { sound } from '../../../services/audio';
import { Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  initialNumber?: number; // e.g. 37
  targetNumber?: number; // e.g. 47
  onSuccess?: () => void;
}

export const Chart120Engine: React.FC<Props> = ({
  initialNumber = 37,
  targetNumber = 47,
  onSuccess,
}) => {
  const [selectedNumber, setSelectedNumber] = useState<number>(initialNumber);
  const [highlightMode, setHighlightMode] = useState<'none' | 'tens' | 'fives'>('none');

  const handleMove = (delta: number) => {
    const next = selectedNumber + delta;
    if (next < 1 || next > 120) return;
    setSelectedNumber(next);
    sound.playSfx('click');

    if (targetNumber && next === targetNumber) {
      sound.playSfx('success');
      onSuccess?.();
    }
  };

  const handleSelectNumber = (num: number) => {
    setSelectedNumber(num);
    sound.playSfx('click');
    if (targetNumber && num === targetNumber) {
      sound.playSfx('success');
      onSuccess?.();
    }
  };

  const numbers = Array.from({ length: 120 }, (_, i) => i + 1);

  return (
    <div className="w-full bg-slate-50 border-3 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col items-center select-none text-right">
      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b-2 border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔢</span>
            <span className="text-base font-black text-slate-800">
              مختبر لوحة الـ 120 (اكتشاف الأنماط والحساب الذهني)
            </span>
          </div>
          <p className="text-xs font-bold text-slate-600 mt-0.5">
            العدد الحالي المختار: <span className="font-black text-amber-950 px-2 py-0.5 bg-amber-200 rounded-lg text-sm">{selectedNumber}</span>
          </p>
        </div>

        {/* Live Neighbor Controller Pad */}
        <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl border-2 border-slate-300 shadow-sm">
          {/* -10 (Move Up) */}
          <button
            onClick={() => handleMove(-10)}
            disabled={selectedNumber <= 10}
            className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-xs flex items-center gap-1 disabled:opacity-30"
            title="طرح 10 (صعود صف لأعلى)"
          >
            <ArrowUp className="w-4 h-4" />
            <span>−10</span>
          </button>

          {/* +10 (Move Down) */}
          <button
            onClick={() => handleMove(10)}
            disabled={selectedNumber > 110}
            className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-xs flex items-center gap-1 disabled:opacity-30"
            title="إضافة 10 (نزول صف لأسفل)"
          >
            <ArrowDown className="w-4 h-4" />
            <span>+10</span>
          </button>

          {/* -1 */}
          <button
            onClick={() => handleMove(-1)}
            disabled={selectedNumber <= 1}
            className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1 disabled:opacity-30"
            title="طرح 1 (خطوة للخلف)"
          >
            <ArrowRight className="w-4 h-4" />
            <span>−1</span>
          </button>

          {/* +1 */}
          <button
            onClick={() => handleMove(1)}
            disabled={selectedNumber >= 120}
            className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1 disabled:opacity-30"
            title="إضافة 1 (خطوة للأمام)"
          >
            <span>+1</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 120 Grid Container */}
      <div className="w-full overflow-x-auto max-h-[380px] p-2 bg-white rounded-2xl border-2 border-slate-200 shadow-inner">
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 min-w-[500px]">
          {numbers.map((num) => {
            const isSelected = num === selectedNumber;
            const isTarget = num === targetNumber;
            const isTens = num % 10 === 0;
            const isFives = num % 5 === 0;

            let bgClass = 'bg-slate-50 text-slate-700 hover:bg-amber-50';
            if (highlightMode === 'tens' && isTens) bgClass = 'bg-sky-100 text-sky-950 font-black border-sky-400';
            if (highlightMode === 'fives' && isFives) bgClass = 'bg-emerald-100 text-emerald-950 font-black border-emerald-400';
            if (isSelected) bgClass = 'bg-amber-500 text-white font-black scale-105 shadow-md z-10';
            else if (isTarget) bgClass = 'bg-emerald-400 text-emerald-950 font-black ring-2 ring-emerald-600 animate-pulse';

            return (
              <button
                key={num}
                onClick={() => handleSelectNumber(num)}
                className={`h-8 sm:h-9 rounded-lg border text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${bgClass}`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern filters */}
      <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-700">إضاءة الأنماط:</span>
          <button
            onClick={() => setHighlightMode(highlightMode === 'tens' ? 'none' : 'tens')}
            className={`px-3 py-1 rounded-xl text-xs font-bold border ${
              highlightMode === 'tens' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            مضاعفات 10 (العشرات الكاملة)
          </button>
          <button
            onClick={() => setHighlightMode(highlightMode === 'fives' ? 'none' : 'fives')}
            className={`px-3 py-1 rounded-xl text-xs font-bold border ${
              highlightMode === 'fives' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            مضاعفات 5
          </button>
        </div>

        <div className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-xl">
          💡 لاحظ: التحرك رأسياً يغير خانة العشرات فقط (+10 / −10)، وخانة الآحاد تبقى ثابتة!
        </div>
      </div>
    </div>
  );
};
