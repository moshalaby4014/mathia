import React, { useState } from 'react';
import { sound } from '../../../services/audio';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface Props {
  part1: number; // e.g. 8
  part2: number; // e.g. 5
  total: number; // e.g. 13
  onSuccess?: () => void;
}

export const FactFamilyEngine: React.FC<Props> = ({
  part1,
  part2,
  total,
  onSuccess,
}) => {
  // 4 equation completion states:
  // 1: part1 + part2 = total
  // 2: part2 + part1 = total
  // 3: total - part1 = part2
  // 4: total - part2 = part1
  const [eq1Solved, setEq1Solved] = useState(false);
  const [eq2Solved, setEq2Solved] = useState(false);
  const [eq3Solved, setEq3Solved] = useState(false);
  const [eq4Solved, setEq4Solved] = useState(false);

  const [activeCard, setActiveCard] = useState<number | null>(null);

  const allSolved = eq1Solved && eq2Solved && eq3Solved && eq4Solved;

  const handleSolveEquation = (eqIndex: number) => {
    sound.playSfx('click');
    if (eqIndex === 1) setEq1Solved(true);
    if (eqIndex === 2) setEq2Solved(true);
    if (eqIndex === 3) setEq3Solved(true);
    if (eqIndex === 4) setEq4Solved(true);

    const nowSolvedCount = [
      eqIndex === 1 || eq1Solved,
      eqIndex === 2 || eq2Solved,
      eqIndex === 3 || eq3Solved,
      eqIndex === 4 || eq4Solved,
    ].filter(Boolean).length;

    if (nowSolvedCount === 4) {
      sound.playSfx('success');
      onSuccess?.();
    }
  };

  const handleReset = () => {
    setEq1Solved(false);
    setEq2Solved(false);
    setEq3Solved(false);
    setEq4Solved(false);
    sound.playSfx('click');
  };

  return (
    <div className="w-full max-w-2xl bg-amber-50/70 border-3 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-lg flex flex-col items-center select-none text-right">
      {/* Title */}
      <div className="w-full flex items-center justify-between pb-2 border-b-2 border-amber-200 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔺</span>
            <span className="text-base font-black text-amber-950">
              مثلث عائلة الحقائق الرياضية (الجمع والطرح وجهان لعملة واحدة)
            </span>
          </div>
          <p className="text-xs font-bold text-amber-800">
            الأعداد الثلاثة ({part1}، {part2}، {total}) تكون 4 جمل رياضية مترابطة!
          </p>
        </div>

        <button
          onClick={handleReset}
          className="text-xs font-bold text-amber-800 hover:text-amber-950 p-2 rounded-xl hover:bg-amber-200/60"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Fact Triangle Visual Representation */}
      <div className="relative w-64 h-56 flex flex-col items-center justify-between my-2">
        {/* SVG Triangle shape */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 256 220">
          <polygon
            points="128,25 25,200 231,200"
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Operation symbols */}
          <text x="70" y="115" fontSize="22" fontWeight="bold" fill="#d97706">−</text>
          <text x="175" y="115" fontSize="22" fontWeight="bold" fill="#d97706">−</text>
          <text x="123" y="195" fontSize="24" fontWeight="bold" fill="#10b981">+</text>
        </svg>

        {/* Top Node: TOTAL */}
        <div className="relative z-10 w-14 h-14 rounded-full bg-purple-600 text-white border-3 border-purple-300 shadow-md flex flex-col items-center justify-center font-black text-xl">
          <span>{total}</span>
          <span className="text-[9px] text-purple-200 -mt-1">الكل</span>
        </div>

        {/* Bottom Nodes: PART 1 & PART 2 */}
        <div className="relative z-10 w-full flex items-center justify-between px-2 pb-2">
          <div className="w-14 h-14 rounded-full bg-amber-500 text-white border-3 border-amber-200 shadow-md flex flex-col items-center justify-center font-black text-xl">
            <span>{part1}</span>
            <span className="text-[9px] text-amber-100 -mt-1">جزء</span>
          </div>

          <div className="w-14 h-14 rounded-full bg-emerald-500 text-white border-3 border-emerald-200 shadow-md flex flex-col items-center justify-center font-black text-xl">
            <span>{part2}</span>
            <span className="text-[9px] text-emerald-100 -mt-1">جزء</span>
          </div>
        </div>
      </div>

      {/* 4 Interactive Equations Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {/* Eq 1: Part 1 + Part 2 = Total */}
        <div className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
          eq1Solved ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 font-black text-base">
            <span className="text-amber-700">{part1}</span>
            <span>+</span>
            <span className="text-emerald-700">{part2}</span>
            <span>=</span>
            <span className={eq1Solved ? 'text-purple-700 font-extrabold' : 'text-slate-400'}>
              {eq1Solved ? total : '؟'}
            </span>
          </div>
          {!eq1Solved ? (
            <button
              onClick={() => handleSolveEquation(1)}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-sm"
            >
              اكتشف الناتج
            </button>
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
        </div>

        {/* Eq 2: Part 2 + Part 1 = Total */}
        <div className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
          eq2Solved ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 font-black text-base">
            <span className="text-emerald-700">{part2}</span>
            <span>+</span>
            <span className="text-amber-700">{part1}</span>
            <span>=</span>
            <span className={eq2Solved ? 'text-purple-700 font-extrabold' : 'text-slate-400'}>
              {eq2Solved ? total : '؟'}
            </span>
          </div>
          {!eq2Solved ? (
            <button
              onClick={() => handleSolveEquation(2)}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-sm"
            >
              اكتشف الناتج
            </button>
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
        </div>

        {/* Eq 3: Total - Part 1 = Part 2 */}
        <div className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
          eq3Solved ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 font-black text-base">
            <span className="text-purple-700">{total}</span>
            <span>−</span>
            <span className="text-amber-700">{part1}</span>
            <span>=</span>
            <span className={eq3Solved ? 'text-emerald-700 font-extrabold' : 'text-slate-400'}>
              {eq3Solved ? part2 : '؟'}
            </span>
          </div>
          {!eq3Solved ? (
            <button
              onClick={() => handleSolveEquation(3)}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-sm"
            >
              اكتشف الناتج
            </button>
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
        </div>

        {/* Eq 4: Total - Part 2 = Part 1 */}
        <div className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
          eq4Solved ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 font-black text-base">
            <span className="text-purple-700">{total}</span>
            <span>−</span>
            <span className="text-emerald-700">{part2}</span>
            <span>=</span>
            <span className={eq4Solved ? 'text-amber-700 font-extrabold' : 'text-slate-400'}>
              {eq4Solved ? part1 : '؟'}
            </span>
          </div>
          {!eq4Solved ? (
            <button
              onClick={() => handleSolveEquation(4)}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-sm"
            >
              اكتشف الناتج
            </button>
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
        </div>
      </div>

      {/* Success banner */}
      {allSolved ? (
        <div className="w-full mt-2 bg-emerald-100 border-2 border-emerald-400 rounded-2xl p-3 text-emerald-950 font-black text-xs sm:text-sm text-center flex items-center justify-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>
            رائع جداً! إذا عرفت أن {part1} + {part2} = {total}، تستطيع فوراً معرفة ناتج الطرح {total} − {part1} = {part2}!
          </span>
        </div>
      ) : (
        <p className="text-xs font-bold text-slate-500 text-center mt-1">
          💡 اضغط على الأزرار لاكتشاف كيف ترتبط حقائق الجمع والطرح بنفس الأعداد الثلاثة!
        </p>
      )}
    </div>
  );
};
