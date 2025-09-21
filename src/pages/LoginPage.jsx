import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhoneIcon, KeyIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const phoneSchema = yup.object({
  phoneNumber: yup
    .string()
    .required('شماره موبایل الزامی است')
    .matches(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
});

const codeSchema = yup.object({
  code: yup
    .string()
    .required('کد تأیید الزامی است')
    .test('is-six-digits', 'کد تأیید باید دقیقاً 6 رقم باشد', function(value) {
      if (!value) return false;
      const trimmed = value.trim();
      return /^\d{6}$/.test(trimmed);
    }),
});

export const LoginPage = () => {
  const [step, setStep] = useState(1); // 1: phone, 2: code
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const { register: registerUser, verify, loading, error, clearError } = useAuth();

  const phoneForm = useForm({
    resolver: yupResolver(phoneSchema),
    mode: 'onChange',
  });

  const codeForm = useForm({
    resolver: yupResolver(codeSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const handlePhoneSubmit = async (data) => {
    try {
      clearError(); // Clear any previous errors
      await registerUser(data.phoneNumber);
      setPhoneNumber(data.phoneNumber);
      setStep(2);
      phoneForm.reset(); // Clear the phone form
    } catch (error) {
      // Error is handled by context
      console.error('Phone registration error:', error);
    }
  };

  const handleCodeSubmit = async (data) => {
    try {
      clearError(); // Clear any previous errors
      console.log('Submitting code:', data);
      await verify(phoneNumber, data.code);
      navigate('/');
    } catch (error) {
      // Error is handled by context
      console.error('Code verification error:', error);
    }
  };

  const goBack = () => {
    clearError(); // Clear any errors when going back
    setStep(1);
    codeForm.reset();
  };

  // Debug form state changes
  useEffect(() => {
    if (step === 2) {
      console.log('Code form state:', {
        isValid: codeForm.formState.isValid,
        isDirty: codeForm.formState.isDirty,
        isTouched: codeForm.formState.isTouched,
        errors: codeForm.formState.errors,
        values: codeForm.getValues(),
      });
    }
  }, [codeForm.formState, step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 1 ? 'ورود / ثبت نام' : 'تأیید شماره موبایل'}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {step === 1 
                ? 'شماره موبایل خود را وارد کنید'
                : `کد تأیید ارسال شده به ${phoneNumber} را وارد کنید`
              }
            </p>
          </CardHeader>

          <CardContent>
            {step === 1 ? (
              <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                <Input
                  {...phoneForm.register('phoneNumber')}
                  type="tel"
                  label="شماره موبایل"
                  placeholder="09123456789"
                  leftIcon={PhoneIcon}
                  error={phoneForm.formState.errors.phoneNumber?.message}
                  required
                  dir="ltr"
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  disabled={!phoneForm.formState.isValid}
                >
                  ارسال کد تأیید
                </Button>
              </form>
            ) : (
              <form onSubmit={codeForm.handleSubmit(handleCodeSubmit)} className="space-y-4">
                <Input
                  {...codeForm.register('code', {
                    onChange: (e) => {
                      codeForm.trigger('code');
                    }
                  })}
                  type="text"
                  label="کد تأیید"
                  placeholder="123456"
                  leftIcon={KeyIcon}
                  error={codeForm.formState.errors.code?.message}
                  required
                  dir="ltr"
                  maxLength={6}
                />

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    loading={loading}
                    disabled={!codeForm.formState.isValid}
                  >
                    تأیید و ورود
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={goBack}
                    disabled={loading}
                  >
                    بازگشت
                  </Button>
                </div>
              </form>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm"
              >
                {error}
              </motion.div>
            )}
            
            {/* Debug info for code form */}
            {step === 2 && (
              <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                <div>Form Valid: {codeForm.formState.isValid ? 'true' : 'false'}</div>
                <div>Form Dirty: {codeForm.formState.isDirty ? 'true' : 'false'}</div>
                <div>Form Touched: {codeForm.formState.isTouched ? 'true' : 'false'}</div>
                <div>Code Value: "{codeForm.watch('code')}"</div>
                <div>Code Length: {codeForm.watch('code')?.length || 0}</div>
                <div>Has Errors: {Object.keys(codeForm.formState.errors).length > 0 ? 'true' : 'false'}</div>
                {codeForm.formState.errors.code && (
                  <div>Error: {codeForm.formState.errors.code.message}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 text-sm text-gray-500"
        >
          با ورود به سایت، شما{' '}
          <a href="/terms" className="text-primary-600 hover:underline">
            شرایط استفاده
          </a>{' '}
          و{' '}
          <a href="/privacy" className="text-primary-600 hover:underline">
            حریم خصوصی
          </a>{' '}
          را می‌پذیرید.
        </motion.div>
      </motion.div>
    </div>
  );
};