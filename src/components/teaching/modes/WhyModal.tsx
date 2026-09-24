import React from 'react';
import { HelpCircle, X, Sparkles, Lightbulb } from 'lucide-react';
import { sound } from '../../../services/audio';

interface Props {
  questionAr: string;
  answerAr: string;
  visualConcept?: string;
  onClose: () => void;
}

export const WhyModal: React.FC<Props> = ({
  questionAr,
  answerAr,
  visualConcept,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-4 border-amber-400 p-6 sm:p-8 max-w-lg w-full text-right shadow-2xl space-y-4 relative">
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

        {/* Header Badge */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-900 text-xl font-black">
            🤔
          </div>
          <div>
            <span className="text-xs font-black text-amber-700">سر الرياضيات مع ميرو</span>
            <h3 className="text-lg sm:text-xl font-black text-slate-800">
              {questionAr}
            </h3>
          </div>
        </div>

        {/* Visual Concept Illustration */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 text-center">
          <div className="text-4xl my-2">
            {visualConcept || '✨ 10 🟰 10 مكعبات أحاد'}
          </div>
          <p className="text-xs font-bold text-amber-900">
            الرياضيات مبنية على مفاهيم منطقية وليس مجرد حفظ!
          </p>
        </div>

        {/* Deep Explanation */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-slate-700 leading-relaxed">
              {answerAr}
            </p>
          </div>
        </div>

        {/* Footer Button */}
        <button
          onClick={() => {
            sound.playSfx('click');
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition active:scale-95"
        >
          فهمت السبب الآن! شكراً يا ميرو 🚀
        </button>
      </div>
    </div>
  );
};
