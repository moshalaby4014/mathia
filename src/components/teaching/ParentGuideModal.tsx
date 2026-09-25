import React, { useState, useEffect } from 'react';
import { ParentCoachingGuide } from '../../types/teaching';
import { sound } from '../../services/audio';
import {
  X,
  Sparkles,
  Lightbulb,
  MessageCircle,
  Home,
  HelpCircle,
  AlertTriangle,
  Heart,
  Volume2,
  VolumeX,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  titleAr: string;
  guide: ParentCoachingGuide;
  onClose: () => void;
}

export const ParentGuideModal: React.FC<Props> = ({ titleAr, guide, onClose }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  // Stop speech when closing
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('المتصفح لا يدعم القراءة الصوتية');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${titleAr}. الفكرة الأساسية: ${guide.conceptSummary}. ماذا تقول لطفلك: ${guide.howToExplainInOneMinute}. نصيحة: ${guide.commonPitfall}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopyScript = () => {
    sound.playSfx('click');
    navigator.clipboard.writeText(guide.howToExplainInOneMinute);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-4 sm:p-5 text-white relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0 border border-white/30">
              👨‍👧‍👦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide">
                  دليل ولي الأمر الذكي
                </span>
                <span className="text-[11px] bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                  ⏱️ 45 ثانية قراءة
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-0.5 leading-snug">
                كيف تشرح "{titleAr}" لطفلك ببساطة؟
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {'speechSynthesis' in window && (
              <button
                onClick={handleToggleSpeech}
                title={isPlayingAudio ? 'إيقاف الصوت' : 'استمع للشرح صوتياً'}
                className={`p-2 rounded-xl transition ${
                  isPlayingAudio
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={() => {
                sound.playSfx('click');
                onClose();
              }}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-right">
          {/* Section 1: Core Simplified Idea */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-amber-900 font-black text-sm mb-1.5">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <span>الفكرة الأساسية ببساطة شديدة:</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
              {guide.conceptSummary}
            </p>
          </div>

          {/* Section 2: Conversational Script */}
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 relative group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sky-950 font-black text-sm">
                <MessageCircle className="w-5 h-5 text-sky-600" />
                <span>ماذا تقول لطفلك قبل أن يبدأ؟ (حوار مقترح):</span>
              </div>
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-200/70 hover:bg-sky-200 text-sky-900 text-xs font-bold transition"
                title="نسخ نص الحوار"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
              </button>
            </div>
            <div className="bg-white/80 rounded-xl p-3.5 border border-sky-100 shadow-inner">
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed italic">
                "{guide.howToExplainInOneMinute}"
              </p>
            </div>
          </div>

          {/* Section 3: Concrete Home Activity */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-950 font-black text-sm mb-1.5">
              <Home className="w-5 h-5 text-emerald-600" />
              <span>نشاط حسي سريع في البيت (دقيقة واحدة):</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
              {guide.homeActivity}
            </p>
          </div>

          {/* Section 4: Questions to Ask Before Interacting */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-purple-950 font-black text-sm mb-2">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              <span>أسئلة سريعة وجّه بها ذهن طفلك قبل أن يلمس الشاشة:</span>
            </div>
            <div className="space-y-1.5">
              {guide.questionsBeforePlaying.map((q, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-purple-100">
                  <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Common Pitfall */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-rose-950 font-black text-sm mb-1.5">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>خطأ شائع يقع فيه معظم الأطفال (وكيف توجهه بهدوء):</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
              {guide.commonPitfall}
            </p>
          </div>

          {/* Section 6: Magic Encouragement Phrase */}
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            </div>
            <div>
              <div className="text-[11px] font-black text-amber-900">عبارة تشجيعية قلها لطفلك الآن:</div>
              <div className="text-xs sm:text-sm font-black text-amber-950">
                "{guide.encouragementPhrase}"
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-[11px] font-bold text-slate-500 hidden sm:block">
            💡 مشاركتك وتشجيعك يمنحان طفلك شغف حب الرياضيات للأبد
          </div>
          <button
            onClick={() => {
              sound.playSfx('sparkle');
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>فهمت الفكرة! لنبدأ التفاعل مع طفلي 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
