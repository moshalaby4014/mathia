import React, { useState, useEffect } from 'react';
import { sound } from '../../../services/audio';
import { Sparkles, Hammer, Plus, Minus, RotateCcw, CheckCircle2, ArrowDown } from 'lucide-react';

interface Props {
  initialHundreds?: number;
  initialTens?: number;
  initialOnes?: number;
  targetTotal?: number;
  mode?: 'free' | 'addition_regroup' | 'subtraction_regroup' | 'place_value_intro';
  label?: string;
  problemStatement?: string; // e.g. "27 + 18" or "42 − 18"
  onSuccess?: () => void;
  onRegroupOccurred?: (type: 'bundle_tens' | 'unbundle_tens') => void;
}

export const PlaceValueBlocksEngine: React.FC<Props> = ({
  initialHundreds = 0,
  initialTens = 2,
  initialOnes = 7,
  targetTotal,
  mode = 'free',
  label,
  problemStatement,
  onSuccess,
  onRegroupOccurred,
}) => {
  const [hundreds, setHundreds] = useState(initialHundreds);
  const [tens, setTens] = useState(initialTens);
  const [ones, setOnes] = useState(initialOnes);
  const [animationNotice, setAnimationNotice] = useState<string | null>(null);

  const totalValue = hundreds * 100 + tens * 10 + ones;

  useEffect(() => {
    if (targetTotal && totalValue === targetTotal) {
      sound.playSfx('success');
      onSuccess?.();
    }
  }, [totalValue, targetTotal]);

  // Bundle 10 ones into 1 ten
  const handleBundleTenOnes = () => {
    if (ones < 10) return;
    setOnes((prev) => prev - 10);
    setTens((prev) => prev + 1);
    sound.playSfx('crystal');
    setAnimationNotice('✨ تم تجميع 10 مكعبات آحاد وتحويلها إلى عمود عشرة واحدة!');
    onRegroupOccurred?.('bundle_tens');
    setTimeout(() => setAnimationNotice(null), 3500);
  };

  // Unbundle 1 ten into 10 ones
  const handleUnbundleOneTen = () => {
    if (tens < 1) return;
    setTens((prev) => prev - 1);
    setOnes((prev) => prev + 10);
    sound.playSfx('sparkle');
    setAnimationNotice('🔨 تم فك عمود عشرة واحدة إلى 10 مكعبات آحاد مفردة!');
    onRegroupOccurred?.('unbundle_tens');
    setTimeout(() => setAnimationNotice(null), 3500);
  };

  // Bundle 10 tens into 1 hundred
  const handleBundleTenTens = () => {
    if (tens < 10) return;
    setTens((prev) => prev - 10);
    setHundreds((prev) => prev + 1);
    sound.playSfx('crystal');
    setAnimationNotice('✨ تم تجميع 10 أعمدة عشرات وتحويلها إلى لوح مائة كامل!');
    setTimeout(() => setAnimationNotice(null), 3500);
  };

  // Unbundle 1 hundred into 10 tens
  const handleUnbundleOneHundred = () => {
    if (hundreds < 1) return;
    setHundreds((prev) => prev - 1);
    setTens((prev) => prev + 10);
    sound.playSfx('sparkle');
    setAnimationNotice('🔨 تم فك لوح المائة إلى 10 أعمدة عشرات!');
    setTimeout(() => setAnimationNotice(null), 3500);
  };

  const handleReset = () => {
    setHundreds(initialHundreds);
    setTens(initialTens);
    setOnes(initialOnes);
    sound.playSfx('click');
  };

  return (
    <div className="w-full bg-slate-50 border-3 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-lg flex flex-col items-center select-none">
      {/* Header & Goal */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧱</span>
            <span className="text-base font-black text-slate-800">
              {label || 'مختبر قطع القيمة المكانية (المئات، العشرات، الآحاد)'}
            </span>
          </div>
          {problemStatement && (
            <div className="text-xs font-bold text-amber-800 mt-0.5">
              المسألة المطروحة: <span className="text-sm font-black text-amber-950 px-2 py-0.5 bg-amber-100 rounded-lg">{problemStatement}</span>
            </div>
          )}
        </div>

        {/* Live Expanded Formula Card */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-slate-300 shadow-sm font-black text-sm sm:text-base">
          {hundreds > 0 && (
            <>
              <span className="text-emerald-700">{hundreds * 100}</span>
              <span className="text-slate-400">+</span>
            </>
          )}
          <span className="text-sky-700">{tens * 10}</span>
          <span className="text-slate-400">+</span>
          <span className="text-amber-700">{ones}</span>
          <span className="text-slate-400">=</span>
          <span className="text-xl text-purple-900 bg-purple-100 px-3 py-0.5 rounded-xl border border-purple-300">
            {totalValue}
          </span>
        </div>
      </div>

      {/* Floating Regrouping Notice */}
      {animationNotice && (
        <div className="w-full mb-3 p-3 bg-amber-100 border-2 border-amber-400 rounded-2xl text-amber-950 text-xs sm:text-sm font-black flex items-center justify-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{animationNotice}</span>
        </div>
      )}

      {/* 3 Place Value Columns: Hundreds, Tens, Ones */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
        {/* HUNDREDS COLUMN */}
        <div className="bg-emerald-50/70 border-3 border-emerald-300 rounded-2xl p-3.5 flex flex-col items-center shadow-sm">
          <div className="w-full flex items-center justify-between pb-2 border-b-2 border-emerald-200 mb-2">
            <span className="text-sm font-black text-emerald-950">المئات (Hundreds)</span>
            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full">
              {hundreds} لوح = {hundreds * 100}
            </span>
          </div>

          {/* Blocks Display */}
          <div className="w-full min-h-[140px] flex flex-wrap items-center justify-center gap-2 p-2 bg-white/70 rounded-xl border border-emerald-200">
            {hundreds === 0 ? (
              <span className="text-xs font-bold text-slate-400">لا يوجد مئات حالياً</span>
            ) : (
              Array.from({ length: hundreds }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-400 border-2 border-emerald-600 rounded-lg shadow-md flex items-center justify-center text-emerald-950 font-black text-xs relative overflow-hidden"
                  title="لوح مائة (10 × 10)"
                >
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-30 pointer-events-none">
                    {Array.from({ length: 100 }).map((_, j) => (
                      <div key={j} className="border-[0.5px] border-emerald-800" />
                    ))}
                  </div>
                  <span className="relative z-10 bg-white/70 px-1.5 py-0.5 rounded text-[11px] font-bold">100</span>
                </div>
              ))
            )}
          </div>

          {/* Exchange Actions */}
          <div className="w-full flex items-center justify-center gap-2 mt-3">
            {hundreds > 0 && (
              <button
                onClick={handleUnbundleOneHundred}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow active:scale-95"
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>فك 1 مائة إلى 10 عشرات</span>
              </button>
            )}
          </div>
        </div>

        {/* TENS COLUMN */}
        <div className="bg-sky-50/70 border-3 border-sky-300 rounded-2xl p-3.5 flex flex-col items-center shadow-sm">
          <div className="w-full flex items-center justify-between pb-2 border-b-2 border-sky-200 mb-2">
            <span className="text-sm font-black text-sky-950">العشرات (Tens)</span>
            <span className="text-xs font-bold px-2 py-0.5 bg-sky-200 text-sky-900 rounded-full">
              {tens} أعمدة = {tens * 10}
            </span>
          </div>

          {/* Blocks Display */}
          <div className="w-full min-h-[140px] flex flex-wrap items-center justify-center gap-2 p-2 bg-white/70 rounded-xl border border-sky-200">
            {tens === 0 ? (
              <span className="text-xs font-bold text-slate-400">لا يوجد عشرات حالياً</span>
            ) : (
              Array.from({ length: tens }).map((_, i) => (
                <div
                  key={`t-${i}`}
                  className="w-4 sm:w-5 h-24 sm:h-28 bg-sky-400 border-2 border-sky-600 rounded-md shadow flex flex-col justify-between py-1 items-center relative overflow-hidden"
                  title="عمود عشرة (1 × 10)"
                >
                  <div className="absolute inset-0 flex flex-col justify-between py-0.5 pointer-events-none">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <div key={j} className="h-0.5 bg-sky-700 opacity-40 w-full" />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-sky-950 bg-white/70 px-0.5 rounded">10</span>
                </div>
              ))
            )}
          </div>

          {/* Tens Actions */}
          <div className="w-full flex flex-col gap-1.5 mt-3">
            {tens >= 10 && (
              <button
                onClick={handleBundleTenTens}
                className="w-full py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow active:scale-95 animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>تجميع 10 عشرات إلى لوح مائة!</span>
              </button>
            )}
            {tens > 0 && (
              <button
                onClick={handleUnbundleOneTen}
                className="w-full py-2 px-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow active:scale-95"
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>فك 1 عشرة إلى 10 آحاد</span>
              </button>
            )}
          </div>
        </div>

        {/* ONES COLUMN */}
        <div className="bg-amber-50/70 border-3 border-amber-300 rounded-2xl p-3.5 flex flex-col items-center shadow-sm">
          <div className="w-full flex items-center justify-between pb-2 border-b-2 border-amber-200 mb-2">
            <span className="text-sm font-black text-amber-950">الآحاد (Ones)</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ones >= 10 ? 'bg-rose-200 text-rose-900 animate-pulse font-black' : 'bg-amber-200 text-amber-900'}`}>
              {ones} مكعبات {ones >= 10 && '⚠️ تتجاوز 9!'}
            </span>
          </div>

          {/* Blocks Display */}
          <div className="w-full min-h-[140px] flex flex-wrap items-center justify-center gap-1.5 p-2 bg-white/70 rounded-xl border border-amber-200">
            {ones === 0 ? (
              <span className="text-xs font-bold text-slate-400">لا يوجد آحاد</span>
            ) : (
              Array.from({ length: ones }).map((_, i) => (
                <div
                  key={`o-${i}`}
                  className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-400 border-2 border-amber-600 rounded shadow flex items-center justify-center text-[10px] font-black text-amber-950"
                  title="مكعب آحاد واحد"
                >
                  1
                </div>
              ))
            )}
          </div>

          {/* Ones Actions */}
          <div className="w-full flex flex-col gap-1.5 mt-3">
            {ones >= 10 ? (
              <button
                onClick={handleBundleTenOnes}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-yellow-200" />
                <span>تجميع 10 مكعبات إلى عشرة واحدة! ✨</span>
              </button>
            ) : (
              <div className="text-[11px] font-bold text-slate-500 text-center py-2">
                الآحاد أقل من 10 (لا تحتاج تجميع حالياً)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Helpful Interactive Miro Prompt */}
      <div className="w-full mt-3 bg-amber-100/70 border border-amber-300 rounded-2xl p-3 flex items-center justify-between text-xs sm:text-sm font-bold text-amber-950">
        <div className="flex items-center gap-2">
          <span>💡</span>
          <span>
            {ones >= 10
              ? 'خانة الآحاد لا تتسع لأكثر من 9 مكعبات! اضغط زر "تجميع 10 مكعبات" لنقل عشرة جديدة لخانة العشرات.'
              : 'كل 10 وحدات في خانة تساوي وحدة واحدة كاملة في الخانة الأكبر التالية!'}
          </span>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-amber-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة الأصل</span>
        </button>
      </div>
    </div>
  );
};
