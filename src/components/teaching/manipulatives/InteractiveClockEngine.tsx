import React, { useState } from 'react';
import { sound } from '../../../services/audio';
import { Sparkles, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  targetHours?: number;
  targetMinutes?: number;
  onSuccess?: () => void;
}

export const InteractiveClockEngine: React.FC<Props> = ({
  targetHours = 7,
  targetMinutes = 30,
  onSuccess,
}) => {
  const [hours, setHours] = useState(4);
  const [minutes, setMinutes] = useState(0);

  const isMatched = hours === targetHours && minutes === targetMinutes;

  // Angles in degrees
  const minuteAngle = (minutes / 60) * 360;
  const hourAngle = ((hours % 12) + minutes / 60) * 30;

  const handleSetMinute = (m: number) => {
    setMinutes(m);
    sound.playSfx('click');
    if (hours === targetHours && m === targetMinutes) {
      sound.playSfx('success');
      onSuccess?.();
    }
  };

  const handleSetHour = (h: number) => {
    setHours(h);
    sound.playSfx('click');
    if (h === targetHours && minutes === targetMinutes) {
      sound.playSfx('success');
      onSuccess?.();
    }
  };

  const formatArabicTime = (h: number, m: number) => {
    const hoursNames: Record<number, string> = {
      1: 'الواحدة',
      2: 'الثانية',
      3: 'الثالثة',
      4: 'الرابعة',
      5: 'الخامسة',
      6: 'السادسة',
      7: 'السابعة',
      8: 'الثامنة',
      9: 'التاسعة',
      10: 'العاشرة',
      11: 'الحادية عشرة',
      12: 'الثانية عشرة',
    };

    let suffix = 'تماماً';
    if (m === 30) suffix = 'والنصف';
    else if (m === 15) suffix = 'والربع';
    else if (m === 45) suffix = 'إلا ربع';
    else if (m > 0) suffix = `و ${m} دقيقة`;

    return `${hoursNames[h]} ${suffix}`;
  };

  return (
    <div className="w-full max-w-xl bg-sky-50/70 border-3 border-sky-300 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col items-center select-none text-right">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b-2 border-sky-200 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-sky-700" />
            <span className="text-base font-black text-sky-950">
              مختبر الساعة التفاعلي (قراءة الوقت بالساعات والدقائق)
            </span>
          </div>
          <p className="text-xs font-bold text-sky-800 mt-0.5">
            المطلوب ضبط الساعة على: <span className="font-black text-sky-950 px-2 py-0.5 bg-sky-200 rounded-md text-sm">{formatArabicTime(targetHours, targetMinutes)} ({String(targetHours).padStart(2, '0')}:{String(targetMinutes).padStart(2, '0')})</span>
          </p>
        </div>
      </div>

      {/* Clock Face SVG */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-2">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Clock Outer Rim */}
          <circle cx="100" cy="100" r="92" fill="#ffffff" stroke="#0284c7" strokeWidth="6" />
          <circle cx="100" cy="100" r="88" fill="#f0f9ff" />

          {/* Hour Numbers around dial */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const x = 100 + 70 * Math.cos(angle);
            const y = 100 + 70 * Math.sin(angle);
            return (
              <text
                key={num}
                x={x}
                y={y + 5}
                fontSize="14"
                fontWeight="900"
                fill="#0369a1"
                textAnchor="middle"
              >
                {num}
              </text>
            );
          })}

          {/* Hour Hand (Short & Thick) */}
          <line
            x1="100"
            y1="100"
            x2={100 + 45 * Math.sin((hourAngle * Math.PI) / 180)}
            y2={100 - 45 * Math.cos((hourAngle * Math.PI) / 180)}
            stroke="#0f172a"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Minute Hand (Long & Blue) */}
          <line
            x1="100"
            y1="100"
            x2={100 + 68 * Math.sin((minuteAngle * Math.PI) / 180)}
            y2={100 - 68 * Math.cos((minuteAngle * Math.PI) / 180)}
            stroke="#0284c7"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Center Pin */}
          <circle cx="100" cy="100" r="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
        </svg>
      </div>

      {/* Digital Display */}
      <div className="bg-slate-900 text-amber-400 font-mono text-2xl font-black px-6 py-2 rounded-2xl border-2 border-slate-700 shadow-md my-2">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
      </div>
      <div className="text-sm font-black text-sky-950 mb-3">
        الساعة الآن: {formatArabicTime(hours, minutes)}
      </div>

      {/* Quick Adjustment Controls */}
      <div className="w-full space-y-3">
        {/* Hour Picker */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600">اختر الساعة (العقرب الصغير):</span>
          <div className="flex flex-wrap justify-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
              <button
                key={h}
                onClick={() => handleSetHour(h)}
                className={`w-8 h-8 rounded-lg font-black text-xs transition ${
                  hours === h
                    ? 'bg-slate-900 text-white scale-110 shadow'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-sky-100'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Minute Presets */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600">اختر الدقائق (العقرب الكبير):</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleSetMinute(0)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${
                minutes === 0 ? 'bg-sky-600 text-white font-black' : 'bg-white text-slate-700 hover:bg-sky-50'
              }`}
            >
              تماماً (:00)
            </button>
            <button
              onClick={() => handleSetMinute(15)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${
                minutes === 15 ? 'bg-sky-600 text-white font-black' : 'bg-white text-slate-700 hover:bg-sky-50'
              }`}
            >
              والربع (:15)
            </button>
            <button
              onClick={() => handleSetMinute(30)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${
                minutes === 30 ? 'bg-sky-600 text-white font-black' : 'bg-white text-slate-700 hover:bg-sky-50'
              }`}
            >
              والنصف (:30)
            </button>
            <button
              onClick={() => handleSetMinute(45)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${
                minutes === 45 ? 'bg-sky-600 text-white font-black' : 'bg-white text-slate-700 hover:bg-sky-50'
              }`}
            >
              إلا ربع (:45)
            </button>
          </div>
        </div>
      </div>

      {/* Match Alert */}
      {isMatched && (
        <div className="mt-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl p-3 px-5 text-emerald-950 font-black text-xs sm:text-sm flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>أحسنت يا بطل! تم ضبط الوقت بنجاح على {formatArabicTime(targetHours, targetMinutes)}!</span>
        </div>
      )}
    </div>
  );
};
