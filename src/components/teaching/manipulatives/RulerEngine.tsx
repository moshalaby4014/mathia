import React, { useState } from 'react';
import { sound } from '../../../services/audio';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface Props {
  objectNameAr?: string;
  actualLengthCm?: number; // e.g. 12
  objectEmoji?: string;
  onSuccess?: () => void;
}

export const RulerEngine: React.FC<Props> = ({
  objectNameAr = 'قلم القصب البردي',
  actualLengthCm = 12,
  objectEmoji = '✏️',
  onSuccess,
}) => {
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  const handleCheck = () => {
    if (parseInt(userGuess, 10) === actualLengthCm) {
      sound.playSfx('success');
      setIsSolved(true);
      setFeedback(`🎉 إجابة صحيحة ودقيقة! طول ${objectNameAr} هو ${actualLengthCm} سنتيمتر بالضبط!`);
      onSuccess?.();
    } else {
      sound.playSfx('error');
      setFeedback('انظر إلى تدريج المسطرة: من الصفر (0) حتى أين ينتهي طرف القلم؟');
    }
  };

  return (
    <div className="w-full max-w-xl bg-amber-50/70 border-3 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col items-center select-none text-right">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b-2 border-amber-200 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📏</span>
            <span className="text-base font-black text-amber-950">
              مختبر القياس بالمسطرة (السنتيمتر cm)
            </span>
          </div>
          <p className="text-xs font-bold text-amber-800 mt-0.5">
            قِس طول <span className="font-black text-amber-950">{objectNameAr}</span> باستخدام المسطرة أدناه.
          </p>
        </div>
      </div>

      {/* Object to measure */}
      <div className="w-full overflow-x-auto p-4 bg-white rounded-2xl border-2 border-amber-200 shadow-inner flex flex-col items-start gap-1">
        {/* Object Bar starting at 0 */}
        <div
          className="h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg shadow border-2 border-amber-700 flex items-center justify-between px-2 text-white font-black text-xs"
          style={{ width: `${actualLengthCm * 32}px`, marginRight: '16px' }}
        >
          <span>{objectEmoji} {objectNameAr}</span>
          <span>{actualLengthCm} سم</span>
        </div>

        {/* Ruler SVG */}
        <div className="w-full min-w-[500px] h-16 bg-yellow-100 border-2 border-yellow-500 rounded-lg relative flex items-end shadow">
          {Array.from({ length: 16 }).map((_, cm) => (
            <div
              key={cm}
              className="absolute flex flex-col items-center"
              style={{ right: `${cm * 32 + 16}px`, bottom: '0px' }}
            >
              <div className={`w-0.5 bg-yellow-900 ${cm % 5 === 0 ? 'h-8' : 'h-4'}`} />
              <span className="text-[11px] font-black text-yellow-950 mt-0.5">{cm}</span>
            </div>
          ))}
          <span className="absolute left-3 top-2 text-[10px] font-bold text-yellow-800">
            سم (cm)
          </span>
        </div>
      </div>

      {/* Egyptian Rule Hint */}
      <div className="w-full my-3 p-2.5 bg-amber-100/70 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
        <span>💡 قاعدة القياس الذهبية:</span>
        <span>نضع بداية الشيء دائماً عند الرقم (0) ونقرأ الرقم الذي ينتهي عنده الطرف الآخر!</span>
      </div>

      {/* Input & Check */}
      <div className="flex items-center gap-3 mt-2">
        <span className="text-sm font-black text-slate-800">طول القلم =</span>
        <input
          type="number"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="؟"
          className="w-16 h-11 text-center font-black text-lg border-2 border-amber-400 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
        />
        <span className="text-sm font-bold text-slate-700">سنتيمتر (سم)</span>

        <button
          onClick={handleCheck}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow active:scale-95"
        >
          تحقق من القياس
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mt-3 p-3 rounded-2xl text-xs sm:text-sm font-bold text-center w-full ${
          isSolved ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 animate-bounce' : 'bg-rose-100 text-rose-900 border border-rose-300'
        }`}>
          {feedback}
        </div>
      )}
    </div>
  );
};
