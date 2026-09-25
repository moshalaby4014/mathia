import React, { useState, useEffect } from 'react';
import { RoyalCertificate, RoyalSealType, PlayerProfile } from '../../types/game';
import {
  certificatesService,
  ROYAL_SEALS,
  HONORARY_TITLES,
  PRAISE_PRESETS,
} from '../../services/certificatesService';
import { CharacterAvatar } from '../CharacterAvatar';
import { sound } from '../../services/audio';
import confetti from 'canvas-confetti';
import {
  Printer,
  Download,
  Share2,
  Sparkles,
  X,
  Edit3,
  Check,
  Award,
  Crown,
  Copy,
  Calendar,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  certificate: RoyalCertificate;
  profile: PlayerProfile;
  onClose: () => void;
  onUpdateName?: (newName: string) => void;
}

export const CertificateModal: React.FC<Props> = ({
  certificate,
  profile,
  onClose,
  onUpdateName,
}) => {
  const [childName, setChildName] = useState(profile.name || 'بطل الرياضيات');
  const [isEditingName, setIsEditingName] = useState(false);
  const [honoraryTitle, setHonoraryTitle] = useState(HONORARY_TITLES[0]);
  const [selectedSeal, setSelectedSeal] = useState<RoyalSealType>(certificate.sealDefault);
  const [praiseText, setPraiseText] = useState(certificate.citationAr);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Formatted Egyptian Arabic Date
  const todayArabic = new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // Trigger celebration on mount
  useEffect(() => {
    sound.playSfx('fanfare');
    triggerConfetti();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
    });
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      sound.playSfx('sparkle');
      await certificatesService.exportCertificateAsImage({
        certificate,
        childName,
        honoraryTitle,
        seal: selectedSeal,
        praiseText,
        dateText: todayArabic,
      });
      triggerConfetti();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    sound.playSfx('click');
    window.print();
  };

  const handleShare = async () => {
    const shareMessage = `🌟 إنجاز ملكي عظيم! 🌟\nالبطل "${childName}" حصل على "${certificate.titleAr}" في تطبيق مملكة الرياضيات للصف الثاني الابتدائي!\nنحن فخورون جداً بذكائه وتفوقه! 🏆👏`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareMessage);
      setCopySuccess(true);
      sound.playSfx('success');
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  const currentSeal = certificatesService.getSealInfo(selectedSeal);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:border-none print:shadow-none print:w-full print:max-w-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">📜</span>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight">
                أستوديو الشهادات والأوسمة الملكية
              </h2>
              <p className="text-xs text-amber-100 font-bold">
                خصّص الشهادة باسمك واطبعها أو نزّلها فوراً كصورة فخرية!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playSfx('fanfare');
                triggerConfetti();
              }}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 rounded-xl text-xs font-black flex items-center gap-1 shadow transition-transform"
              title="إطلاق احتفال"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>احتفال</span>
            </button>

            <button
              onClick={() => {
                sound.playSfx('click');
                onClose();
              }}
              className="p-1.5 bg-amber-800/80 hover:bg-amber-900 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Center: Live Certificate Preview + Customization options */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 print:overflow-visible print:p-0">
          {/* Certificate Container with Print-Specific Class */}
          <div
            id="royal-printable-diploma"
            className="printable-certificate relative w-full bg-[#fffdf5] border-[10px] border-double border-amber-600 rounded-2xl shadow-xl p-5 sm:p-8 flex flex-col justify-between text-center overflow-hidden mx-auto print:border-[8px] print:rounded-none print:shadow-none print:w-full print:h-screen print:p-6"
            style={{ minHeight: '520px' }}
          >
            {/* Ornate Corner Elements */}
            <div className="absolute top-2 left-2 text-amber-600 text-xl font-black pointer-events-none select-none">
              ❖
            </div>
            <div className="absolute top-2 right-2 text-amber-600 text-xl font-black pointer-events-none select-none">
              ❖
            </div>
            <div className="absolute bottom-2 left-2 text-amber-600 text-xl font-black pointer-events-none select-none">
              ❖
            </div>
            <div className="absolute bottom-2 right-2 text-amber-600 text-xl font-black pointer-events-none select-none">
              ❖
            </div>

            {/* Subtle background royal watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <span className="text-[200px]">👑</span>
            </div>

            {/* Inner Gold Inset Frame */}
            <div className="absolute inset-3 border-2 border-amber-300 rounded-xl pointer-events-none" />

            {/* Header / Republic & Kingdom Ribbon */}
            <div className="relative z-10 space-y-1">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 border border-amber-400 px-4 py-1 rounded-full text-amber-900 text-xs sm:text-sm font-black shadow-sm">
                <span>👑</span>
                <span>مملكة الرياضيات السعيدة - جمهورية مصر العربية</span>
                <span>👑</span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-amber-800">
                منهاج الصف الثاني الابتدائي • التميز والتفوق الحسابي
              </p>
            </div>

            {/* Main Title Section */}
            <div className="relative z-10 my-2">
              <div className="text-3xl sm:text-5xl font-black text-amber-950 tracking-wide filter drop-shadow-sm font-arabic">
                شهادة تقدير وتفوق ملكية
              </div>
              <div className="inline-flex items-center gap-2 mt-1 text-sm sm:text-lg font-black text-amber-800 bg-amber-100/70 border border-amber-300 px-4 py-0.5 rounded-full">
                <span>{certificate.icon}</span>
                <span>{certificate.titleAr}</span>
              </div>
            </div>

            {/* Awarded To Child Section */}
            <div className="relative z-10 my-3 space-y-1.5">
              <div className="text-xs sm:text-sm font-bold text-slate-600">
                تَمنح مملكة الرياضيات هذه الشهادة الفخرية بكل فخر واعتزاز إلى:
              </div>

              {/* Child Name with quick editing */}
              <div className="flex items-center justify-center gap-2">
                <div className="bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-100 border-2 border-amber-400 py-1.5 px-6 rounded-2xl shadow-inner flex items-center gap-3">
                  <span className="text-2xl sm:text-4xl font-black text-amber-950 tracking-wider">
                    {childName}
                  </span>
                  <button
                    onClick={() => {
                      sound.playSfx('click');
                      setIsEditingName(!isEditingName);
                    }}
                    className="p-1 text-amber-700 hover:text-amber-900 transition-colors print:hidden"
                    title="تعديل الاسم"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Honorary Title Badge */}
              <div className="inline-block bg-amber-500 text-white text-xs sm:text-sm font-black px-4 py-1 rounded-full shadow-sm">
                ✨ {honoraryTitle} ✨
              </div>
            </div>

            {/* Praise & Citation Body */}
            <div className="relative z-10 max-w-2xl mx-auto my-2 text-xs sm:text-base font-bold text-slate-800 leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-200">
              {praiseText}
            </div>

            {/* Signatures & Official Wax Seal Bar */}
            <div className="relative z-10 mt-4 pt-3 border-t-2 border-dashed border-amber-300 grid grid-cols-3 items-end gap-2 text-center">
              {/* Right: Companion Miro */}
              <div className="flex flex-col items-center">
                <div className="text-lg sm:text-xl">🐾</div>
                <div className="text-xs sm:text-sm font-black text-amber-950">
                  المرشد الحكيم ميرو
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500">
                  حارس واحة المعرفة
                </div>
                <div className="w-24 sm:w-32 h-0.5 bg-amber-600 mt-1" />
              </div>

              {/* Center: Royal Wax Seal & Medal */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Ribbon tails */}
                  <div className="absolute -bottom-2 -left-2 w-4 h-8 bg-red-700 transform rotate-12 rounded-sm" />
                  <div className="absolute -bottom-2 -right-2 w-4 h-8 bg-red-700 transform -rotate-12 rounded-sm" />

                  {/* Wax Seal Circle */}
                  <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-4 border-amber-300 shadow-lg flex flex-col items-center justify-center text-white">
                    <span className="text-xl sm:text-2xl">{currentSeal.icon}</span>
                    <span className="text-[8px] sm:text-[9px] font-black mt-0.5 text-amber-200">
                      {currentSeal.mottoAr}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-red-900 mt-1">
                  الختم الملكي المعتمد
                </span>
              </div>

              {/* Left: Parent / Teacher */}
              <div className="flex flex-col items-center">
                <div className="text-lg sm:text-xl">✍️</div>
                <div className="text-xs sm:text-sm font-black text-amber-950">
                  ولي الأمر / المعلم
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500">
                  تاريخ: {todayArabic}
                </div>
                <div className="w-24 sm:w-32 h-0.5 bg-amber-600 mt-1" />
              </div>
            </div>
          </div>

          {/* Quick Editing Toolbar (Name input popup if editing) */}
          {isEditingName && (
            <div className="p-3 bg-amber-100 border-2 border-amber-300 rounded-2xl flex flex-wrap items-center gap-2 justify-between animate-fade-in print:hidden">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <label className="text-xs font-black text-amber-900 whitespace-nowrap">
                  اسم البطل:
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  maxLength={30}
                  className="flex-1 bg-white border border-amber-400 rounded-xl px-3 py-1.5 text-sm font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="اكتب اسم البطل هنا..."
                />
              </div>
              <button
                onClick={() => {
                  sound.playSfx('success');
                  setIsEditingName(false);
                  if (onUpdateName && childName.trim()) {
                    onUpdateName(childName.trim());
                  }
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center gap-1 shadow"
              >
                <Check className="w-3.5 h-3.5" />
                <span>حفظ الاسم</span>
              </button>
            </div>
          )}

          {/* Interactive Customization Studio Section (Seals, Titles, Praise) - Hidden in Print */}
          <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 space-y-3.5 shadow-sm print:hidden">
            <h3 className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>تخصيص تفاصيل الشهادة الملكية</span>
            </h3>

            {/* 1. Choose Seal */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                اختر الختم الملكي:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ROYAL_SEALS.map((seal) => {
                  const isSelected = selectedSeal === seal.id;
                  return (
                    <button
                      key={seal.id}
                      onClick={() => {
                        sound.playSfx('click');
                        setSelectedSeal(seal.id);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 shadow-sm scale-105'
                          : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl">{seal.icon}</span>
                      <span className="text-[10px] font-black text-slate-800 mt-0.5 truncate w-full text-center">
                        {seal.nameAr.replace('ختم ', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Choose Honorary Title */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                اختر اللقب الفخري للبطل:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {HONORARY_TITLES.map((title) => {
                  const isSelected = honoraryTitle === title;
                  return (
                    <button
                      key={title}
                      onClick={() => {
                        sound.playSfx('click');
                        setHonoraryTitle(title);
                      }}
                      className={`text-xs font-black px-3 py-1 rounded-full border transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-white border-amber-600 shadow'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      {title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Choose Praise Preset */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                عبارة الثناء والتقدير:
              </label>
              <div className="space-y-1.5">
                {PRAISE_PRESETS.map((preset, idx) => {
                  const isSelected = praiseText === preset;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.playSfx('click');
                        setPraiseText(preset);
                      }}
                      className={`w-full text-right p-2 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 text-amber-950 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50/50'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar (Hidden when printing) */}
        <div className="p-3 sm:p-4 bg-white border-t-2 border-amber-200 flex flex-wrap items-center justify-between gap-2 shadow-lg print:hidden">
          <div className="flex items-center gap-2">
            {/* Download High-Res PNG Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="game-btn-primary px-4 sm:px-6 py-2.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'جاري التحضير...' : 'تنزيل كصورة (PNG)'}</span>
            </button>

            {/* Print Real Button */}
            <button
              onClick={handlePrint}
              className="game-btn-blue px-4 sm:px-6 py-2.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة فورية (A4)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Share / Copy WhatsApp Praise */}
            <button
              onClick={handleShare}
              className="px-3 sm:px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
            >
              {copySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copySuccess ? 'تم النسخ للمشاركة!' : 'مشاركة الإنجاز 📲'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                sound.playSfx('click');
                onClose();
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs sm:text-sm transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
