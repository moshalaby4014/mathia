import React, { useState } from 'react';
import { sound } from '../../../services/audio';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  startNumber: number;
  stepsToJump: number;
  operation: 'add' | 'subtract';
  min?: number;
  max?: number;
  label?: string;
  onSuccess?: () => void;
}

export const NumberLineEngine: React.FC<Props> = ({
  startNumber,
  stepsToJump,
  operation,
  min = Math.max(0, startNumber - 2),
  max = Math.max(startNumber + stepsToJump + 4, 15),
  label,
  onSuccess,
}) => {
  const [currentPos, setCurrentPos] = useState(startNumber);
  const [jumpHistory, setJumpHistory] = useState<number[]>([startNumber]);

  const target = operation === 'add' ? startNumber + stepsToJump : startNumber - stepsToJump;
  const jumpsMade = Math.abs(currentPos - startNumber);
  const isTargetReached = currentPos === target;

  const handleJump = (direction: 'forward' | 'backward') => {
    if (direction === 'forward') {
      if (currentPos >= max) return;
      const next = currentPos + 1;
      setCurrentPos(next);
      setJumpHistory((prev) => [...prev, next]);
      sound.playSfx('click');

      if (operation === 'add' && next === target) {
        sound.playSfx('success');
        onSuccess?.();
      }
    } else {
      if (currentPos <= min) return;
      const next = currentPos - 1;
      setCurrentPos(next);
      setJumpHistory((prev) => [...prev, next]);
      sound.playSfx('click');

      if (operation === 'subtract' && next === target) {
        sound.playSfx('success');
        onSuccess?.();
      }
    }
  };

  const handleReset = () => {
    setCurrentPos(startNumber);
    setJumpHistory([startNumber]);
    sound.playSfx('click');
  };

  const numbers = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }

  // Calculate arc jumps
  const lineRange = max - min;

  return (
    <div className="w-full bg-amber-50/70 border-3 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-md flex flex-col items-center select-none">
      {/* Title & Goal Banner */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📏</span>
          <div>
            <div className="text-sm font-black text-amber-900">
              {label || (operation === 'add' ? 'خط الأعداد — القفز للأمام' : 'خط الأعداد — القفز للخلف')}
            </div>
            <div className="text-xs font-bold text-amber-700">
              ابدأ من <span className="font-black text-amber-950 px-1.5 py-0.5 bg-amber-200 rounded-md">{startNumber}</span> واعدّ{' '}
              <span className="font-black text-amber-950 px-1.5 py-0.5 bg-amber-200 rounded-md">{stepsToJump}</span> قفزات{' '}
              {operation === 'add' ? 'تصاعدياً (+)' : 'تنازلياً (-)'}
            </div>
          </div>
        </div>

        {/* Live Equation Badge */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-sm font-black text-lg text-amber-950">
          <span>{startNumber}</span>
          <span className="text-amber-600">{operation === 'add' ? '+' : '−'}</span>
          <span>{stepsToJump}</span>
          <span>=</span>
          <span className={`px-2 py-0.5 rounded-lg ${isTargetReached ? 'bg-emerald-200 text-emerald-900 animate-pulse' : 'bg-amber-100 text-amber-800'}`}>
            {isTargetReached ? target : '؟'}
          </span>
        </div>
      </div>

      {/* Interactive Number Line Canvas/SVG */}
      <div className="w-full overflow-x-auto py-6 px-2 sm:px-6">
        <div className="min-w-[600px] sm:min-w-[700px] relative h-36 flex flex-col justify-end pb-8">
          {/* SVG Arcs for jumps */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${lineRange * 50 + 60} 140`}>
            {jumpHistory.map((pos, idx) => {
              if (idx === 0) return null;
              const prevPos = jumpHistory[idx - 1];
              const x1 = (prevPos - min) * 50 + 30;
              const x2 = (pos - min) * 50 + 30;
              const midX = (x1 + x2) / 2;
              const arcY = 55;

              return (
                <g key={`arc-${idx}`}>
                  <path
                    d={`M ${x1} 100 Q ${midX} ${arcY} ${x2} 100`}
                    fill="none"
                    stroke={operation === 'add' ? '#059669' : '#e11d48'}
                    strokeWidth="3.5"
                    strokeDasharray="4 2"
                  />
                  {/* Jump Step Label */}
                  <text
                    x={midX}
                    y={arcY + 8}
                    fill={operation === 'add' ? '#047857' : '#be123c'}
                    fontSize="13"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {operation === 'add' ? '+1' : '−1'}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Main Horizontal Axis */}
          <div className="relative w-full h-2.5 bg-amber-700 rounded-full flex items-center justify-between px-7">
            {/* Axis Arrows */}
            <div className="absolute -left-2 text-amber-800 text-xl font-black">◀</div>
            <div className="absolute -right-2 text-amber-800 text-xl font-black">▶</div>

            {/* Ticks and Numbers */}
            {numbers.map((num) => {
              const isStart = num === startNumber;
              const isCurrent = num === currentPos;
              const isGoal = num === target;

              return (
                <div key={num} className="relative flex flex-col items-center">
                  {/* Tick */}
                  <div
                    className={`w-1 rounded-full ${
                      isCurrent
                        ? 'h-7 bg-amber-900 -mt-2'
                        : isStart
                        ? 'h-6 bg-sky-600'
                        : 'h-4 bg-amber-600'
                    }`}
                  />

                  {/* Number Label */}
                  <span
                    className={`absolute top-5 text-sm sm:text-base font-black transition-transform ${
                      isCurrent
                        ? 'text-amber-950 scale-125 underline decoration-amber-500'
                        : isGoal
                        ? 'text-emerald-700 font-extrabold'
                        : 'text-amber-800'
                    }`}
                  >
                    {num}
                  </span>

                  {/* Pawn / Hero Marker at current position */}
                  {isCurrent && (
                    <div className="absolute -top-11 flex flex-col items-center animate-bounce">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-800 shadow-md flex items-center justify-center text-sm">
                        🐾
                      </div>
                      <div className="w-2 h-2 bg-amber-800 rotate-45 -mt-1" />
                    </div>
                  )}

                  {/* Goal Marker Flag */}
                  {isGoal && !isCurrent && (
                    <div className="absolute -top-7 text-xs font-bold text-emerald-600 flex flex-col items-center">
                      <span>🎯</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        {operation === 'add' ? (
          <button
            onClick={() => handleJump('forward')}
            disabled={isTargetReached}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 shadow-md transition-all active:scale-95 ${
              isTargetReached
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-700'
            }`}
          >
            <span>اقفز خطوة للأمام (+1)</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => handleJump('backward')}
            disabled={isTargetReached}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 shadow-md transition-all active:scale-95 ${
              isTargetReached
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-700'
            }`}
          >
            <ArrowRight className="w-5 h-5" />
            <span>ارجع خطوة للخلف (−1)</span>
          </button>
        )}

        <button
          onClick={handleReset}
          className="px-3.5 py-2.5 rounded-2xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة البداية</span>
        </button>
      </div>

      {/* Real-time Guidance / Success Toast */}
      {isTargetReached ? (
        <div className="mt-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl p-3 px-5 text-emerald-900 font-black text-sm sm:text-base flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>
            رائع جداً! بدأنا من {startNumber} وعدينا {stepsToJump} قفزات فوصلنا إلى {target}!
          </span>
        </div>
      ) : (
        <div className="mt-3 text-xs font-bold text-amber-800">
          عدد القفزات المتبقية: <span className="font-black text-amber-950">{Math.abs(target - currentPos)}</span> قفزة
        </div>
      )}
    </div>
  );
};
