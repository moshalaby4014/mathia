import React, { useState, useEffect } from 'react';
import { Volume2, Lightbulb, ChevronLeft } from 'lucide-react';
import { sound } from '../services/audio';

interface Props {
  mood?: 'happy' | 'thinking' | 'celebrate' | 'guiding' | 'oops' | 'surprised';
  message: string;
  hintLadder?: string[];
  currentHintIndex?: number;
  onAdvanceHint?: () => void;
  className?: string;
  allowSpeech?: boolean;
}

export const MiroCompanion: React.FC<Props> = ({
  mood = 'guiding',
  message,
  hintLadder = [],
  currentHintIndex = -1,
  onAdvanceHint,
  className = '',
  allowSpeech = true,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Slight sound cue when message updates
    sound.playSfx('pop');
  }, [message]);

  const handleSpeak = () => {
    setIsSpeaking(true);
    sound.speakArabic(message);
    setTimeout(() => setIsSpeaking(false), 2500);
  };

  const handleNextHint = () => {
    sound.playSfx('click');
    if (onAdvanceHint) {
      onAdvanceHint();
    }
  };

  return (
    <div className={`relative flex items-end gap-3 z-30 max-w-xl mx-auto select-none ${className}`}>
      {/* Miro Character SVG Graphic */}
      <div className="relative flex-shrink-0 cursor-pointer group" onClick={handleSpeak} title="اضغط لسماع ميرو">
        <div className="w-20 h-20 sm:w-24 sm:h-24 transition-transform group-hover:scale-105 active:scale-95 animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Soft shadow */}
            <ellipse cx="50" cy="94" rx="28" ry="5" fill="#000000" opacity="0.15" />

            {/* Fennec Big Ears */}
            {/* Left Ear */}
            <path
              d="M 32 45 C 10 15, 12 -5, 26 12 C 34 22, 38 34, 38 45 Z"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="2"
            />
            <path
              d="M 30 40 C 18 18, 18 5, 26 16 C 30 24, 34 32, 34 40 Z"
              fill="#fda4af"
            />

            {/* Right Ear */}
            <path
              d="M 68 45 C 90 15, 88 -5, 74 12 C 66 22, 62 34, 62 45 Z"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="2"
            />
            <path
              d="M 70 40 C 82 18, 82 5, 74 16 C 70 24, 66 32, 66 40 Z"
              fill="#fda4af"
            />

            {/* Fluffy Tail */}
            <path
              d="M 72 75 C 92 70, 96 85, 84 90 C 76 94, 68 85, 72 75 Z"
              fill="#f59e0b"
              stroke="#d97706"
              strokeWidth="1.5"
            />
            <path d="M 86 85 C 94 82, 92 88, 88 90 Z" fill="#ffffff" />

            {/* Body */}
            <ellipse cx="50" cy="74" rx="20" ry="18" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
            <ellipse cx="50" cy="76" rx="14" ry="12" fill="#fffbeb" />

            {/* Scarf / Egyptian Amulet */}
            <path d="M 36 60 Q 50 68 64 60 L 62 66 Q 50 72 38 66 Z" fill="#0284c7" />
            <circle cx="50" cy="67" r="4" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />

            {/* Head */}
            <circle cx="50" cy="46" r="22" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />

            {/* White face cheeks mask */}
            <ellipse cx="40" cy="50" rx="10" ry="8" fill="#fffbeb" />
            <ellipse cx="60" cy="50" rx="10" ry="8" fill="#fffbeb" />

            {/* Cheeks blush */}
            <ellipse cx="36" cy="52" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />
            <ellipse cx="64" cy="52" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />

            {/* Eyes based on mood */}
            {mood === 'celebrate' ? (
              // Sparkly happy squint
              <>
                <path d="M 37 46 Q 42 41 47 46" stroke="#451a03" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M 53 46 Q 58 41 63 46" stroke="#451a03" strokeWidth="3" strokeLinecap="round" fill="none" />
              </>
            ) : mood === 'oops' ? (
              // Encouraging soft eyes
              <>
                <circle cx="42" cy="45" r="4" fill="#451a03" />
                <circle cx="43" cy="44" r="1.5" fill="#ffffff" />
                <circle cx="58" cy="45" r="4" fill="#451a03" />
                <circle cx="59" cy="44" r="1.5" fill="#ffffff" />
              </>
            ) : (
              // Curious big pupils
              <>
                <ellipse cx="42" cy="45" rx="4.5" ry="5.5" fill="#451a03" />
                <circle cx="43.5" cy="43.5" r="2" fill="#ffffff" />
                <ellipse cx="58" cy="45" rx="4.5" ry="5.5" fill="#451a03" />
                <circle cx="59.5" cy="43.5" r="2" fill="#ffffff" />
              </>
            )}

            {/* Little black nose */}
            <polygon points="50,52 47,49 53,49" fill="#1e293b" />

            {/* Mouth */}
            <path d="M 47 53 Q 50 56 53 53" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Miro tag */}
            <g transform="translate(35, 87)">
              <rect width="30" height="11" rx="4" fill="#1e293b" />
              <text x="15" y="8" textAnchor="middle" fill="#fde68a" fontSize="7" fontWeight="bold">
                ميرو ✨
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Miro Speech Bubble */}
      <div className="relative flex-1 bg-white border-2 border-amber-300 rounded-3xl p-3.5 sm:p-4 shadow-xl text-right">
        {/* Pointer triangle */}
        <div className="absolute -bottom-2.5 right-6 w-5 h-5 bg-white border-b-2 border-r-2 border-amber-300 transform rotate-45" />

        <div className="flex items-start justify-between gap-2">
          {allowSpeech && (
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-full text-amber-600 hover:bg-amber-100 transition-colors flex-shrink-0 ${
                isSpeaking ? 'animate-pulse text-amber-800 bg-amber-100' : ''
              }`}
              title="استمع إلى ميرو"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}

          <p className="text-slate-800 text-sm sm:text-base font-bold leading-relaxed flex-1">
            {message}
          </p>
        </div>

        {/* Progressive Hint Ladder Drawer */}
        {hintLadder.length > 0 && onAdvanceHint && (
          <div className="mt-2.5 pt-2 border-t border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-700">
                {currentHintIndex >= 0
                  ? `مساعدة (${currentHintIndex + 1}/${hintLadder.length})`
                  : 'محتاج مساعدة؟'}
              </span>
              <div className="flex gap-1">
                {hintLadder.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx <= currentHintIndex ? 'bg-amber-500' : 'bg-amber-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {currentHintIndex < hintLadder.length - 1 && (
              <button
                onClick={handleNextHint}
                className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs font-black shadow transition-all active:scale-95"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{currentHintIndex === -1 ? 'أعطني تلميحاً' : 'تلميح تالٍ'}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
