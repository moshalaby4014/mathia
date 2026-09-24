import React, { useState } from 'react';
import { ExplanationStep } from '../../../types/teaching';
import { X, ChevronLeft, ChevronRight, Sparkles, Lightbulb } from 'lucide-react';
import { sound } from '../../../services/audio';

interface Props {
  titleAr: string;
  steps: ExplanationStep[];
  onClose: () => void;
}

export const ShowMeHowModal: React.FC<Props> = ({
  titleAr,
  steps,
  onClose,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const step = steps[currentStepIdx] || steps[0];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === steps.length - 1;

  const handleNext = () => {
    if (!isLast) {
      sound.playSfx('click');
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      sound.playSfx('success');
      onClose();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      sound.playSfx('click');
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-4 border-sky-400 p-6 sm:p-8 max-w-lg w-full text-right shadow-2xl space-y-4 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playSfx('click');
            onClose();
          }}
          className="absolute left-5 top-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-sky-800 text-xl font-black">
            👀
          </div>
          <div>
            <span className="text-xs font-black text-sky-700">ورشة "وريني إزاي" التفاعلية</span>
            <h3 className="text-lg font-black text-slate-800">{titleAr}</h3>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between bg-sky-50 px-3.5 py-1.5 rounded-xl border border-sky-200 text-xs font-bold text-sky-900">
          <span>الخطوة {currentStepIdx + 1} من {steps.length}</span>
          <span className="font-black text-sky-700">{step.titleAr}</span>
        </div>

        {/* Step Visual Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 text-center min-h-[120px] flex flex-col items-center justify-center">
          <div className="text-3xl sm:text-4xl mb-2">
            {step.visualHintAr || '✨ 🧱 ✨'}
          </div>
          <p className="text-sm font-black text-amber-950 leading-relaxed">
            {step.textAr}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className={`py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs flex items-center gap-1 ${
              isFirst ? 'opacity-30 cursor-not-allowed text-slate-400' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>الخطوة السابقة</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm shadow flex items-center justify-center gap-1 active:scale-95"
          >
            <span>{isLast ? 'جاهز للتجربة بنفسي! 💪' : 'الخطوة التالية'}</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
