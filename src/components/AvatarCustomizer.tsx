import React, { useState } from 'react';
import { PlayerAvatar, SkinTone, HairStyle, OutfitColor, Gender } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { Sparkles, Check, Smile, User, Palette } from 'lucide-react';
import { sound } from '../services/audio';

interface Props {
  currentAvatar: PlayerAvatar;
  currentName: string;
  onSave: (avatar: PlayerAvatar, name: string) => void;
  onClose: () => void;
}

export const AvatarCustomizer: React.FC<Props> = ({
  currentAvatar,
  currentName,
  onSave,
  onClose,
}) => {
  const [avatar, setAvatar] = useState<PlayerAvatar>({ ...currentAvatar });
  const [name, setName] = useState(currentName || 'بطل النيل');

  const skinTones: { color: SkinTone; label: string }[] = [
    { color: '#ffd8b3', label: 'فاتح' },
    { color: '#f1c27d', label: 'قمحي ذهبي' },
    { color: '#e0ac69', label: 'قمحي أسمر' },
    { color: '#c68642', label: 'برونزي' },
    { color: '#8d5524', label: 'نوبي أصيل' },
  ];

  const hairStyles: { style: HairStyle; label: string }[] = [
    { style: 'curly', label: 'كيرلي مجعد' },
    { style: 'short', label: 'قصير أنيق' },
    { style: 'long', label: 'طويل منسدل' },
    { style: 'braids', label: 'جدائل نيلية' },
    { style: 'cap', label: 'قبعة مرحة' },
  ];

  const outfits: { color: OutfitColor; label: string; bg: string }[] = [
    { color: 'amber', label: 'ذهبي شمس', bg: 'bg-amber-500' },
    { color: 'emerald', label: 'أخضر وادي', bg: 'bg-emerald-500' },
    { color: 'sky', label: 'أزرق نيل', bg: 'bg-sky-500' },
    { color: 'rose', label: 'وردي زهور', bg: 'bg-rose-500' },
    { color: 'purple', label: 'بنفسجي ملكي', bg: 'bg-purple-500' },
  ];

  const accessories: { key: PlayerAvatar['accessory']; label: string; icon: string }[] = [
    { key: 'none', label: 'بدون', icon: '✨' },
    { key: 'pharaoh_band', label: 'عصابة ملكية', icon: '👑' },
    { key: 'explorer_hat', label: 'قبعة مستكشف', icon: '🤠' },
    { key: 'flower', label: 'زهرة اللوتس', icon: '🪷' },
    { key: 'crown', label: 'تاج النجوم', icon: '⭐' },
  ];

  const handleSave = () => {
    sound.playSfx('success');
    onSave(avatar, name.trim() || 'بطل النيل');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-black text-xl">
            <Sparkles className="w-6 h-6 text-yellow-200 animate-spin" />
            <span>تصميم البطل المغامر</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-right">
          {/* Avatar Live Preview */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-2 right-2 text-xs font-bold text-amber-700 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
              معاينة البطل
            </div>
            <CharacterAvatar avatar={avatar} state="celebrate" size="lg" />
            <div className="mt-2 text-base font-black text-slate-800 bg-white px-4 py-1 rounded-full border border-amber-200 shadow-sm">
              {name || 'بطل النيل'}
            </div>
          </div>

          {/* Hero Name Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              اسم البطل الصغير:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك يا بطل..."
              maxLength={15}
              className="w-full px-4 py-2.5 border-2 border-amber-200 focus:border-amber-500 rounded-xl font-bold text-slate-800 outline-none text-right"
            />
          </div>

          {/* Boy / Girl Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              الهيئة:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playSfx('click');
                  setAvatar({ ...avatar, gender: 'boy' });
                }}
                className={`py-2.5 rounded-xl font-black text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                  avatar.gender === 'boy'
                    ? 'border-sky-500 bg-sky-50 text-sky-800 shadow'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>👦 بطل مغامر</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playSfx('click');
                  setAvatar({ ...avatar, gender: 'girl' });
                }}
                className={`py-2.5 rounded-xl font-black text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                  avatar.gender === 'girl'
                    ? 'border-rose-500 bg-rose-50 text-rose-800 shadow'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>👧 بطلة مغامرة</span>
              </button>
            </div>
          </div>

          {/* Skin Tone */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              لون البشرة:
            </label>
            <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              {skinTones.map((st) => (
                <button
                  key={st.color}
                  type="button"
                  onClick={() => {
                    sound.playSfx('click');
                    setAvatar({ ...avatar, skinTone: st.color });
                  }}
                  style={{ backgroundColor: st.color }}
                  className={`w-10 h-10 rounded-full border-2 transition-transform ${
                    avatar.skinTone === st.color
                      ? 'scale-115 border-amber-600 shadow-md ring-2 ring-amber-400'
                      : 'border-slate-300'
                  }`}
                  title={st.label}
                />
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              تسريحة الشعر:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {hairStyles.map((hs) => (
                <button
                  key={hs.style}
                  type="button"
                  onClick={() => {
                    sound.playSfx('click');
                    setAvatar({ ...avatar, hairStyle: hs.style });
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border-2 transition-all text-center ${
                    avatar.hairStyle === hs.style
                      ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {hs.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outfit Color */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              لون الزي:
            </label>
            <div className="flex items-center gap-2">
              {outfits.map((of) => (
                <button
                  key={of.color}
                  type="button"
                  onClick={() => {
                    sound.playSfx('click');
                    setAvatar({ ...avatar, outfitColor: of.color });
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                    of.bg
                  } ${
                    avatar.outfitColor === of.color
                      ? 'ring-4 ring-amber-300 scale-105 shadow'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {of.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Accessory */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              إكسسوار البطل:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {accessories.map((acc) => (
                <button
                  key={acc.key}
                  type="button"
                  onClick={() => {
                    sound.playSfx('click');
                    setAvatar({ ...avatar, accessory: acc.key });
                  }}
                  className={`p-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                    avatar.accessory === acc.key
                      ? 'border-amber-500 bg-amber-50 text-amber-950 font-black'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{acc.icon}</span>
                  <span>{acc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-100"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="game-btn-primary px-6 py-2.5 rounded-xl font-black text-white text-base flex items-center gap-2 shadow"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>حفظ البطل</span>
          </button>
        </div>
      </div>
    </div>
  );
};
