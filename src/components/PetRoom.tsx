import React, { useState } from 'react';
import { PlayerProfile, Pet } from '../types/game';
import { PETS_CATALOG } from '../services/curriculum';
import { sound } from '../services/audio';
import { storage } from '../services/storage';
import { Sparkles, Heart, Check, Coins, Utensils } from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
}

export const PetRoom: React.FC<Props> = ({ profile, onUpdateProfile }) => {
  const [petHappy, setPetHappy] = useState<string | null>(null);

  const handleSelectPet = (petId: string) => {
    sound.playSfx('pop');
    const updated: PlayerProfile = {
      ...profile,
      activePetId: petId,
    };
    storage.saveProfile(updated);
    onUpdateProfile(updated);
  };

  const handleUnlockPet = (pet: Pet) => {
    if (profile.coins < pet.cost) {
      sound.playSfx('error');
      return;
    }
    sound.playSfx('sparkle');
    const updated: PlayerProfile = {
      ...profile,
      coins: profile.coins - pet.cost,
      unlockedPets: [...profile.unlockedPets, pet.id],
      activePetId: pet.id,
    };
    storage.saveProfile(updated);
    onUpdateProfile(updated);
  };

  const handleFeedPet = (petId: string) => {
    sound.playSfx('success');
    setPetHappy(petId);
    setTimeout(() => setPetHappy(null), 2000);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-130px)] pb-24 p-3 sm:p-6 flex flex-col items-center select-none">
      <div className="w-full max-w-4xl text-right mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-amber-950 flex items-center gap-2">
          <span>أصدقائي الحيوانات الأليفة</span>
          <span className="text-2xl">🐾</span>
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-500">
          اختر رفيقك اللطيف الذي يرافقك في استعادة بلورات مملكة الأرقام!
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {PETS_CATALOG.map((pet) => {
          const isUnlocked = profile.unlockedPets.includes(pet.id);
          const isActive = profile.activePetId === pet.id;
          const isFeeding = petHappy === pet.id;

          return (
            <div
              key={pet.id}
              className={`rounded-3xl p-5 border-3 transition-all flex flex-col justify-between text-right relative overflow-hidden ${
                isActive
                  ? 'bg-amber-50 border-amber-400 shadow-lg ring-3 ring-amber-300'
                  : isUnlocked
                  ? 'bg-white border-slate-200 hover:border-amber-300 shadow-md'
                  : 'bg-slate-50 border-slate-300 opacity-80'
              }`}
            >
              {/* Pet Top Badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => isUnlocked && handleFeedPet(pet.id)}
                    className="w-20 h-20 rounded-2xl bg-amber-100/60 border-2 border-amber-300 flex items-center justify-center text-5xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    title="اضغط لإطعام وملاعبة الحيوان!"
                  >
                    <span className={isFeeding ? 'animate-bounce' : 'animate-float'}>
                      {pet.icon}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-800">
                      {pet.nameAr}
                    </h3>
                    <div className="text-xs font-bold text-amber-700">
                      {pet.animalAr}
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                {isActive && (
                  <span className="bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>رفيقك الحالي</span>
                  </span>
                )}
              </div>

              {/* Feeding heart popup */}
              {isFeeding && (
                <div className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full my-2 text-center animate-pulse">
                  شبعان وسعيد جداً بفضلك! ❤️ ✨
                </div>
              )}

              {/* Description */}
              <p className="text-xs font-bold text-slate-600 my-3 leading-relaxed">
                {pet.descriptionAr}
              </p>

              {/* Bottom Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {isUnlocked ? (
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => handleFeedPet(pet.id)}
                      className="flex-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs flex items-center justify-center gap-1.5 border border-rose-200"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>إطعام وملاعبة</span>
                    </button>

                    {!isActive && (
                      <button
                        onClick={() => handleSelectPet(pet.id)}
                        className="game-btn-primary flex-1 py-2 rounded-xl text-white font-black text-xs shadow"
                      >
                        اختيار كرفيق
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="text-xs font-black text-amber-900 flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-600 fill-yellow-400" />
                      <span>{pet.cost} عملة ذهبية</span>
                    </div>

                    <button
                      onClick={() => handleUnlockPet(pet)}
                      disabled={profile.coins < pet.cost}
                      className={`px-4 py-2 rounded-xl font-black text-xs shadow flex items-center gap-1 ${
                        profile.coins >= pet.cost
                          ? 'game-btn-success text-white'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>فتح الرفيق</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
