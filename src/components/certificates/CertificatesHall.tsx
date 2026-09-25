import React, { useState } from 'react';
import { PlayerProfile, RoyalCertificate } from '../../types/game';
import { certificatesService, ROYAL_CERTIFICATES } from '../../services/certificatesService';
import { CertificateModal } from './CertificateModal';
import { CharacterAvatar } from '../CharacterAvatar';
import { sound } from '../../services/audio';
import {
  Award,
  Sparkles,
  Lock,
  Printer,
  Download,
  CheckCircle2,
  Star,
  ChevronLeft,
  Flame,
  Crown,
} from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
  onReturnToMap: () => void;
}

export const CertificatesHall: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  onReturnToMap,
}) => {
  const [selectedCert, setSelectedCert] = useState<RoyalCertificate | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'worlds' | 'mastery' | 'unlocked'>('all');

  const unlockedCerts = certificatesService.getUnlockedCertificates(profile);
  const totalCount = ROYAL_CERTIFICATES.length;
  const unlockedCount = unlockedCerts.length;
  const unlockedPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredCerts = ROYAL_CERTIFICATES.filter((cert) => {
    if (activeFilter === 'unlocked') return cert.isUnlocked(profile);
    if (activeFilter === 'worlds') return cert.category === 'world';
    if (activeFilter === 'mastery') return cert.category === 'mastery' || cert.category === 'royal_honor';
    return true;
  });

  const handleOpenCertificate = (cert: RoyalCertificate) => {
    sound.playSfx('sparkle');
    setSelectedCert(cert);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-130px)] pb-24 p-3 sm:p-6 flex flex-col items-center select-none">
      {/* Selected Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          profile={profile}
          onClose={() => setSelectedCert(null)}
          onUpdateName={(newName) => {
            const updated = { ...profile, name: newName };
            onUpdateProfile(updated);
          }}
        />
      )}

      {/* Royal Hall Header Banner */}
      <div className="w-full max-w-5xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl border-4 border-amber-300 relative overflow-hidden mb-6">
        {/* Subtle decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-black/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 text-right">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 flex items-center justify-center text-4xl sm:text-5xl shadow-inner">
              📜
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-900/40 px-3 py-0.5 rounded-full text-xs font-black text-amber-200 mb-1">
                <Crown className="w-3.5 h-3.5 text-yellow-300" />
                <span>قاعة التكريم الملكي والفخر</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                أوسمة وشهادات التقدير الملكية
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 font-bold max-w-xl">
                كل مسألة تحلها تقربك من التتويج! اطبع شهاداتك وعلقها في غرفتك، أو نزّلها وافرح مع عائلتك!
              </p>
            </div>
          </div>

          {/* Player Progress Snapshot */}
          <div className="bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-2xl p-3 sm:p-4 text-center min-w-[200px] shadow-sm">
            <div className="text-xs font-bold text-amber-100">أوسمتك المستحقة</div>
            <div className="text-2xl sm:text-3xl font-black text-yellow-200 my-0.5">
              {unlockedCount} / {totalCount}
            </div>
            {/* Progress bar */}
            <div className="w-full h-2.5 bg-amber-900/40 rounded-full overflow-hidden mt-1 border border-amber-300/40">
              <div
                className="h-full bg-gradient-to-r from-yellow-300 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${unlockedPercent}%` }}
              />
            </div>
            <div className="text-[10px] font-black text-amber-100 mt-1">
              {unlockedPercent}% من مجد المملكة
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-2 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5 bg-amber-100/80 p-1.5 rounded-2xl border border-amber-300 shadow-sm">
          <button
            onClick={() => {
              sound.playSfx('click');
              setActiveFilter('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeFilter === 'all'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-950 hover:bg-amber-200/60'
            }`}
          >
            الكل ({totalCount})
          </button>
          <button
            onClick={() => {
              sound.playSfx('click');
              setActiveFilter('unlocked');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1 ${
              activeFilter === 'unlocked'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>المكتسبة ({unlockedCount})</span>
          </button>
          <button
            onClick={() => {
              sound.playSfx('click');
              setActiveFilter('worlds');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeFilter === 'worlds'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-950 hover:bg-amber-200/60'
            }`}
          >
            أوسمة الفصول
          </button>
          <button
            onClick={() => {
              sound.playSfx('click');
              setActiveFilter('mastery');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeFilter === 'mastery'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-950 hover:bg-amber-200/60'
            }`}
          >
            أوسمة التميز الكبرى
          </button>
        </div>

        {/* Back to Map Button */}
        <button
          onClick={() => {
            sound.playSfx('click');
            onReturnToMap();
          }}
          className="px-4 py-2 bg-white hover:bg-amber-50 text-amber-900 border-2 border-amber-300 rounded-2xl text-xs sm:text-sm font-black shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>العودة للخريطة</span>
        </button>
      </div>

      {/* Grid of Certificates & Medals */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCerts.map((cert) => {
          const isUnlocked = cert.isUnlocked(profile);

          return (
            <div
              key={cert.id}
              onClick={() => handleOpenCertificate(cert)}
              className={`relative rounded-3xl border-3 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between p-5 ${
                isUnlocked
                  ? 'bg-white border-amber-400 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-amber-500'
                  : 'bg-amber-50/70 border-slate-300 opacity-80 hover:opacity-100 hover:border-amber-400'
              }`}
            >
              {/* Top Card Bar: Badge + Status Tag */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  {/* Badge Icon circle */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2 ${
                      isUnlocked
                        ? `bg-gradient-to-br ${cert.badgeBg} text-white border-amber-300 shadow`
                        : 'bg-slate-200 text-slate-400 border-slate-300'
                    }`}
                  >
                    {cert.icon}
                  </div>

                  {/* Status Pill */}
                  {isUnlocked ? (
                    <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>مكتسبة وجاهزة</span>
                    </span>
                  ) : (
                    <span className="bg-slate-100 border border-slate-300 text-slate-600 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>قيد التحدي</span>
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-base sm:text-lg font-black text-amber-950 mb-1 leading-snug">
                  {cert.titleAr}
                </h3>
                <p className="text-xs font-bold text-amber-800/80 mb-2">
                  {cert.subtitleAr}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-bold">
                  {cert.descriptionAr}
                </p>
              </div>

              {/* Bottom Card Footer: Action / Requirement */}
              <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-between gap-2">
                {isUnlocked ? (
                  <>
                    <div className="flex items-center gap-1 text-[11px] font-black text-amber-800">
                      <Printer className="w-3.5 h-3.5 text-amber-600" />
                      <span>طباعة وتنزيل A4</span>
                    </div>

                    <button className="game-btn-primary px-3 py-1.5 rounded-xl text-white font-black text-xs shadow flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>عرض الشهادة</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span className="truncate max-w-[200px]" title={cert.requiredConditionAr}>
                      🎯 {cert.requiredConditionAr}
                    </span>
                    <button className="text-xs font-black text-amber-700 hover:text-amber-900 underline">
                      معاينة
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
