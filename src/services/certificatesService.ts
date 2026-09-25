import { RoyalCertificate, RoyalSealType, PlayerProfile } from '../types/game';

export interface RoyalSealInfo {
  id: RoyalSealType;
  nameAr: string;
  icon: string;
  color: string;
  mottoAr: string;
}

export const ROYAL_SEALS: RoyalSealInfo[] = [
  {
    id: 'horus',
    nameAr: 'ختم صقر حورس الحارس',
    icon: '🦅',
    color: '#d97706',
    mottoAr: 'حكمة ويقظة',
  },
  {
    id: 'lion',
    nameAr: 'ختم الأسد الملكي',
    icon: '🦁',
    color: '#b45309',
    mottoAr: 'شجاعة وقوة',
  },
  {
    id: 'pyramid',
    nameAr: 'ختم هرم التميز الذهبي',
    icon: '🔺',
    color: '#ca8a04',
    mottoAr: 'بناء راسخ',
  },
  {
    id: 'star',
    nameAr: 'ختم النجمة الساطعة',
    icon: '⭐',
    color: '#eab308',
    mottoAr: 'ذكاء وتفوق',
  },
  {
    id: 'lotus',
    nameAr: 'ختم زهرة اللوتس النيلية',
    icon: '🪷',
    color: '#059669',
    mottoAr: 'إبداع ونقاء',
  },
  {
    id: 'crown',
    nameAr: 'ختم التاج الملكي',
    icon: '👑',
    color: '#7c3aed',
    mottoAr: 'فارس المملكة',
  },
];

export const HONORARY_TITLES = [
  'فارس الرياضيات والذكاء 🌟',
  'أمير الحساب الصغير 👑',
  'أميرة النيل العبقرية 🪷',
  'بطل الصف الثاني الابتدائي 🏆',
  'مستكشف المسائل البارع 🔍',
  'صقر النيل المتفوق 🦅',
];

export const PRAISE_PRESETS = [
  'تقديراً لتفوقه الباهر وسرعة بديهته في حل المسائل الحسابية ومساعدة أهل المملكة.',
  'اعتزازاً بذكائه المتوقد وحرصه الدائم على إتقان مهارات الرياضيات خطوة بخطوة.',
  'تتويجاً لشجاعته ومثابرته العالية في اجتياز أصعب التحديات بكل براعة وإتقان.',
  'فخراً بإنجازه العظيم ورفع راية العلم والنور والنجاح على ضفاف النيل الخالد.',
];

export const ROYAL_CERTIFICATES: RoyalCertificate[] = [
  {
    id: 'cert_forest',
    worldId: 'forest',
    category: 'world',
    titleAr: 'وسام حارس النيل ومستكشف البيانات',
    shortTitleAr: 'وسام البيانات والرسوم البيانية',
    subtitleAr: 'شهادة تفوق وإتقان قراءة الجداول والمدرج التكراري بالأعمدة',
    descriptionAr: 'تُمنح هذه الشهادة للبطل لبراعته في جمع البيانات وتمثيلها بالأعمدة ومقارنة الفئات وتحليلها بدقة.',
    citationAr: 'تقديراً لإتقانه الرائع لمفاهيم الرسوم البيانية والجداول، وبراعته في قراءة الأعمدة البيانية وتحديد الأكثر والأقل بدقة متناهية.',
    icon: '📊',
    sealDefault: 'lotus',
    badgeBg: 'from-emerald-500 to-teal-700',
    ribbonColor: '#059669',
    borderTheme: 'emerald',
    requiredConditionAr: 'استعادة بلورة البيانات الخضراء أو إتمام غابة البيانات',
    isUnlocked: (profile: PlayerProfile) =>
      profile.crystals.forest || profile.unlockedWorlds.includes('forest'),
  },
  {
    id: 'cert_addition',
    worldId: 'addition',
    category: 'world',
    titleAr: 'شهادة فارس الجمع السريع والجسور الذهبية',
    shortTitleAr: 'شهادة الجمع الرأسي',
    subtitleAr: 'شهادة إتقان الجمع الرأسي وإعادة التسمية حتى 100',
    descriptionAr: 'تُمنح للبطل لبراعته في ترميم جسور وادي الأرقام بجمع الأعداد الرأسية بالخوارزمية المعيارية بدقة وسرعة.',
    citationAr: 'تقديراً لسرعة بديهته وشجاعته في تجميع الآحاد والعشرات وإعادة التسمية بمهارة فائقة جعلت جسور المملكة متينة ومشرقة.',
    icon: '➕',
    sealDefault: 'lion',
    badgeBg: 'from-amber-500 to-orange-600',
    ribbonColor: '#d97706',
    borderTheme: 'amber',
    requiredConditionAr: 'استعادة بلورة الجمع الذهبية أو خوض وادي الجمع',
    isUnlocked: (profile: PlayerProfile) =>
      profile.crystals.addition || profile.unlockedWorlds.includes('addition') || profile.stars >= 3,
  },
  {
    id: 'cert_subtraction',
    worldId: 'subtraction',
    category: 'world',
    titleAr: 'شهادة بطل كهف الطرح وفك العشرات',
    shortTitleAr: 'شهادة الطرح الرأسي',
    subtitleAr: 'شهادة إتقان الطرح الرأسي وتفكيك العشرات والتحقق',
    descriptionAr: 'تُمنح للبطل لشجاعته في تفكيك العشرات لآحاد وفتح بوابات الكهف الحسابية بحكمة وبراعة.',
    citationAr: 'تقديراً لذكائه المتألق في تفكيك العشرات والاستلاف بدقة، والتحقق من صحة نواتج الطرح بالجمع العكسي.',
    icon: '➖',
    sealDefault: 'pyramid',
    badgeBg: 'from-violet-500 to-indigo-700',
    ribbonColor: '#7c3aed',
    borderTheme: 'purple',
    requiredConditionAr: 'استعادة بلورة الطرح البنفسجية أو استكشاف كهف الطرح',
    isUnlocked: (profile: PlayerProfile) =>
      profile.crystals.subtraction || profile.unlockedWorlds.includes('subtraction') || profile.stars >= 5,
  },
  {
    id: 'cert_time',
    worldId: 'time',
    category: 'world',
    titleAr: 'شهادة سيد الوقت والساعة السحرية',
    shortTitleAr: 'شهادة قراءة الساعات والزمن',
    subtitleAr: 'شهادة إتقان قراءة الساعات التناظرية والرقمية وضبط العقارب',
    descriptionAr: 'تُمنح للبطل لمهارته في التمييز بين عقرب الساعات وعقرب الدقائق وقراءة الوقت بالتمام والأنصاف والأرباع.',
    citationAr: 'تقديراً لبراعته الفائقة في ضبط عقارب ساعة الشمس وقراءة الساعات الرقمية بدقة جعلت أوقات المملكة منضبطة وسعيدة.',
    icon: '⏰',
    sealDefault: 'star',
    badgeBg: 'from-sky-500 to-blue-700',
    ribbonColor: '#0284c7',
    borderTheme: 'sapphire',
    requiredConditionAr: 'استعادة بلورة مدينة الزمن أو حل تحديات الساعة',
    isUnlocked: (profile: PlayerProfile) =>
      profile.crystals.time || profile.unlockedWorlds.includes('time'),
  },
  {
    id: 'cert_measurement',
    worldId: 'measurement',
    category: 'world',
    titleAr: 'وسام مستكشف الأطوال والسنتيمتر الملكي',
    shortTitleAr: 'وسام القياس والأطوال',
    subtitleAr: 'شهادة إتقان قياس الأطوال بالمسطرة وتقدير المسافات بالمتر',
    descriptionAr: 'تُمنح للبطل لمهارته الدقيقة في استخدام المسطرة من الصفر وتقدير أطوال أدوات المدرسة والبيئة المحيطة.',
    citationAr: 'تقديراً لدقته العالية في مطابقة المسطرة من نقطة البداية صفر، ومهارته في التمييز العملي بين السنتيمتر والمتر.',
    icon: '📏',
    sealDefault: 'horus',
    badgeBg: 'from-amber-600 to-yellow-700',
    ribbonColor: '#b45309',
    borderTheme: 'gold',
    requiredConditionAr: 'استعادة بلورة القياس أو تجربة دروس الأطوال',
    isUnlocked: (profile: PlayerProfile) =>
      profile.crystals.measurement || profile.unlockedWorlds.includes('measurement') || profile.level >= 2,
  },
  {
    id: 'cert_numbers',
    worldId: 'numbers',
    category: 'world',
    titleAr: 'شهادة عبقري الأعداد والقيمة المكانية',
    shortTitleAr: 'شهادة القيمة المكانية',
    subtitleAr: 'شهادة التميز في مقارنة وترتيب الأعداد وقراءة الآحاد والعشرات والمئات',
    descriptionAr: 'تُمنح للبطل لفهمه العميق لبناء الأعداد والقيمة المنزلية وترتيبها تصاعدياً وتنازلياً بدقة.',
    citationAr: 'تقديراً لبصيرته الرياضية النافذة في تمييز قيمة الأرقام بحسب منازلها، وصنع أكبر وأصغر عدد بمهارة عبقرية.',
    icon: '🔢',
    sealDefault: 'star',
    badgeBg: 'from-rose-500 to-pink-700',
    ribbonColor: '#e11d48',
    borderTheme: 'amber',
    requiredConditionAr: 'استعادة بلورة الأعداد أو جمع 6 نجوم سحرية',
    isUnlocked: (profile: PlayerProfile) =>
      profile.crystals.numbers || profile.stars >= 6 || profile.xp >= 150,
  },
  {
    id: 'cert_capacity',
    worldId: 'capacity',
    category: 'world',
    titleAr: 'وسام خبير الكتل والسعة والموازين',
    shortTitleAr: 'وسام الكتل والسعة',
    subtitleAr: 'شهادة الإتقان في مقارنة الكتل (كجم وجرام) والسعة باللتر',
    descriptionAr: 'تُمنح للبطل لبراعته في مقارنة كتل الأشياء وضبط كفتي الميزان وتقدير سعات السوائل.',
    citationAr: 'تقديراً لحكمته وبراعته في موازنة كتل الأجسام وتقدير السعات السائلة في مختبرات القياس على ضفاف النيل.',
    icon: '⚖️',
    sealDefault: 'lotus',
    badgeBg: 'from-teal-500 to-cyan-700',
    ribbonColor: '#0d9488',
    borderTheme: 'emerald',
    requiredConditionAr: 'استعادة بلورة السعة أو بلوغ المستوى الثاني',
    isUnlocked: (profile: PlayerProfile) =>
      profile.crystals.capacity || profile.level >= 2,
  },
  {
    id: 'cert_grand',
    category: 'royal_honor',
    titleAr: 'شهادة التميز الملكية الكبرى لمملكة الرياضيات',
    shortTitleAr: 'الشهادة الملكية الكبرى',
    subtitleAr: 'أرفع وسام ملكي فخري يُمنح لفرسان الصف الثاني الابتدائي المتميزين',
    descriptionAr: 'أرفع درجات التكريم والتقدير الملكي، تُمنح للبطل الذي أضاء ربوع المملكة بذكائه وتفوقه في الحساب.',
    citationAr: 'تقديراً لإنجازاته الباهرة وتتويجه فارساً ملهماً في مملكة الرياضيات، ونشره لنور العلم والمعرفة بين أصدقائه.',
    icon: '👑',
    sealDefault: 'crown',
    badgeBg: 'from-amber-400 via-yellow-500 to-amber-600',
    ribbonColor: '#ca8a04',
    borderTheme: 'royal',
    requiredConditionAr: 'جمع بلورة سحرية واحدة على الأقل أو كسب 100XP أو المستوى الثاني',
    isUnlocked: (profile: PlayerProfile) =>
      Object.values(profile.crystals).some(Boolean) || profile.xp >= 100 || profile.level >= 2,
  },
  {
    id: 'cert_perseverance',
    category: 'mastery',
    titleAr: 'وسام الفارس المثابر والشجاعة اليومية',
    shortTitleAr: 'وسام المثابرة والصمود',
    subtitleAr: 'شهادة الاجتهاد والتصميم على المحاولة وعدم الاستسلام أمام الصعاب',
    descriptionAr: 'تُمنح للبطل لروحه الإيجابية وإصراره الشجاع على تكرار المحاولة حتى الوصول للإجابة الصحيحة.',
    citationAr: 'تقديراً لشجاعته وإصراره الرائع، فالبطل الحقيقي لا يستسلم بل يتعلم من أخطائه ويواصل رحلة المجد.',
    icon: '🛡️',
    sealDefault: 'lion',
    badgeBg: 'from-slate-700 to-slate-900',
    ribbonColor: '#334155',
    borderTheme: 'gold',
    requiredConditionAr: 'اللعب لأكثر من 5 دقائق أو إتمام جلستين تدريبيتين',
    isUnlocked: (profile: PlayerProfile) =>
      (profile.totalPlayMinutes && profile.totalPlayMinutes >= 5) || profile.coins >= 40,
  },
  {
    id: 'cert_pet_friend',
    category: 'mastery',
    titleAr: 'وسام الصديق الوفي لكائنات النيل السحرية',
    shortTitleAr: 'وسام رعاية الأصدقاء',
    subtitleAr: 'شهادة الرعاية والوفاء لرفاق الدرب في مغامرات الرياضيات',
    descriptionAr: 'تُمنح للبطل لقلبه الطيب وعنايته الفائقة بحيوانه الأليف وتوفير الحب والدفء في بيته على النيل.',
    citationAr: 'تقديراً لقلبه الرحيم ووفائه المخلص لرفاقه الكائنات السحرية التي ترافقه خطوة بخطوة في رحلات التعلم.',
    icon: '🐾',
    sealDefault: 'horus',
    badgeBg: 'from-emerald-600 to-teal-800',
    ribbonColor: '#059669',
    borderTheme: 'emerald',
    requiredConditionAr: 'اقتناء أو رعاية صديق أليف مثل الفنك أو الصقر الساحر',
    isUnlocked: (profile: PlayerProfile) =>
      profile.unlockedPets.length >= 1,
  },
];

export const certificatesService = {
  getAllCertificates(): RoyalCertificate[] {
    return ROYAL_CERTIFICATES;
  },

  getUnlockedCertificates(profile: PlayerProfile): RoyalCertificate[] {
    return ROYAL_CERTIFICATES.filter((cert) => cert.isUnlocked(profile));
  },

  getLockedCertificates(profile: PlayerProfile): RoyalCertificate[] {
    return ROYAL_CERTIFICATES.filter((cert) => !cert.isUnlocked(profile));
  },

  getCertificateById(id: string): RoyalCertificate | undefined {
    return ROYAL_CERTIFICATES.find((c) => c.id === id);
  },

  getSealInfo(sealId: RoyalSealType): RoyalSealInfo {
    return ROYAL_SEALS.find((s) => s.id === sealId) || ROYAL_SEALS[0];
  },

  /**
   * High-Resolution Canvas Exporter
   * Renders the complete, royal landscape diploma to a canvas and initiates a download
   */
  async exportCertificateAsImage(options: {
    certificate: RoyalCertificate;
    childName: string;
    honoraryTitle: string;
    seal: RoyalSealType;
    praiseText: string;
    dateText: string;
  }): Promise<void> {
    const { certificate, childName, honoraryTitle, seal, praiseText, dateText } = options;
    const sealInfo = this.getSealInfo(seal);

    const canvas = document.createElement('canvas');
    // High-resolution A4 landscape proportion (1600 x 1130)
    canvas.width = 1600;
    canvas.height = 1130;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Parchment Base Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1600, 1130);
    bgGradient.addColorStop(0, '#fffbf0');
    bgGradient.addColorStop(0.5, '#fef6e2');
    bgGradient.addColorStop(1, '#faebd0');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1600, 1130);

    // Subtle Papyrus border effect
    ctx.strokeStyle = '#e2c58a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      const y = Math.random() * 1130;
      ctx.moveTo(30, y);
      ctx.lineTo(1570, y + (Math.random() - 0.5) * 4);
      ctx.stroke();
    }

    // 2. Outer Ornate Gold Border Frame
    ctx.save();
    ctx.strokeStyle = '#b45309'; // Dark Gold / Bronze
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1540, 1070);

    ctx.strokeStyle = '#f59e0b'; // Bright Gold
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 1520, 1050);

    ctx.strokeStyle = '#78350f'; // Inner fine line
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, 1490, 1020);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, 40, 8);
      ctx.fillRect(0, 0, 8, 40);
      ctx.beginPath();
      ctx.arc(15, 15, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.restore();
    };

    drawCorner(55, 55, 0);
    drawCorner(1545, 55, Math.PI / 2);
    drawCorner(1545, 1075, Math.PI);
    drawCorner(55, 1075, -Math.PI / 2);

    ctx.restore();

    // 3. Header Emblem & Ribbons
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';

    // Kingdom Banner Arch
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 26px "Cairo", "Baloo Bhaijaan 2", sans-serif';
    ctx.fillText('👑  مملكة الرياضيات السعيدة - مصر  👑', 800, 115);

    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 20px "Cairo", "Baloo Bhaijaan 2", sans-serif';
    ctx.fillText('منهاج الصف الثاني الابتدائي • التميز والتفوق الحسابي', 800, 150);

    // Horizontal Royal Dividers
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 175);
    ctx.lineTo(720, 175);
    ctx.moveTo(880, 175);
    ctx.lineTo(1250, 175);
    ctx.stroke();

    ctx.font = '36px sans-serif';
    ctx.fillText(certificate.icon, 800, 185);

    // 4. Main Certificate Title
    ctx.fillStyle = '#451a03';
    ctx.font = '900 52px "Baloo Bhaijaan 2", "Cairo", sans-serif';
    ctx.fillText('شهادة تقدير وتفوق ملكية', 800, 260);

    // Subtitle Badge
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 28px "Cairo", sans-serif';
    ctx.fillText(certificate.titleAr, 800, 315);

    // Subtext
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 20px "Cairo", sans-serif';
    ctx.fillText(certificate.subtitleAr, 800, 355);

    // 5. Awarded To Section
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 26px "Cairo", sans-serif';
    ctx.fillText('تَمنح مملكة الرياضيات هذه الشهادة بكل فخر واعتزاز إلى البطل:', 800, 430);

    // Child Name in Huge Golden Banner
    const nameY = 520;
    // Name pill background
    const namePillGrad = ctx.createLinearGradient(400, nameY - 50, 1200, nameY + 20);
    namePillGrad.addColorStop(0, '#fef3c7');
    namePillGrad.addColorStop(0.5, '#fde68a');
    namePillGrad.addColorStop(1, '#fef3c7');
    ctx.fillStyle = namePillGrad;
    ctx.beginPath();
    ctx.roundRect(420, nameY - 65, 760, 95, 30);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#78350f';
    ctx.font = '900 56px "Baloo Bhaijaan 2", "Cairo", sans-serif';
    ctx.fillText(childName || 'بطل الرياضيات المتميز', 800, nameY);

    // Honorary Title pill
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 24px "Cairo", sans-serif';
    ctx.fillText(`✨ ${honoraryTitle} ✨`, 800, 600);

    // 6. Praise & Citation Text (Multi-line)
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 24px "Cairo", sans-serif';
    const praiseFull = praiseText || certificate.citationAr;

    // Word wrap helper
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      let curY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, curY);
          line = words[n] + ' ';
          curY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, curY);
      return curY;
    };

    wrapText(praiseFull, 800, 665, 1150, 42);

    // 7. Official Seal & Rosette (Center Bottom)
    const sealX = 800;
    const sealY = 880;

    // Seal ribbon tails
    ctx.fillStyle = '#b91c1c'; // Royal Crimson Red
    ctx.beginPath();
    ctx.moveTo(sealX - 25, sealY);
    ctx.lineTo(sealX - 55, sealY + 110);
    ctx.lineTo(sealX - 25, sealY + 90);
    ctx.lineTo(sealX + 5, sealY + 110);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(sealX + 25, sealY);
    ctx.lineTo(sealX + 55, sealY + 110);
    ctx.lineTo(sealX + 25, sealY + 90);
    ctx.lineTo(sealX - 5, sealY + 110);
    ctx.closePath();
    ctx.fill();

    // Wax Seal outer scalloped ring
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 68, 0, Math.PI * 2);
    ctx.fill();

    // Wax inner gold ring
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 56, 0, Math.PI * 2);
    ctx.stroke();

    // Seal icon
    ctx.font = '48px sans-serif';
    ctx.fillText(sealInfo.icon, sealX, sealY + 16);

    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 15px "Cairo", sans-serif';
    ctx.fillText(sealInfo.mottoAr, sealX, sealY + 50);

    // 8. Signatures & Date
    // Right: Companion Miro
    const rightSigX = 350;
    const sigY = 930;
    ctx.fillStyle = '#78350f';
    ctx.font = '900 24px "Cairo", sans-serif';
    ctx.fillText('🐾 المرشد الحكيم ميرو', rightSigX, sigY);
    ctx.font = 'bold 18px "Cairo", sans-serif';
    ctx.fillStyle = '#92400e';
    ctx.fillText('حارس واحة المعرفة', rightSigX, sigY + 30);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rightSigX - 120, sigY + 45);
    ctx.lineTo(rightSigX + 120, sigY + 45);
    ctx.stroke();

    // Left: Parent / Teacher Signature
    const leftSigX = 1250;
    ctx.fillStyle = '#78350f';
    ctx.font = '900 24px "Cairo", sans-serif';
    ctx.fillText('✍️ ولي الأمر / المعلم', leftSigX, sigY);
    ctx.font = 'bold 18px "Cairo", sans-serif';
    ctx.fillStyle = '#92400e';
    ctx.fillText(`تاريخ الاعتماد: ${dateText}`, leftSigX, sigY + 30);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftSigX - 120, sigY + 45);
    ctx.lineTo(leftSigX + 120, sigY + 45);
    ctx.stroke();

    // 9. Trigger Direct Browser Download
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const downloadAnchor = document.createElement('a');
    const safeName = (childName || 'hero').replace(/\s+/g, '_');
    downloadAnchor.download = `شهادة_تفوق_${safeName}_${certificate.id}.png`;
    downloadAnchor.href = dataUrl;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  },
};
