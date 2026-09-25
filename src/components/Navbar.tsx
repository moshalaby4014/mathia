import React from 'react';
import { PlayerProfile } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { Volume2, VolumeX, Shield, Award, Sparkles, Coins, Star } from 'lucide-react';
import { sound } from '../services/audio';

interface Props {
  profile: PlayerProfile;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenParentGate: () => void;
  onOpenAvatarCustomizer: () => void;
  onOpenCertificates?: () => void;
}

export const Navbar: React.FC<Props> = ({
  profile,
  isMuted,
  onToggleSound,
  onOpenParentGate,
  onOpenAvatarCustomizer,
  onOpenCertificates,
}) => {
  const crystalCount = Object.values(profile.crystals).filter(Boolean).length;
  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <header className="sticky top-0 z-40 bg-amber-100/90 backdrop-blur-md border-b-2 border-amber-300 px-3 sm:px-6 py-2 select-none shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Player Profile Pill */}
        <div
          onClick={() => {
            sound.playSfx('click');
            onOpenAvatarCustomizer();
          }}
          className="flex items-center gap-2.5 bg-white/90 hover:bg-white active:scale-95 border-2 border-amber-300 rounded-full px-2.5 py-1 shadow-sm cursor-pointer transition-transform"
          title="اضغط لتغيير ملابس البطل واسمه"
        >
          <div className="relative">
            <CharacterAvatar avatar={profile.avatar} state="idle" size="sm" />
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.2 border border-white">
              {profile.level}
            </span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
              {profile.name}
            </span>
            {/* XP mini bar */}
            <div className="flex items-center gap-1.5 w-20 sm:w-28 mt-0.5">
              <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden border border-amber-300">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-amber-700">
                {profile.xp}XP
              </span>
            </div>
          </div>
        </div>

        {/* Center: Currencies / Rewards Pills */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Crystals */}
          <div className="flex items-center gap-1 bg-purple-50 border-2 border-purple-200 rounded-full px-2.5 sm:px-3 py-1 text-purple-900 shadow-sm">
            <span className="text-base sm:text-lg animate-pulse">🔮</span>
            <span className="text-xs sm:text-sm font-black">{crystalCount}/9</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 bg-amber-50 border-2 border-amber-200 rounded-full px-2.5 sm:px-3 py-1 text-amber-900 shadow-sm">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-xs sm:text-sm font-black">{profile.stars}</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1 bg-yellow-50 border-2 border-yellow-200 rounded-full px-2.5 sm:px-3 py-1 text-yellow-900 shadow-sm">
            <Coins className="w-4 h-4 text-yellow-600 fill-yellow-400" />
            <span className="text-xs sm:text-sm font-black">{profile.coins}</span>
          </div>

          {/* Royal Medals / Certificates Button */}
          {onOpenCertificates && (
            <button
              onClick={() => {
                sound.playSfx('click');
                onOpenCertificates();
              }}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-200 to-yellow-300 hover:from-amber-300 hover:to-yellow-400 border-2 border-amber-400 rounded-full px-2.5 sm:px-3 py-1 text-amber-950 shadow-sm active:scale-95 transition-all cursor-pointer"
              title="قاعة الأوسمة والشهادات الملكية"
            >
              <Award className="w-4 h-4 text-amber-800" />
              <span className="text-xs sm:text-sm font-black hidden sm:inline">أوسمتي</span>
            </button>
          )}
        </div>

        {/* Right: Controls (Sound toggle, Parent Gate) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playSfx('click');
              onToggleSound();
            }}
            className={`p-2 rounded-full border-2 transition-all ${
              isMuted
                ? 'bg-slate-100 border-slate-300 text-slate-400'
                : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 shadow-sm'
            }`}
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Parent Mode Gate */}
          <button
            onClick={() => {
              sound.playSfx('click');
              onOpenParentGate();
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white rounded-full text-xs font-black shadow transition-all border border-slate-700"
            title="لوحة تحكم ولي الأمر والمعلم"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">ولي الأمر</span>
          </button>
        </div>
      </div>
    </header>
  );
};
