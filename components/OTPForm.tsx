'use client';

import type { FormEvent } from 'react';
import type { SlotProps } from 'input-otp';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import { OTPInput } from 'input-otp';
import { IconLoader2 } from '@tabler/icons-react';
import Header from '#/components/Header';

export default function OTPForm() {
  const params = useSearchParams();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [otp, setOtp] = useState('');
  const [pending, setPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if ('OTPCredential' in window) {
      navigator.credentials.get({
        otp: { transport: ['sms'] }
      }).then(otp => {
        setOtp(otp?.code);
      }).catch(err => {
        console.log('error when get otp');
        console.log(err);
      });
    }
  }, []);

  const onConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    setIsSubmitted(false);

    setTimeout(() => {
      setPending(false);
      validateOtp();
      setIsSubmitted(true);
    }, 3000);
  };

  const validateOtp = () => {
    if (otp === params.get('code')) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  };

  const onComplete = () => {
    btnRef.current!.focus();
    btnRef.current!.click();
  };

  return isSubmitted ? (
    <div className="w-full h-full grid place-items-center">
      <p className={`text-[20vw] uppercase animate-bounce ${isSuccess ? 'text-teal-500' : 'text-red-600'}`}>{isSuccess ? 'SUCCESS' : 'FAILD'}</p>
    </div>
  ) : (
    <>
      <Header />
      <form className="flex flex-col" onSubmit={onConfirm}>
        <OTPInput 
          autoFocus
          autoComplete="one-time-code"
          value={otp}
          onChange={value => setOtp(value)}
          onComplete={onComplete}
          maxLength={6} 
          containerClassName="py-6 md:py-10 flex items-center justify-center gap-2 md:gap-3 group" 
          render={({slots})  => slots.map((slot, idx) => (
            <Slot key={idx} {...slot} />
          ))} 
        />
        <button ref={btnRef} className="mt-8 md:mt-12 mx-auto w-40 py-2 md:py-4 flex justify-center text-slate-100 bg-slate-600 dark:bg-slate-800 hover:bg-slate-700 dark:hover:bg-slate-900/95 transition-all duration-200 rounded disabled:opacity-50 disabled:hover:bg-slate-600 disabled:dark:hover:bg-slate-800" disabled={pending}>
          {pending ? <IconLoader2 className="animate-spin" /> : 'Confirm'}
        </button>
      </form>
    </>
  )
}

function Slot(props: SlotProps) {
  const outlineStyles = props.isActive ? 'outline:3 md:outline-4' : 'outline-0' 

  return (
    <div className={`${outlineStyles} relative w-12 h-14 md:w-20 md:h-28 text-[2rem] md:text-[3rem] flex items-center justify-center text-gray-700 dark:text-gray-100 border border-slate-400 dark:border-gray-600 rounded group-hover:border-gray-600 group-hover:dark:border-gray-400 transition-all duration-200 outline outline-slate-500 dark:outline-white`}>
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-6 md:h-16 bg-slate-600 dark:bg-gray-100" />
    </div>
  );
}