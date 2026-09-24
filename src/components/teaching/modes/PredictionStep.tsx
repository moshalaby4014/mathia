import React, { useState } from 'react';
import { PredictionPrompt } from '../../../types/teaching';
import { sound } from '../../../services/audio';
import { HelpCircle, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

interface Props {
  prompt: PredictionPrompt;
  onPredictionAnswered: (isCorrect: boolean) => void;
}

export const PredictionStep: React.FC<Props> = ({
  prompt,
  onPredictionAnswered,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const selectedOption = prompt.options.find((opt) => opt.id === selectedOptionId);

  const handleSelect = (id: string) => {
    if (hasConfirmed) return;
    sound.playSfx('click');
    setSelectedOptionId(id);
  };

  const handleConfirm = () => {
    if (!selectedOption) return;
    setHasConfirmed(true);
    if (selectedOption.isCorrect) {
      sound.playSfx('success');
    } else {
      sound.playSfx('click');
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border-3 border-purple-300 rounded-3xl p-4 sm:p-6 shadow-md my-3 select-none text-right">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-purple-200 text-purple-900 flex items-center justify-center font-black text-lg">
          🔮
        </div>
        <div>
          <span className="text-xs font-black text-purple-700">تحدي التوقع الذكي</span>
          <h4 className="text-sm sm:text-base font-black text-purple-950">
            {prompt.questionAr}
          </h4>
        </div>
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
        {prompt.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              disabled={hasConfirmed}
              onClick={() => handleSelect(opt.id)}
              className={`p-3.5 rounded-2xl border-2 text-right font-black text-xs sm:text-sm transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-purple-600 bg-purple-100/90 text-purple-950 shadow-md ring-2 ring-purple-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300'
              }`}
            >
              <span>{opt.textAr}</span>
              {isSelected && <span className="text-purple-700">🎯</span>}
            </button>
          );
        })}
      </div>

      {/* Confirmation & Feedback */}
      {!hasConfirmed ? (
        <button
          disabled={!selectedOptionId}
          onClick={handleConfirm}
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm disabled:opacity-40 shadow transition active:scale-95 flex items-center justify-center gap-2"
        >
          <span>تأكيد توقعي واختبار الفكرة عملياً! 🚀</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      ) : (
        <div className="p-3 bg-white/90 border border-purple-200 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-purple-950">
            {selectedOption?.isCorrect ? (
              <span className="text-emerald-600">✨ توقع عبقري وصحيح!</span>
            ) : (
              <span className="text-amber-700">💡 فكرة جيدة! تعال نجربها عملياً لنكتشف ماذا سيحدث بالضبط!</span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-600">
            {selectedOption?.explanationAr}
          </p>

          <button
            onClick={() => onPredictionAnswered(selectedOption?.isCorrect || false)}
            className="w-full mt-2 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow active:scale-95"
          >
            الانتقال للمختبر وتجربة الفكرة الآن 🧪
          </button>
        </div>
      )}
    </div>
  );
};
