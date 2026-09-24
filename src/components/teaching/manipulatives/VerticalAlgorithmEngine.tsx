import React, { useState } from 'react';
import { sound } from '../../../services/audio';
import { CheckCircle2, Sparkles, AlertCircle, ArrowDown, RotateCcw } from 'lucide-react';

interface Props {
  num1: number; // e.g. 27 or 42
  num2: number; // e.g. 18
  operation: 'add' | 'subtract';
  onSuccess?: () => void;
  onErrorMisconception?: (tag: string) => void;
}

export const VerticalAlgorithmEngine: React.FC<Props> = ({
  num1,
  num2,
  operation,
  onSuccess,
  onErrorMisconception,
}) => {
  // Decomposition into tens and ones
  const tens1 = Math.floor(num1 / 10);
  const ones1 = num1 % 10;
  const tens2 = Math.floor(num2 / 10);
  const ones2 = num2 % 10;

  // Step state:
  // step 1: Ones column
  // step 2: Regrouping decision (carry or borrow)
  // step 3: Tens column
  // step 4: Completed
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // User input states
  const [onesInput, setOnesInput] = useState('');
  const [carryInput, setCarryInput] = useState('');
  const [tensInput, setTensInput] = useState('');
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Calculations
  const onesSum = ones1 + ones2;
  const needsAdditionRegroup = operation === 'add' && onesSum >= 10;
  const correctOnesDigit = operation === 'add' ? onesSum % 10 : (ones1 < ones2 ? (ones1 + 10 - ones2) : ones1 - ones2);
  const correctCarry = needsAdditionRegroup ? 1 : 0;
  const correctTensDigit = operation === 'add'
    ? tens1 + tens2 + correctCarry
    : (isBorrowed ? (tens1 - 1 - tens2) : tens1 - tens2);
  const finalResult = operation === 'add' ? num1 + num2 : num1 - num2;

  // Handle Ones Check
  const handleCheckOnes = () => {
    if (operation === 'add') {
      if (needsAdditionRegroup) {
        // Child should either put the ones digit or recognize we have 15
        if (onesInput === String(correctOnesDigit) || onesInput === String(onesSum)) {
          sound.playSfx('click');
          setFeedback('رائع! 7 + 8 = 15. لدينا 5 في الآحاد، و 10 تذهب إلى خانة العشرات كعشرة واحدة (إعادة تجميع)!');
          setCurrentStep(2);
        } else {
          sound.playSfx('error');
          setFeedback('اجمع الآحاد بعناية: 7 + 8 = ؟');
          onErrorMisconception?.('addition_basic_fact_error');
        }
      } else {
        if (onesInput === String(correctOnesDigit)) {
          sound.playSfx('click');
          setCurrentStep(3);
          setFeedback('ممتاز! الآن انتقل لجمع خانة العشرات.');
        } else {
          sound.playSfx('error');
          setFeedback('تحقق من ناتج جمع الآحاد.');
        }
      }
    } else {
      // Subtraction
      if (ones1 < ones2 && !isBorrowed) {
        // Misconception: Child tries to subtract 8 - 2 = 6 instead of regrouping!
        if (onesInput === String(ones2 - ones1)) {
          sound.playSfx('error');
          setFeedback('⚠️ انتبه! لا يمكننا طرح 8 من 2 بدون إعادة تجميع! لا تعكس الأرقام فتطرح الصغير من الكبير!');
          onErrorMisconception?.('reversed_subtraction_error');
          return;
        }
        setFeedback('لا يمكن طرح 8 من 2 لأن 2 أصغر! اضغط على زر "فك عشرة من العشرات" أولاً.');
      } else {
        if (onesInput === String(correctOnesDigit)) {
          sound.playSfx('click');
          setCurrentStep(3);
          setFeedback('أحسنت! 12 − 8 = 4 في خانة الآحاد. الآن اطرح العشرات المتبقية.');
        } else {
          sound.playSfx('error');
          setFeedback('احسب: 12 − 8 = ؟');
          onErrorMisconception?.('subtraction_fact_error');
        }
      }
    }
  };

  // Borrow action in subtraction
  const handleBorrowAction = () => {
    setIsBorrowed(true);
    sound.playSfx('sparkle');
    setFeedback('🔨 رائع! فككنا عشرة من خانة العشرات (أصبحت 3 عشرات)، وأضفناها للآحاد (أصبحت 12 آحاد)!');
  };

  // Carry check in addition
  const handleConfirmCarry = () => {
    if (carryInput === '1') {
      sound.playSfx('crystal');
      setFeedback('صحيح! وضعنا 1 عشرة جديدة فوق خانة العشرات. الآن اجمع كل العشرات معاً.');
      setCurrentStep(3);
    } else {
      sound.playSfx('error');
      setFeedback('العشرة الجديدة المنقولة قيمتها 1 في خانة العشرات. اكتب 1.');
      onErrorMisconception?.('regrouping_placement_error');
    }
  };

  // Tens check
  const handleCheckTens = () => {
    if (tensInput === String(correctTensDigit)) {
      sound.playSfx('success');
      setIsCompleted(true);
      setCurrentStep(4);
      setFeedback(`🎉 إجابة عبقرية! الناتج النهائي للمسألة ${num1} ${operation === 'add' ? '+' : '−'} ${num2} = ${finalResult}!`);
      onSuccess?.();
    } else {
      sound.playSfx('error');
      if (operation === 'add' && needsAdditionRegroup && tensInput === String(tens1 + tens2)) {
        setFeedback('⚠️ هل نسيت إضافة العشرة الجديدة (1) التي قمنا بإعادة تجميعها؟ 1 + 2 + 1 = ؟');
        onErrorMisconception?.('forgot_carried_ten');
      } else if (operation === 'subtract' && isBorrowed && tensInput === String(tens1 - tens2)) {
        setFeedback('⚠️ تذكر أننا أخذنا عشرة للآحاد! العشرات أصبحت 3 وليست 4. 3 − 1 = ؟');
        onErrorMisconception?.('forgot_unbundled_ten');
      } else {
        setFeedback('تحقق من حساب خانة العشرات.');
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setOnesInput('');
    setCarryInput('');
    setTensInput('');
    setIsBorrowed(false);
    setFeedback(null);
    setIsCompleted(false);
    sound.playSfx('click');
  };

  return (
    <div className="w-full max-w-xl bg-white border-3 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col items-center select-none text-right">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-800">
            {operation === 'add' ? 'الجمع الرأسي مع إعادة التجميع' : 'الطرح الرأسي مع إعادة التسمية'}
          </h3>
          <p className="text-xs font-bold text-slate-500">
            خطوة بخطوة بالترتيب الصحيح (الآحاد أولاً ثم العشرات)
          </p>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          title="إعادة المحاولة"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Vertical Math Grid */}
      <div className="bg-amber-50/50 border-2 border-amber-200 rounded-2xl p-6 w-full max-w-xs shadow-inner flex flex-col items-center">
        {/* Place Value Header */}
        <div className="grid grid-cols-2 w-full text-center pb-2 border-b-2 border-amber-300 text-sm font-black text-amber-950">
          <span className="text-sky-800">عشرات (Tens)</span>
          <span className="text-amber-800">آحاد (Ones)</span>
        </div>

        {/* Carry / Borrow Box Row */}
        <div className="grid grid-cols-2 w-full text-center py-2 h-12 items-center">
          {operation === 'add' ? (
            <div className="flex items-center justify-center">
              {currentStep >= 2 && needsAdditionRegroup && (
                <input
                  type="text"
                  maxLength={1}
                  value={carryInput}
                  disabled={currentStep > 2}
                  onChange={(e) => setCarryInput(e.target.value)}
                  placeholder="+"
                  className={`w-8 h-8 text-center text-sm font-black rounded-lg border-2 ${
                    carryInput === '1'
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                      : 'border-amber-400 bg-white text-amber-950 animate-bounce'
                  }`}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center text-xs font-black">
              {isBorrowed && (
                <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md border border-rose-300">
                  {tens1 - 1} عشرات
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-center text-xs font-black">
            {operation === 'subtract' && isBorrowed && (
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">
                12 آحاد
              </span>
            )}
          </div>
        </div>

        {/* Number 1 Row */}
        <div className="grid grid-cols-2 w-full text-center py-2 text-2xl font-black text-slate-800">
          <span className={isBorrowed ? 'line-through text-slate-400' : 'text-sky-900'}>
            {tens1}
          </span>
          <span className={isBorrowed ? 'line-through text-slate-400' : 'text-amber-900'}>
            {ones1}
          </span>
        </div>

        {/* Number 2 Row with Operation Symbol */}
        <div className="relative grid grid-cols-2 w-full text-center py-2 text-2xl font-black text-slate-800 border-b-4 border-slate-800">
          <span className="absolute -right-3 text-2xl text-amber-700">
            {operation === 'add' ? '+' : '−'}
          </span>
          <span className="text-sky-900">{tens2}</span>
          <span className="text-amber-900">{ones2}</span>
        </div>

        {/* Result Input Row */}
        <div className="grid grid-cols-2 w-full text-center pt-3 gap-2">
          {/* Tens Input */}
          <div className="flex justify-center">
            <input
              type="text"
              maxLength={2}
              value={tensInput}
              disabled={currentStep < 3 || isCompleted}
              onChange={(e) => setTensInput(e.target.value)}
              placeholder="؟"
              className={`w-14 h-12 text-center text-2xl font-black rounded-xl border-3 transition-all ${
                currentStep === 3
                  ? 'border-sky-500 bg-white ring-2 ring-sky-300'
                  : currentStep > 3
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Ones Input */}
          <div className="flex justify-center">
            <input
              type="text"
              maxLength={2}
              value={onesInput}
              disabled={currentStep > 1 && !needsAdditionRegroup ? false : currentStep > 2}
              onChange={(e) => setOnesInput(e.target.value)}
              placeholder="؟"
              className={`w-14 h-12 text-center text-2xl font-black rounded-xl border-3 transition-all ${
                currentStep === 1
                  ? 'border-amber-500 bg-white ring-2 ring-amber-300'
                  : currentStep > 1
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 bg-slate-100'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Guided Step Actions */}
      <div className="w-full mt-4 flex flex-col gap-2">
        {currentStep === 1 && (
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {operation === 'subtract' && ones1 < ones2 && !isBorrowed ? (
              <button
                onClick={handleBorrowAction}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow animate-pulse flex items-center justify-center gap-2"
              >
                <span>🔨 فك عشرة واحدة لزيادة الآحاد (إعادة التسمية)</span>
              </button>
            ) : (
              <button
                onClick={handleCheckOnes}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow active:scale-95"
              >
                <span>تأكيد ناتج خانة الآحاد</span>
              </button>
            )}
          </div>
        )}

        {currentStep === 2 && needsAdditionRegroup && (
          <button
            onClick={handleConfirmCarry}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm shadow animate-pulse"
          >
            <span>تأكيد نقل 1 عشرة جديدة لخانة العشرات</span>
          </button>
        )}

        {currentStep === 3 && (
          <button
            onClick={handleCheckTens}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow active:scale-95"
          >
            <span>تأكيد ناتج خانة العشرات</span>
          </button>
        )}
      </div>

      {/* Feedback & Miro Advice */}
      {feedback && (
        <div className="w-full mt-3 p-3 bg-slate-100 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 text-center">
          {feedback}
        </div>
      )}
    </div>
  );
};
