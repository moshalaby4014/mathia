import React, { useState } from 'react';
import { PlayerProfile, HomeItem } from '../types/game';
import { HOME_ITEMS_CATALOG, PETS_CATALOG } from '../services/curriculum';
import { certificatesService } from '../services/certificatesService';
import { CharacterAvatar } from './CharacterAvatar';
import { sound } from '../services/audio';
import { storage } from '../services/storage';
import { Sparkles, ShoppingBag, Check, Plus, Coins, Trophy, Award } from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
  onOpenCertificates?: () => void;
}

export const PlayerHome: React.FC<Props> = ({ profile, onUpdateProfile, onOpenCertificates }) => {
  const [shopOpen, setShopOpen] = useState(false);

  const activePet = PETS_CATALOG.find((p) => p.id === profile.activePetId) || PETS_CATALOG[0];
  const unlockedCertCount = certificatesService.getUnlockedCertificates(profile).length;

  const handleBuyItem = (item: HomeItem) => {
    if (profile.coins < item.cost) {
      sound.playSfx('error');
      return;
    }

    sound.playSfx('coin');
    const updated: PlayerProfile = {
      ...profile,
      coins: profile.coins - item.cost,
      homeItems: [...profile.homeItems, item.id],
    };

    storage.saveProfile(updated);
    onUpdateProfile(updated);
  };

  const isOwned = (itemId: string) => profile.homeItems.includes(itemId);

  const crystalCount = Object.values(profile.crystals).filter(Boolean).length;

  return (
    <div className="relative w-full min-h-[calc(100vh-130px)] pb-24 p-3 sm:p-6 flex flex-col items-center select-none">
      {/* Home Header */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-3 mb-4">
        <div className="text-right">
          <h1 className="text-2xl sm:text-3xl font-black text-amber-950 flex items-center gap-2">
            <span>بيتي الدافئ على ضفاف النيل</span>
            <span className="text-xl">🏡</span>
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            زيّن غرفتك بالأثاث والتحف التي كسبتها من مغامراتك!
          </p>
        </div>

        <button
          onClick={() => {
            sound.playSfx('click');
            setShopOpen(!shopOpen);
          }}
          className="game-btn-primary px-4 py-2 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{shopOpen ? 'إغلاق المتجر' : 'متجر الأثاث'}</span>
        </button>
      </div>

      {/* Main Room Viewport */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 rounded-3xl border-4 border-amber-300 shadow-2xl p-6 min-h-[420px] sm:min-h-[480px] overflow-hidden flex flex-col justify-between">
        {/* Nile Window */}
        <div className="absolute top-4 left-6 w-32 sm:w-44 h-24 sm:h-32 rounded-t-full border-4 border-amber-800 bg-sky-200 shadow-inner overflow-hidden flex items-end justify-center pointer-events-none">
          <div className="w-full h-8 bg-sky-400 opacity-80" />
          <span className="absolute bottom-6 text-2xl">⛵</span>
          <span className="absolute bottom-8 right-2 text-xl">🌴</span>
        </div>

        {/* Room Wall Decorations */}
        <div className="flex items-start justify-end gap-3 sm:gap-4 z-10">
          {/* Royal Wall Frame for Certificates */}
          <div
            onClick={() => {
              sound.playSfx('sparkle');
              if (onOpenCertificates) onOpenCertificates();
            }}
            className="bg-gradient-to-br from-amber-100 to-yellow-200 border-2 border-amber-400 p-2 rounded-2xl shadow-md text-center cursor-pointer hover:scale-105 active:scale-95 transition-all group"
            title="لوحة الأوسمة والشهادات الملكية"
          >
            <div className="relative inline-block">
              <span className="text-3xl">📜</span>
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] font-black rounded-full px-1 shadow">
                {unlockedCertCount}
              </span>
            </div>
            <div className="text-[10px] font-black text-amber-950 group-hover:text-amber-700">
              أوسمتي ({unlockedCertCount})
            </div>
          </div>

          {isOwned('papyrus_map') && (
            <div className="bg-amber-100 border-2 border-amber-400 p-2 rounded-xl shadow text-center rotate-3">
              <span className="text-3xl">🗺️</span>
              <div className="text-[10px] font-black text-amber-900">خريطة البردي</div>
            </div>
          )}

          {isOwned('crystal_stand') && (
            <div className="bg-purple-50 border-2 border-purple-300 p-2 rounded-xl shadow text-center -rotate-2">
              <span className="text-3xl animate-pulse">🔮</span>
              <div className="text-[10px] font-black text-purple-900">بلورات ({crystalCount}/9)</div>
            </div>
          )}
        </div>

        {/* Room Floor Stage */}
        <div className="relative z-10 flex items-end justify-between gap-4 mt-16 pt-8 border-b-8 border-amber-900/30">
          {/* Left: Bed & Plant */}
          <div className="flex items-end gap-3">
            {isOwned('cozy_bed') && (
              <div className="text-5xl sm:text-6xl filter drop-shadow">🛏️</div>
            )}
            {isOwned('plant_pot') && (
              <div className="text-4xl sm:text-5xl filter drop-shadow">🪴</div>
            )}
            {isOwned('telescope') && (
              <div className="text-4xl sm:text-5xl filter drop-shadow">🔭</div>
            )}
          </div>

          {/* Center: Hero Avatar & Companion Pet */}
          <div className="flex flex-col items-center">
            <div className="flex items-end gap-4">
              <CharacterAvatar avatar={profile.avatar} state="celebrate" size="lg" />

              {/* Active Pet Companion */}
              <div
                onClick={() => sound.playSfx('sparkle')}
                className="cursor-pointer text-4xl sm:text-5xl animate-bounce filter drop-shadow hover:scale-110 transition-transform"
                title={`صديقك: ${activePet.nameAr}`}
              >
                {activePet.icon}
              </div>
            </div>
            <span className="text-xs sm:text-sm font-black text-amber-950 bg-white/90 px-3 py-0.5 rounded-full border border-amber-300 shadow mt-2">
              {profile.name} و{activePet.nameAr}
            </span>
          </div>

          {/* Right: Desk & Treasure Chest */}
          <div className="flex items-end gap-3">
            {isOwned('pharaoh_chest') && (
              <div className="text-4xl sm:text-5xl filter drop-shadow animate-pulse">💎</div>
            )}
            {isOwned('desk') && (
              <div className="text-5xl sm:text-6xl filter drop-shadow">🪑</div>
            )}
          </div>
        </div>

        {/* Floor Plank Pattern */}
        <div className="w-full h-12 bg-amber-800/20 rounded-b-2xl flex items-center justify-around opacity-40">
          <div className="w-full border-t border-amber-900/30" />
        </div>
      </div>

      {/* Furniture Store Modal Drawer */}
      {shopOpen && (
        <div className="w-full max-w-4xl mt-6 bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-5 text-right space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full font-black text-xs sm:text-sm">
              <Coins className="w-4 h-4 text-yellow-600 fill-yellow-400" />
              <span>رصيدك: {profile.coins} عملة ذهبية</span>
            </div>
            <h3 className="text-lg font-black text-amber-950">
              متجر أثاث المغامر الصغير
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {HOME_ITEMS_CATALOG.map((item) => {
              const owned = isOwned(item.id);
              const canAfford = profile.coins >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-3.5 border-2 text-center flex flex-col items-center justify-between min-h-[140px] ${
                    owned
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="text-4xl mb-1">{item.icon}</div>
                  <div className="text-xs font-black text-slate-800">
                    {item.nameAr}
                  </div>

                  <div className="w-full mt-2">
                    {owned ? (
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>مملوك</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={!canAfford}
                        className={`w-full py-1.5 rounded-xl font-black text-xs flex items-center justify-center gap-1 shadow-sm transition-all ${
                          canAfford
                            ? 'game-btn-primary text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5 fill-current" />
                        <span>{item.cost} عملة</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
