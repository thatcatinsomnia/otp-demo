'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconLoader2 } from '@tabler/icons-react';
import Header from '#/components/Header';

export default function Home() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [pending, setPending] = useState(false);

  const onSendSMS = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);

    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone })
    });


    if (res.status !== 200) {
      const error = await res.json();
      setPending(false);

      return window.alert(error?.errorMsg);
    }

    const { code } = await res.json();

    router.push(`/otp?code=${code}`);
  };

  return (
    <>
      <Header />
      <form className="mt-14 mx-auto max-w-[360px] flex flex-col gap-1" onSubmit={onSendSMS}>
        <input className="block p-3 w-full rounded text-gray-700" value={phone} onChange={e => setPhone(e.target.value)} />
        <button className="px-4 py-2 flex justify-center bg-slate-800 hover:bg-slate-900/95 transition-all duration-200 rounded disabled:opacity-30 disabled:bg-slate-800" disabled={pending}>
          {pending ? <IconLoader2 className="animate-spin"/> : 'Send Verify Code'}
        </button>
      </form>
    </>
  );
}
