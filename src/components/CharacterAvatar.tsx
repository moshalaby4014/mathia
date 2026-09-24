import React from 'react';
import { PlayerAvatar } from '../types/game';

interface Props {
  avatar: PlayerAvatar;
  state?: 'idle' | 'celebrate' | 'thinking' | 'surprised' | 'encouraged';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CharacterAvatar: React.FC<Props> = ({
  avatar,
  state = 'idle',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const outfitFills: Record<string, { main: string; trim: string }> = {
    amber: { main: '#f59e0b', trim: '#b45309' },
    emerald: { main: '#10b981', trim: '#047857' },
    sky: { main: '#0ea5e9', trim: '#0369a1' },
    rose: { main: '#f43f5e', trim: '#be123c' },
    purple: { main: '#a855f7', trim: '#7e22ce' },
  };

  const outfit = outfitFills[avatar.outfitColor] || outfitFills.amber;

  // Dynamic animation classes based on state
  const stateAnimationClass = {
    idle: 'animate-float',
    celebrate: 'animate-bounce',
    thinking: 'rotate-[-3deg] transition-transform duration-300',
    surprised: 'scale-105 transition-transform duration-200',
    encouraged: 'scale-100 transition-transform duration-300',
  }[state];

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${stateAnimationClass} ${className}`}>
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md overflow-visible">
        {/* Shadow under feet */}
        <ellipse cx="50" cy="115" rx="22" ry="4" fill="#000000" opacity="0.18" />

        {/* Feet / Shoes */}
        <ellipse cx="40" cy="110" rx="8" ry="5" fill="#451a03" />
        <ellipse cx="60" cy="110" rx="8" ry="5" fill="#451a03" />

        {/* Legs */}
        <rect x="37" y="94" width="7" height="15" rx="3" fill="#1e293b" />
        <rect x="56" y="94" width="7" height="15" rx="3" fill="#1e293b" />

        {/* Torso / Clothes */}
        <path
          d="M 32 64 C 32 60, 68 60, 68 64 L 72 96 C 72 98, 28 98, 28 96 Z"
          fill={outfit.main}
          stroke={outfit.trim}
          strokeWidth="2.5"
        />
        {/* Egyptian style belt or motif */}
        <rect x="30" y="86" width="40" height="4" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

        {/* Arms based on state */}
        {state === 'celebrate' ? (
          // Arms raised up celebrating
          <>
            <path d="M 31 66 Q 16 52 14 38" stroke={avatar.skinTone} strokeWidth="6" strokeLinecap="round" fill="none" />
            <ellipse cx="14" cy="36" rx="4" ry="4" fill={avatar.skinTone} />
            <path d="M 69 66 Q 84 52 86 38" stroke={avatar.skinTone} strokeWidth="6" strokeLinecap="round" fill="none" />
            <ellipse cx="86" cy="36" rx="4" ry="4" fill={avatar.skinTone} />
          </>
        ) : state === 'thinking' ? (
          // Hand on chin thinking
          <>
            <path d="M 31 68 Q 24 80 32 86" stroke={avatar.skinTone} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 69 68 Q 74 76 56 60" stroke={avatar.skinTone} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <ellipse cx="55" cy="59" rx="3.5" ry="3.5" fill={avatar.skinTone} />
          </>
        ) : (
          // Friendly open arms
          <>
            <path d="M 31 68 Q 20 80 24 90" stroke={avatar.skinTone} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <ellipse cx="24" cy="90" rx="3.5" ry="3.5" fill={avatar.skinTone} />
            <path d="M 69 68 Q 80 80 76 90" stroke={avatar.skinTone} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <ellipse cx="76" cy="90" rx="3.5" ry="3.5" fill={avatar.skinTone} />
          </>
        )}

        {/* Neck */}
        <rect x="46" y="52" width="8" height="12" fill={avatar.skinTone} rx="2" />

        {/* Head */}
        <circle cx="50" cy="40" r="19" fill={avatar.skinTone} />

        {/* Hair Back if long */}
        {avatar.hairStyle === 'long' && (
          <path d="M 28 36 C 28 65, 72 65, 72 36 Z" fill={avatar.hairColor} opacity="0.9" />
        )}
        {avatar.hairStyle === 'braids' && (
          <>
            <path d="M 30 40 Q 22 56 26 70" stroke={avatar.hairColor} strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 70 40 Q 78 56 74 70" stroke={avatar.hairColor} strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Cheeks */}
        <ellipse cx="37" cy="44" rx="3.5" ry="2" fill="#f43f5e" opacity="0.4" />
        <ellipse cx="63" cy="44" rx="3.5" ry="2" fill="#f43f5e" opacity="0.4" />

        {/* Eyes */}
        {state === 'surprised' ? (
          <>
            <circle cx="41" cy="38" r="4.5" fill="#ffffff" />
            <circle cx="41" cy="38" r="2.5" fill="#1e293b" />
            <circle cx="59" cy="38" r="4.5" fill="#ffffff" />
            <circle cx="59" cy="38" r="2.5" fill="#1e293b" />
          </>
        ) : state === 'celebrate' ? (
          // Happy smiling arc eyes
          <>
            <path d="M 37 39 Q 41 34 45 39" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 55 39 Q 59 34 63 39" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          // Big bright curious eyes
          <>
            <ellipse cx="41" cy="38" rx="3.5" ry="4.5" fill="#1e293b" />
            <circle cx="42" cy="36.5" r="1.5" fill="#ffffff" />
            <ellipse cx="59" cy="38" rx="3.5" ry="4.5" fill="#1e293b" />
            <circle cx="60" cy="36.5" r="1.5" fill="#ffffff" />
          </>
        )}

        {/* Eyebrows */}
        <path d="M 37 31 Q 41 29 45 32" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M 55 32 Q 59 29 63 31" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Smile */}
        {state === 'thinking' ? (
          <path d="M 46 47 Q 50 46 54 48" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : state === 'surprised' ? (
          <ellipse cx="50" cy="48" rx="3" ry="4" fill="#78350f" />
        ) : (
          // Big cheerful smile
          <path d="M 43 45 Q 50 52 57 45" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Hair Styles */}
        {avatar.hairStyle === 'curly' && (
          <g fill={avatar.hairColor}>
            <circle cx="34" cy="24" r="7" />
            <circle cx="43" cy="21" r="7.5" />
            <circle cx="53" cy="20" r="8" />
            <circle cx="62" cy="22" r="7.5" />
            <circle cx="68" cy="27" r="6" />
            <circle cx="30" cy="30" r="6" />
          </g>
        )}
        {avatar.hairStyle === 'short' && (
          <path
            d="M 31 34 C 31 19, 69 19, 69 34 C 64 26, 36 26, 31 34 Z"
            fill={avatar.hairColor}
          />
        )}
        {avatar.hairStyle === 'cap' && (
          <g>
            <path d="M 30 32 C 30 20, 70 20, 70 32 Z" fill="#ef4444" />
            <ellipse cx="50" cy="32" rx="23" ry="4" fill="#dc2626" />
          </g>
        )}

        {/* Accessories */}
        {avatar.accessory === 'pharaoh_band' && (
          <g>
            <rect x="31" y="27" width="38" height="4.5" fill="#f59e0b" rx="1.5" stroke="#b45309" strokeWidth="0.8" />
            <circle cx="50" cy="26" r="3" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.5" />
          </g>
        )}
        {avatar.accessory === 'explorer_hat' && (
          <g>
            <ellipse cx="50" cy="23" rx="26" ry="6" fill="#a16207" stroke="#713f12" strokeWidth="1" />
            <path d="M 36 23 C 36 12, 64 12, 64 23 Z" fill="#ca8a04" />
            <rect x="36" y="21" width="28" height="3" fill="#713f12" />
          </g>
        )}
        {avatar.accessory === 'flower' && (
          <g transform="translate(62, 22)">
            <circle cx="0" cy="0" r="4" fill="#f43f5e" />
            <circle cx="0" cy="0" r="1.5" fill="#fde047" />
          </g>
        )}
        {avatar.accessory === 'crown' && (
          <path
            d="M 36 26 L 40 18 L 50 24 L 60 18 L 64 26 Z"
            fill="#fbbf24"
            stroke="#d97706"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  );
};
