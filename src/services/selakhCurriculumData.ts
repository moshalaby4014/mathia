export interface SelakhActivityChoice {
  text: string;
  correct: boolean;
  explanation: string;
}

export interface SelakhActivity {
  id: string;
  questionAr: string;
  visualPrompt?: string;
  hintAr?: string;
  type: 'choice' | 'compare' | 'fill';
  choices?: SelakhActivityChoice[];
  compareData?: {
    leftVal: number | string;
    rightVal: number | string;
    leftLabel: string;
    rightLabel: string;
    correctSign: '>' | '<' | '=';
    explanation: string;
  };
  fillData?: {
    prefix: string;
    suffix: string;
    correctAnswer: string;
    explanation: string;
  };
}

export interface SelakhQuizQuestion {
  prompt: string;
  visual?: string;
  choices: { text: string; correct: boolean; feedback: string }[];
}

export interface SelakhLesson {
  id: string;
  unitId: string;
  unitTitleAr: string;
  lessonNumberAr: string;
  titleAr: string;
  subtitleAr: string;
  icon: string;
  colorTheme: {
    headerBg: string;
    accentBg: string;
    badgeBg: string;
    borderColor: string;
  };
  learnSection: {
    conceptTitleAr: string;
    explanationAr: string;
    visualDiagram: string;
    goldenRuleAr: string;
    solvedExample: {
      problemAr: string;
      steps: string[];
      answerAr: string;
    };
  };
  activities: SelakhActivity[];
  selfCheckQuiz: {
    titleAr: string;
    questions: SelakhQuizQuestion[];
    starsReward: number;
    coinsReward: number;
    xpReward: number;
  };
  geniusChallenge: {
    titleAr: string;
    riddleAr: string;
    visualHint?: string;
    options: { text: string; correct: boolean; feedback: string }[];
    bonusCoins: number;
  };
  parentCoachTipAr: string;
}

export interface SelakhUnit {
  id: string;
  number: number;
  titleAr: string;
  subtitleAr: string;
  lessonsRangeAr: string;
  icon: string;
  themeColor: string;
  lessons: SelakhLesson[];
}

export const SELAKH_UNITS: SelakhUnit[] = [
  // الوحدة 1: البيانات والتمثيل البياني
  {
    id: 'unit_1',
    number: 1,
    titleAr: 'الوحدة الأولى: معالجة البيانات والتمثيل البياني',
    subtitleAr: 'التمثيل البياني بالأعمدة، قراءة الجداول، التمثيل بالنقاط، وتفسير البيانات',
    lessonsRangeAr: 'الدروس 1 إلى 10',
    icon: '📊',
    themeColor: 'from-emerald-500 to-teal-700',
    lessons: [
      {
        id: 'selakh_lesson_1',
        unitId: 'unit_1',
        unitTitleAr: 'معالجة البيانات والرسوم البيانية',
        lessonNumberAr: 'الدروس 1 و 2',
        titleAr: 'التمثيل البياني بالأعمدة ومقارنة البيانات',
        subtitleAr: 'تعلّم قراءة الأعمدة الأفقية والرأسية وتحديد الأكثر والأقل',
        icon: '📊',
        colorTheme: {
          headerBg: 'bg-emerald-600',
          accentBg: 'bg-emerald-50',
          badgeBg: 'bg-emerald-500',
          borderColor: 'border-emerald-300',
        },
        learnSection: {
          conceptTitleAr: 'تعلَّم مع سلاح التلميذ: ما هو التمثيل البياني بالأعمدة؟',
          explanationAr:
            'التمثيل البياني بالأعمدة طريقة بصرية رائعة لتنظيم البيانات وعرضها، يتكون من محور أفقي (لأسماء العناصر أو الفئات) ومحور رأسي (للأرقام والمقياس). طول العمود يخبرنا بعدد العناصر مباشرة!',
          visualDiagram:
            '📊 تفاح: 🟩🟩🟩🟩🟩 (5) | موز: 🟨🟨🟨 (3) | برتقال: 🟧🟧🟧🟧🟧🟧🟧 (7)',
          goldenRuleAr:
            'قاعدة سلاح التلميذ الذهبية: لمعرفة "كم يزيد؟" نقوم بطرح الأصغر من الأكبر دائماً (الفرق = الأكبر − الأصغر). وكلمة "إجمالي" أو "مجموع" تعني الجمع (+)!',
          solvedExample: {
            problemAr: 'في الرسم البياني: عدد البرتقال = 7، وعدد الموز = 3. كم يزيد عدد البرتقال عن الموز؟',
            steps: [
              'نحدد المطلوب: "كم يزيد" تعني حساب الفرق بين العمودين.',
              'العدد الأكبر هو البرتقال (7)، والعدد الأصغر هو الموز (3).',
              'نطرح: 7 − 3 = 4 برتقالات.',
            ],
            answerAr: 'يزيد عدد البرتقال عن الموز بمقدار 4 برتقالات.',
          },
        },
        activities: [
          {
            id: 'act_1_1',
            questionAr: 'إذا كان عمود الفراولة يصل إلى الرقم 8، وعمود التين يصل إلى الرقم 5، فما إجمالي عدد الفراولة والتين معاً؟',
            visualPrompt: '🍓 8  |  🪵 5  |  المطلوب: الإجمالي (+)؟',
            type: 'choice',
            choices: [
              { text: '13 ثمرة', correct: true, explanation: 'ممتاز! الإجمالي يعني الجمع: 8 + 5 = 13 ثمرة!' },
              { text: '3 ثمرات', correct: false, explanation: 'حاسب! المطلوب هو الإجمالي (الجمع) وليس الفرق!' },
              { text: '12 ثمرة', correct: false, explanation: 'قريب جداً، اجمع الآحاد بعناية: 8 + 5 = 13.' },
            ],
          },
          {
            id: 'act_1_2',
            questionAr: 'قارن باستخدام الرمز المناسب (> أو < أو =):',
            type: 'compare',
            compareData: {
              leftVal: 'عمود التفاح (6)',
              rightVal: 'عمود العنب (9)',
              leftLabel: 'التفاح: 6',
              rightLabel: 'العنب: 9',
              correctSign: '<',
              explanation: 'العدد 6 أصغر من (<) العدد 9، لذلك عمود العنب أطول!',
            },
          },
          {
            id: 'act_1_3',
            questionAr: 'أكمل مكان النقط بكلمة (يزيد / ينقص): عدد الموز (3) ........... عن عدد البرتقال (7).',
            type: 'choice',
            choices: [
              { text: 'ينقص', correct: true, explanation: 'إجابة عبقرية! بما أن 3 أصغر من 7، فإن الموز ينقص عن البرتقال بمقدار 4.' },
              { text: 'يزيد', correct: false, explanation: 'الموز 3 والبرتقال 7، إذن الموز أقل وينقص!' },
            ],
          },
        ],
        selfCheckQuiz: {
          titleAr: 'اختبار قيِّم نفسك حتى الدرس 2 (سلاح التلميذ) ⭐',
          starsReward: 3,
          coinsReward: 35,
          xpReward: 60,
          questions: [
            {
              prompt: 'ما العنصر الأكثر تفضيلاً إذا كانت الأعمدة: تفاح 5، مانجو 9، كمثرى 4؟',
              choices: [
                { text: 'المانجو (9) 🥭', correct: true, feedback: 'إجابة صحيحة! المانجو صاحبة أطول عمود (9).' },
                { text: 'التفاح (5)', correct: false, feedback: 'التفاح 5 فقط، بينما المانجو 9!' },
                { text: 'الكمثرى (4)', correct: false, feedback: 'الكمثرى هي الأقل وليست الأكثر!' },
              ],
            },
            {
              prompt: 'ما الفرق بين عدد المانجو (9) والكمثرى (4)؟',
              choices: [
                { text: '5', correct: true, feedback: 'ممتاز! الفرق = 9 − 4 = 5.' },
                { text: '13', correct: false, feedback: 'هذا المجموع! المطلوب هو الفرق بالطرح.' },
                { text: '4', correct: false, feedback: 'تأكد من الطرح: 9 − 4 = 5.' },
              ],
            },
            {
              prompt: 'علامة (X) في مخطط التمثيل بالنقاط تمثل عادةً:',
              choices: [
                { text: 'تلميذاً واحداً أو عنصراً واحداً', correct: true, feedback: 'أحسنت! مفتاح المخطط يحدد قيمة كل علامة X.' },
                { text: 'صفر دائماً', correct: false, feedback: 'علامة X تسجل تكرار البيانات!' },
              ],
            },
          ],
        },
        geniusChallenge: {
          titleAr: 'تحدي المتفوقين في سلاح التلميذ 🧠⚡',
          riddleAr: 'في مدرج الفواكه: عدد الموز يزيد عن التفاح بـ 3، وعدد التفاح = 4. فكم موزة في السلة؟',
          options: [
            { text: '7 موزات (لأن 4 + 3 = 7)', correct: true, feedback: 'يا لك من عبقري حقيقي! 4 + 3 = 7 موزات!' },
            { text: '1 موزة واحدة', correct: false, feedback: 'فكر جيداً: الموز يزيد (أي أكثر من 4 بمقدار 3)!' },
            { text: '12 موزة', correct: false, feedback: 'راجع الحساب الذهني بهدوء!' },
          ],
          bonusCoins: 50,
        },
        parentCoachTipAr:
          '💡 نصيحة سلاح التلميذ لولي الأمر: اطلب من طفلك في المنزل فرز ألعابه (سيارات، مكعبات، دمى) وعمل جدول إحصائي بسيط بعدد كل منها ومقارنة الأكثر والأقل.',
      },
    ],
  },

  // الوحدة 2: استراتيجيات الجمع الذهني والرأسي
  {
    id: 'unit_2',
    number: 2,
    titleAr: 'الوحدة الثانية: استراتيجيات الجمع والرياضيات الذهنية',
    subtitleAr: 'الجمع بالمضاعفة، تكوين العشرات، خط الأعداد، والجمع الرأسي بإعادة التسمية',
    lessonsRangeAr: 'الدروس 11 إلى 20',
    icon: '➕',
    themeColor: 'from-amber-500 to-orange-600',
    lessons: [
      {
        id: 'selakh_lesson_2',
        unitId: 'unit_2',
        unitTitleAr: 'استراتيجيات الجمع الذهني',
        lessonNumberAr: 'الدروس 13 إلى 16',
        titleAr: 'استراتيجية تكوين العشرات والجمع بالمضاعفة',
        subtitleAr: 'أسرار الحساب الذهني السريع كما يشرحها سلاح التلميذ',
        icon: '⚡',
        colorTheme: {
          headerBg: 'bg-amber-600',
          accentBg: 'bg-amber-50',
          badgeBg: 'bg-amber-500',
          borderColor: 'border-amber-300',
        },
        learnSection: {
          conceptTitleAr: 'تعلَّم مع سلاح التلميذ: كيف نجمع في لمح البصر؟',
          explanationAr:
            '1. استراتيجية المضاعفة: حفظ مضاعفات الأعداد مثل 5+5=10، 6+6=12، 7+7=14. لحل 6+7 نقول: (6+6) + 1 = 13!\n2. استراتيجية تكوين العشرة: العدد 8 يحتاج 2 ليصبح 10. نأخذ 2 من العدد الثاني ونضيف الباقي للعشرة فوراً!',
          visualDiagram:
            '🔟 8 + 5 ➡️ نأخذ 2 من الـ 5: (8 + 2) + 3 = 10 + 3 = 13!',
          goldenRuleAr:
            'قاعدة سلاح التلميذ الذهبية: العشرة هي صديقة الجمع الأولى! حوّل أي عدد قريب إلى 10 وسيصبح الجمع أسهل ما يكون في عقلك دون استخدام الأصابع!',
          solvedExample: {
            problemAr: 'اجمع ذهنياً باستخدام استراتيجية تكوين العشرات: 9 + 6 = ؟',
            steps: [
              'العدد 9 يحتاج 1 فقط ليصبح 10 كاملة.',
              'نفكك العدد 6 إلى: 1 + 5.',
              'نجمع: (9 + 1) + 5 = 10 + 5 = 15.',
            ],
            answerAr: '9 + 6 = 15 ذهنياً وبأسرع طريقة!',
          },
        },
        activities: [
          {
            id: 'act_2_1',
            questionAr: 'باستخدام الجمع بالمضاعفة: إذا كان 7 + 7 = 14، فما ناتج 7 + 8؟',
            visualPrompt: '7 + 8 = (7 + 7) + 1 = ؟',
            type: 'choice',
            choices: [
              { text: '15', correct: true, explanation: 'رائع جداً! 14 + 1 = 15 في ثانية واحدة!' },
              { text: '16', correct: false, explanation: 'أضفنا 1 فقط على الـ 14 لأن 8 تزيد عن 7 بواحد!' },
              { text: '14', correct: false, explanation: '14 هي 7 + 7، لكن المسألة 7 + 8!' },
            ],
          },
          {
            id: 'act_2_2',
            questionAr: 'اجمع رأسياً بإعادة التسمية: 38 + 25 = ؟',
            visualPrompt: '   3 8\n+ 2 5\n-------\n   ? ?',
            type: 'choice',
            choices: [
              { text: '63 (8+5=13، 3 ومعنا 1 للعشرات)', correct: true, explanation: 'أحسنت! 1 + 3 + 2 = 6 عشرات، والآحاد 3، الناتج 63!' },
              { text: '53 (نسي حمل العشرة)', correct: false, explanation: 'لا تنس الـ 1 الذي قمنا بإعادة تسميته فوق العشرات!' },
              { text: '65', correct: false, explanation: 'اجمع الآحاد: 8 + 5 = 13 وليس 15!' },
            ],
          },
          {
            id: 'act_2_3',
            questionAr: 'العدد الناقص لتكوين العشرة الكاملة: 8 + ...... = 10',
            type: 'choice',
            choices: [
              { text: '2', correct: true, explanation: 'صحيح 100%! مكونات العدد 10 هي 8 و 2.' },
              { text: '3', correct: false, explanation: '8 + 3 = 11، المطلوب 10.' },
              { text: '1', correct: false, explanation: '8 + 1 = 9 فقط.' },
            ],
          },
        ],
        selfCheckQuiz: {
          titleAr: 'اختبار قيِّم نفسك في الجمع السريع ⭐',
          starsReward: 3,
          coinsReward: 40,
          xpReward: 70,
          questions: [
            {
              prompt: 'ما ناتج 6 + 6 + 1؟',
              choices: [
                { text: '13', correct: true, feedback: 'ممتاز! 12 + 1 = 13.' },
                { text: '14', correct: false, feedback: '6 + 6 = 12، زائد 1 يساوي 13.' },
              ],
            },
            {
              prompt: 'عند جمع 47 + 36: الآحاد 7 + 6 = 13. ماذا نكتب في خانة الآحاد؟',
              choices: [
                { text: 'نكتب 3 ونعيد تسمية 1 إلى العشرات', correct: true, feedback: 'صحيح تماماً وفق الخوارزمية المعيارية لسلاح التلميذ!' },
                { text: 'نكتب 13 كاملة في الآحاد', correct: false, feedback: 'الخانة لا تتسع لأكثر من رقم واحد (0-9)!' },
              ],
            },
            {
              prompt: 'ما ناتج 50 + 40 ذهنياً؟',
              choices: [
                { text: '90 (5 عشرات + 4 عشرات)', correct: true, feedback: 'إجابة خاطفة وسريعة! 90.' },
                { text: '80', correct: false, feedback: '5 + 4 = 9، إذن 90.' },
              ],
            },
          ],
        },
        geniusChallenge: {
          titleAr: 'تحدي المتفوقين: شفرة المربع السحري 🧠⚡',
          riddleAr: 'عدد إذا جمعت عليه نفسه ثم أضفت 4 كان الناتج 18. فما هو هذا العدد؟',
          options: [
            { text: 'العدد 7 (لأن 7 + 7 = 14، و 14 + 4 = 18)', correct: true, feedback: 'عبقري وسلاح تلميذ متفوق مع مرتبة الشرف!' },
            { text: 'العدد 8 (8 + 8 + 4 = 20)', correct: false, feedback: 'احسب: 8 + 8 = 16 + 4 = 20 وليس 18!' },
            { text: 'العدد 6 (6 + 6 + 4 = 16)', correct: false, feedback: 'جرب عدداً أكبر قليلاً!' },
          ],
          bonusCoins: 50,
        },
        parentCoachTipAr:
          '💡 نصيحة سلاح التلميذ لولي الأمر: كرر مع طفلك لعبة "مكونات الـ 10" أثناء المشي أو في السيارة (أقول 7 فيرد الطفل 3، أقول 6 فيرد 4). هذا يبني طلاقة ذهنية مذهلة!',
      },
    ],
  },

  // الوحدة 3: استراتيجيات الطرح والمسائل الكلامية
  {
    id: 'unit_3',
    number: 3,
    titleAr: 'الوحدة الثالثة: استراتيجيات الطرح وعلاقتها بالجمع',
    subtitleAr: 'العد التنازلي، تفكيك العشرات، الطرح الرأسي بالاستلاف، ومسائل التحقق',
    lessonsRangeAr: 'الدروس 21 إلى 30',
    icon: '➖',
    themeColor: 'from-violet-500 to-indigo-700',
    lessons: [
      {
        id: 'selakh_lesson_3',
        unitId: 'unit_3',
        unitTitleAr: 'استراتيجيات الطرح الرأسي',
        lessonNumberAr: 'الدروس 23 إلى 26',
        titleAr: 'الطرح الرأسي مع إعادة التسمية (الاستلاف)',
        subtitleAr: 'كيف نستلف من العشرات ونتحقق من صحة ناتج الطرح',
        icon: '➖',
        colorTheme: {
          headerBg: 'bg-indigo-600',
          accentBg: 'bg-indigo-50',
          badgeBg: 'bg-indigo-500',
          borderColor: 'border-indigo-300',
        },
        learnSection: {
          conceptTitleAr: 'تعلَّم مع سلاح التلميذ: عندما لا يكفي الآحاد، ماذا نفعل؟',
          explanationAr:
            'في الطرح الرأسي: نبدأ بالآحاد دائماً. إذا كان الرقم العلوي أصغر من السفلي (مثلاً 2 − 7)، لا يصح الطرح! نقوم بفك (استلاف) 1 عشرة من خانة العشرات. العشرة الواحدة تصبح 10 آحاد، فيصبح الآحاد 12 ونطرح بسهولة!',
          visualDiagram:
            '🔓 52 − 27 ➡️ الـ 5 عشرات تصبح 4، والـ 2 آحاد تصبح 12! ثم 12 − 7 = 5، و 4 − 2 = 2، الناتج 25!',
          goldenRuleAr:
            'قاعدة سلاح التلميذ الذهبية للتحقق: للتحقق من أن حلك صحيح: اجمع الناتج + المطروح. إذا أعطاك المطروح منه الأصلي فأنت بطل ممتاز!',
          solvedExample: {
            problemAr: 'أوجد ناتج: 63 − 28 وتحقق من صحة الحل.',
            steps: [
              'نطرح الآحاد: 3 − 8 لا يصح لأن 3 أصغر من 8.',
              'نستلف 1 من الـ 6 عشرات (فتصبح 5)، والـ 3 تصبح 13.',
              '13 − 8 = 5 في الآحاد.',
              'نطرح العشرات: 5 − 2 = 3. الناتج = 35.',
              'التحقق بالجمع: 35 + 28 = 63 (صحيح 100%!).',
            ],
            answerAr: '63 − 28 = 35 والتحقق سليم.',
          },
        },
        activities: [
          {
            id: 'act_3_1',
            questionAr: 'في المسألة: 74 − 39، بعد الاستلاف تصبح خانة الآحاد:',
            type: 'choice',
            choices: [
              { text: '14 (لأننا أضفنا 10 على الـ 4)', correct: true, explanation: 'ممتاز! 4 + 10 = 14، والـ 7 عشرات تصبح 6.' },
              { text: '5 فقط', correct: false, explanation: 'الاستلاف يضيف 10 كاملة وليس 1 فقط!' },
              { text: '10', correct: false, explanation: 'نضيف 10 للـ 4 الأصلية فتصبح 14.' },
            ],
          },
          {
            id: 'act_3_2',
            questionAr: 'تحقق من صحة الطرح: 80 − 35 = 45. هل المعادلة صحيحة؟',
            type: 'choice',
            choices: [
              { text: 'نعم صحيحة (لأن 45 + 35 = 80)', correct: true, explanation: 'أحسنت! التحقق بالجمع أثبت صحة الناتج بدقة!' },
              { text: 'لا غير صحيحة', correct: false, explanation: 'اجمع 45 + 35 ستجدها 80 تماماً!' },
            ],
          },
        ],
        selfCheckQuiz: {
          titleAr: 'اختبار قيِّم نفسك في مهارات الطرح ⭐',
          starsReward: 3,
          coinsReward: 35,
          xpReward: 65,
          questions: [
            {
              prompt: 'ما ناتج 50 − 20 ذهنياً؟',
              choices: [
                { text: '30', correct: true, feedback: 'صحيح! 5 عشرات − 2 عشرات = 3 عشرات (30).' },
                { text: '70', correct: false, feedback: 'هذا الجمع! المسألة طرح.' },
              ],
            },
            {
              prompt: 'مع كريم 45 جنيهاً، اشترى كتاباً بـ 18 جنيهاً. كم جنيهاً تبقى معه؟',
              choices: [
                { text: '27 جنيهاً (45 − 18 = 27)', correct: true, feedback: 'بطل حقيقي! 15 − 8 = 7، و 3 − 1 = 2.' },
                { text: '33 جنيهاً', correct: false, feedback: 'تذكر الاستلاف من خانة العشرات!' },
              ],
            },
          ],
        },
        geniusChallenge: {
          titleAr: 'تحدي المتفوقين في الطرح 🧠⚡',
          riddleAr: 'طرحنا عدداً من 90 فكان الناتج 45. فما هو هذا العدد؟',
          options: [
            { text: '45 (لأن 45 نصف الـ 90)', correct: true, feedback: 'إجابة ذكية جداً وسريعة! 90 − 45 = 45.' },
            { text: '55', correct: false, feedback: '90 − 55 = 35 وليس 45.' },
          ],
          bonusCoins: 50,
        },
        parentCoachTipAr:
          '💡 نصيحة سلاح التلميذ لولي الأمر: علّم طفلك أن الطرح ليس لغزاً، بل هو معرفة المتبقي أو الفرق. استخدم النقود الحقيقية في تدريبه على فك الجنيهات والعشرات.',
      },
    ],
  },

  // الوحدة 4: قراءة الوقت والساعات
  {
    id: 'unit_4',
    number: 4,
    titleAr: 'الوحدة الرابعة: قراءة الوقت والساعات',
    subtitleAr: 'الساعة التناظرية والرقمية، النصف والربع، وفترات الصباح والمساء',
    lessonsRangeAr: 'الدروس 31 إلى 40',
    icon: '⏰',
    themeColor: 'from-sky-500 to-blue-700',
    lessons: [
      {
        id: 'selakh_lesson_4',
        unitId: 'unit_4',
        unitTitleAr: 'الساعات والوقت',
        lessonNumberAr: 'الدروس 31 إلى 35',
        titleAr: 'قراءة الساعة الرقمية وذات العقارب بدقة',
        subtitleAr: 'التمييز بين عقرب الساعات وعقرب الدقائق والكسور الزمنية',
        icon: '⏰',
        colorTheme: {
          headerBg: 'bg-sky-600',
          accentBg: 'bg-sky-50',
          badgeBg: 'bg-sky-500',
          borderColor: 'border-sky-300',
        },
        learnSection: {
          conceptTitleAr: 'تعلَّم مع سلاح التلميذ: كيف نقرأ الساعة كالمحترفين؟',
          explanationAr:
            'الساعة بها عقربان رئيسيان:\n• العقرب القصير: للساعات، يتحرك ببطء.\n• العقرب الطويل: للدقائق، يتحرك أسرع.\n- عندما يشير العقرب الطويل إلى 12: تكون الساعة بالتمام (:00).\n- عندما يشير إلى 6: تكون ونصف (:30 دقيقة).\n- عندما يشير إلى 3: تكون وربع (:15 دقيقة).\n- عندما يشير إلى 9: تكون إلا ربع (:45 دقيقة).',
          visualDiagram:
            '🕐 12 ➡️ :00 بالتمام | 🕒 3 ➡️ :15 وربع | 🕕 6 ➡️ :30 ونصف | 🕘 9 ➡️ :45 إلا ربع',
          goldenRuleAr:
            'قاعدة سلاح التلميذ الذهبية: الساعة الكاملة فيها 60 دقيقة، ونصف الساعة = 30 دقيقة، وربع الساعة = 15 دقيقة!',
          solvedExample: {
            problemAr: 'العقرب القصير بين 4 و 5، والعقرب الطويل يشير إلى 6. كم الساعة؟',
            steps: [
              'العقرب القصير تجاوز 4 ولم يصل 5 بعد ➡️ الساعة 4.',
              'العقرب الطويل عند 6 ➡️ يعني 30 دقيقة (ونصف).',
              'في الساعة الرقمية نكتب: 04:30.',
            ],
            answerAr: 'الساعة الرابعة والنصف (04:30).',
          },
        },
        activities: [
          {
            id: 'act_4_1',
            questionAr: 'الساعة الرقمية تُظهر 07:15. هذه الساعة تعني:',
            type: 'choice',
            choices: [
              { text: 'السابعة والربع', correct: true, explanation: 'أحسنت! 15 دقيقة تعني ربع ساعة تماماً!' },
              { text: 'السابعة والنصف', correct: false, explanation: 'النصف يعني 30 دقيقة!' },
              { text: 'السابعة تماماً', correct: false, explanation: 'التمام يعني :00 دقيقة!' },
            ],
          },
          {
            id: 'act_4_2',
            questionAr: 'كم دقيقة في ساعة ونصف؟',
            type: 'choice',
            choices: [
              { text: '90 دقيقة (60 + 30)', correct: true, explanation: 'رائع! 60 دقيقة في الساعة + 30 في النصف = 90 دقيقة.' },
              { text: '75 دقيقة', correct: false, explanation: 'احسب: 60 + 30 = 90 دقيقة.' },
            ],
          },
        ],
        selfCheckQuiz: {
          titleAr: 'اختبار قيِّم نفسك في قراءة الساعات ⭐',
          starsReward: 3,
          coinsReward: 35,
          xpReward: 60,
          questions: [
            {
              prompt: 'أين يشير عقرب الدقائق عندما تكون الساعة الثانية تماماً؟',
              choices: [
                { text: 'يشير إلى العدد 12', correct: true, feedback: 'صحيح! عند 12 تكون الدقائق 00 بالتمام.' },
                { text: 'يشير إلى العدد 2', correct: false, feedback: 'عقرب الساعات هو من يشير إلى 2!' },
              ],
            },
          ],
        },
        geniusChallenge: {
          titleAr: 'تحدي المتفوقين في الوقت 🧠⚡',
          riddleAr: 'بدأت حصة الرياضيات الساعة 09:00 واستمرت 45 دقيقة. في أي وقت انتهت الحصة؟',
          options: [
            { text: 'الساعة العاشرة إلا ربع (09:45)', correct: true, feedback: 'ما شاء الله عليك! حل متقن في لمح البصر!' },
            { text: 'الساعة 10:00 تماماً', correct: false, feedback: 'لو انتهت 10:00 لكانت استمرت 60 دقيقة!' },
          ],
          bonusCoins: 50,
        },
        parentCoachTipAr:
          '💡 نصيحة سلاح التلميذ لولي الأمر: اشترِ لطفلك ساعة يد عقارب بسيطة، واسأله طوال اليوم: "كم الساعة الآن يا بطل؟" ليربط الزمن بحياته اليومية.',
      },
    ],
  },

  // الوحدة 5: قياس الأطوال (السنتيمتر والمتر)
  {
    id: 'unit_5',
    number: 5,
    titleAr: 'الوحدة الخامسة: قياس الأطوال وتقدير المسافات',
    subtitleAr: 'السنتيمتر (سم)، المتر (م)، استخدام المسطرة من نقطة الصفر، والمقارنة',
    lessonsRangeAr: 'الدروس 41 إلى 50',
    icon: '📏',
    themeColor: 'from-amber-600 to-yellow-700',
    lessons: [
      {
        id: 'selakh_lesson_5',
        unitId: 'unit_5',
        unitTitleAr: 'القياس والأطوال',
        lessonNumberAr: 'الدروس 41 إلى 44',
        titleAr: 'السنتيمتر والمتر واستخدام المسطرة',
        subtitleAr: 'كيف نقيس الأشياء بدقة ونميز بين السنتيمتر والمتر',
        icon: '📏',
        colorTheme: {
          headerBg: 'bg-amber-700',
          accentBg: 'bg-amber-50',
          badgeBg: 'bg-amber-600',
          borderColor: 'border-amber-400',
        },
        learnSection: {
          conceptTitleAr: 'تعلَّم مع سلاح التلميذ: السنتيمتر للأشياء الصغيرة والمتر للكبيرة!',
          explanationAr:
            '• السنتيمتر (سم): وحدة لقياس الأشياء القصيرة مثل طول القلم، الممحاة، الكتاب.\n• المتر (م): وحدة لقياس الأشياء الطويلة مثل طول الغرفة، الباب، سارية العلم.\n• العلاقة الذهبية: 1 متر = 100 سنتيمتر (1 م = 100 سم).',
          visualDiagram:
            '✏️ قلم الرصاص = 12 سم | 🚪 الباب = 2 متر (200 سم) | 📏 المسطرة تبدأ من 0 دائماً!',
          goldenRuleAr:
            'قاعدة سلاح التلميذ الذهبية عند استخدام المسطرة: طابق بداية الشيء مع علامة (الصفر 0) على المسطرة، وليس حافة المسطرة البلاستيكية!',
          solvedExample: {
            problemAr: 'وضع أحمد قلمه على المسطرة فبدأ من الصفر وانتهى عند الرقم 14. ما طول القلم؟',
            steps: [
              'نتأكد أن البداية عند علامة الصفر (0).',
              'ننظر إلى الرقم المقابل لطرف القلم الآخر وهو 14.',
              'إذن طول القلم = 14 سم.',
            ],
            answerAr: 'طول القلم 14 سنتيمتراً (14 سم).',
          },
        },
        activities: [
          {
            id: 'act_5_1',
            questionAr: 'الوحدة الأنسب لقياس طول شجرة في الحديقة هي:',
            type: 'choice',
            choices: [
              { text: 'المتر (م)', correct: true, explanation: 'ممتاز! الشجرة شيء كبير وطويل يُقاس بالأمتار.' },
              { text: 'السنتيمتر (سم)', correct: false, explanation: 'السنتيمتر للأشياء الصغيرة مثل القلم والملعقة.' },
            ],
          },
          {
            id: 'act_5_2',
            questionAr: '3 أمتار تساوي كم سنتيمتراً؟ (1 م = 100 سم)',
            type: 'choice',
            choices: [
              { text: '300 سم', correct: true, explanation: 'أحسنت! 100 + 100 + 100 = 300 سم.' },
              { text: '30 سم', correct: false, explanation: 'المتر 100 سم، إذن 3 أمتار = 300 سم.' },
              { text: '3 سم', correct: false, explanation: '3 أمتار مسافة كبيرة تساوي 300 سم!' },
            ],
          },
        ],
        selfCheckQuiz: {
          titleAr: 'اختبار قيِّم نفسك في القياس والأطوال ⭐',
          starsReward: 3,
          coinsReward: 35,
          xpReward: 60,
          questions: [
            {
              prompt: 'عند استخدام المسطرة، من أين نبدأ القياس؟',
              choices: [
                { text: 'من علامة الصفر (0)', correct: true, feedback: 'قاعدة دقيقة ورائعة!' },
                { text: 'من علامة الواحد (1)', correct: false, feedback: 'البدء من 1 يعطي قياساً ناقصاً!' },
              ],
            },
          ],
        },
        geniusChallenge: {
          titleAr: 'تحدي المتفوقين في الأطوال 🧠⚡',
          riddleAr: 'قطعة حبل طولها متر واحد (1 م)، قَصصنا منها 40 سم. كم سنتيمتراً يتبقى من الحبل؟',
          options: [
            { text: '60 سم (لأن 100 سم − 40 سم = 60 سم)', correct: true, feedback: 'ذكاء خارق! تذكرت أن المتر 100 سم وطرحت بدقة!' },
            { text: '40 سم', correct: false, feedback: '100 − 40 = 60 سم.' },
          ],
          bonusCoins: 50,
        },
        parentCoachTipAr:
          '💡 نصيحة سلاح التلميذ لولي الأمر: أعطِ طفلك مسطرة واطلب منه قياس طول هاتفك المحمول، دفتر الملاحظات، أو شوكة الطعام ليتدرب عملياً على البداية من الصفر.',
      },
    ],
  },

  // الوحدة 6: الأعداد حتى 1000 والنقود والكتلة
  {
    id: 'unit_6',
    number: 6,
    titleAr: 'الوحدة السادسة: الأعداد حتى 1000 والنقود والكتلة',
    subtitleAr: 'المئات، القيمة المكانية والصيغة الممتدة، فئات الجنيه المصري، والكيلوجرام والجرام',
    lessonsRangeAr: 'الدروس 51 إلى 60',
    icon: '👑',
    themeColor: 'from-purple-600 to-indigo-800',
    lessons: [
      {
        id: 'selakh_lesson_6',
        unitId: 'unit_6',
        unitTitleAr: 'الأعداد والنقود والكتلة',
        lessonNumberAr: 'الدروس 51 إلى 55',
        titleAr: 'القيمة المكانية وفئات النقود المصرية',
        subtitleAr: 'فهم الآحاد والعشرات والمئات ومعاملات البيع والشراء بالجنيه',
        icon: '🪙',
        colorTheme: {
          headerBg: 'bg-purple-700',
          accentBg: 'bg-purple-50',
          badgeBg: 'bg-purple-600',
          borderColor: 'border-purple-300',
        },
        learnSection: {
          conceptTitleAr: 'تعلَّم مع سلاح التلميذ: الفرق بين القيمة المكانية وقيمة الرقم!',
          explanationAr:
            '• القيمة المكانية: اسم الخانة بالكلمات (آحاد، عشرات، مئات).\n• قيمة الرقم: قيمته بالحساب والأصفار (في المئات 5 تبلغ 500، وفي العشرات 5 تبلغ 50، وفي الآحاد 5 تبلغ 5).\n• في النقود المصرية: فئة 100 جنيه = عشر ورقات من فئة 10 جنيهات = خمس ورقات من فئة 20 جنيهاً!',
          visualDiagram:
            '🏦 345 = 3 مئات (300) + 4 عشرات (40) + 5 آحاد (5) = 300 + 40 + 5',
          goldenRuleAr:
            'قاعدة سلاح التلميذ الذهبية: الصيغة الممتدة هي تفكيك العدد إلى مجموع قيم أرقامه: 345 = 5 + 40 + 300!',
          solvedExample: {
            problemAr: 'ما القيمة المكانية للرقم 7 في العدد 742؟ وما قيمته العددية؟',
            steps: [
              'مكان الرقم 7 هو الخانة الثالثة جهة اليسار ➡️ خانة المئات.',
              'القيمة المكانية هي: مئات.',
              'قيمة الرقم 7 في المئات هي: 700.',
            ],
            answerAr: 'القيمة المكانية: مئات | قيمة الرقم: 700.',
          },
        },
        activities: [
          {
            id: 'act_6_1',
            questionAr: 'الصيغة الممتدة للعدد 682 هي:',
            type: 'choice',
            choices: [
              { text: '2 + 80 + 600', correct: true, explanation: 'إجابة صحيحة 100%! آحاد 2، عشرات 80، مئات 600.' },
              { text: '2 + 8 + 6', correct: false, explanation: 'هذه أرقام دون أصفار خاناتها!' },
              { text: '200 + 80 + 6', correct: false, explanation: 'المئات 600 والآحاد 2!' },
            ],
          },
          {
            id: 'act_6_2',
            questionAr: 'ورقة نقدية فئة 50 جنيهاً يمكن فكّها إلى ورقتين من فئة 20 جنيهاً وورقة من فئة:',
            type: 'choice',
            choices: [
              { text: '10 جنيهات (20 + 20 + 10 = 50)', correct: true, explanation: 'أحسنت في حساب النقود والفكّة!' },
              { text: '5 جنيهات', correct: false, explanation: '20 + 20 + 5 = 45 جنيهاً فقط!' },
            ],
          },
        ],
        selfCheckQuiz: {
          titleAr: 'اختبار قيِّم نفسك في الأعداد والنقود ⭐',
          starsReward: 3,
          coinsReward: 40,
          xpReward: 70,
          questions: [
            {
              prompt: 'أكبر عدد يمكن تكوينه من الأرقام (3 ، 8 ، 1) هو:',
              choices: [
                { text: '831 (نضع الرقم الأكبر في المئات)', correct: true, feedback: 'قاعدة سلاح التلميذ الذهبية لتكوين أكبر عدد!' },
                { text: '138', correct: false, feedback: '138 هو أصغر عدد وليس الأكبر!' },
                { text: '381', correct: false, feedback: '831 أكبر من 381 بكثير.' },
              ],
            },
          ],
        },
        geniusChallenge: {
          titleAr: 'تحدي المتفوقين في الكتلة والموازين 🧠⚡',
          riddleAr: 'كيس سكر كتلته 2 كيلوجرام، وعلبة شاي كتلتها 250 جراماً. أيهما أثقل؟',
          options: [
            { text: 'كيس السكر (لأن 2 كجم = 2000 جرام وهي أكبر بكثير من 250 جم)', correct: true, feedback: 'رائع جداً! 1 كجم = 1000 جم، إذن 2 كجم = 2000 جم!' },
            { text: 'علبة الشاي', correct: false, feedback: 'الـ 250 جراماً أقل بكثير من الكيلوجرام الواحد!' },
          ],
          bonusCoins: 50,
        },
        parentCoachTipAr:
          '💡 نصيحة سلاح التلميذ لولي الأمر: خذ طفلك معك إلى السوبرماركت واطلب منه قراءة وزن المنتجات (كجم، جم) وحساب الفكة المتبقية من مشتريات بسيطة.',
      },
    ],
  },
];
