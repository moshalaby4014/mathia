import React from 'react';
import { ActiveScreen } from '../types/game';
import { Map, Home, PawPrint, Sparkles, Award } from 'lucide-react';
import { sound } from '../services/audio';

interface Props {
  currentScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
}

export const BottomNav: React.FC<Props> = ({ currentScreen, onSelectScreen }) => {
  const navItems: { id: ActiveScreen; labelAr: string; icon: React.ReactNode }[] = [
    { id: 'map', labelAr: 'الخريطة', icon: <Map className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { id: 'teaching', labelAr: 'المختبر', icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 animate-pulse" /> },
    { id: 'certificates', labelAr: 'أوسمتي 📜', icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" /> },
    { id: 'home', labelAr: 'بيتي', icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { id: 'pets', labelAr: 'أصدقائي', icon: <PawPrint className="w-5 h-5 sm:w-6 sm:h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-3 border-amber-300 py-1.5 px-4 shadow-lg select-none">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playSfx('click');
                onSelectScreen(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-amber-700 font-black scale-105 bg-amber-100/70 border border-amber-300 shadow-sm'
                  : 'text-slate-500 hover:text-amber-600 font-bold opacity-80'
              }`}
            >
              <div className="transform transition-transform active:scale-90">
                {item.icon}
              </div>
              <span className="text-xs sm:text-sm mt-0.5">{item.labelAr}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
