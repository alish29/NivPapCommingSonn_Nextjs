'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const LAUNCH_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getTimeLeft() {
  const diff = LAUNCH_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ComingSoon() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    intervalRef.current = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || "You're on the list!");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  const timerItems = [
    { value: time.days, label: 'Days', color: '#e9a13b' },
    { value: time.hours, label: 'Hours', color: '#3b82f6' },
    { value: time.minutes, label: 'Minutes', color: '#10b981' },
    { value: time.seconds, label: 'Seconds', color: '#ec4899' },
  ];

  return (
    <main
      style={{ backgroundColor: '#07070a', color: '#f4f4f6', height: '100vh', overflow: 'hidden' }}
      className="relative flex flex-col justify-between"
    >
      {/* Background glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 55% 30% at 70% 15%, rgba(139,92,246,0.07) 0%, transparent 70%), radial-gradient(ellipse 45% 25% at 20% 85%, rgba(59,130,246,0.04) 0%, transparent 70%)',
        }}
      />
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex w-full items-center justify-between px-6 pt-4 sm:px-10 sm:pt-6">
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Image
              src="/image.png"
              alt="NIVPAP"
              width={240}
              height={120}
              className="h-6 w-auto object-contain sm:h-7.5"
              priority
            />
          </div>
         
        </div>
        {/* Launching Soon badge */}
        <div
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-medium tracking-wide sm:px-3.5 sm:py-1.5 sm:text-xs"
          style={{
            border: '1px solid rgba(139,92,246,0.2)',
            backgroundColor: 'rgba(88,28,135,0.1)',
          }}
        >
          <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: '#a78bfa' }} />
            <span className="relative inline-flex h-full w-full rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
          </span>
          <span style={{ color: '#c4b5fd' }}>Launching Soon</span>
        </div>
      </header>

      {/* Main content — two columns */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 sm:px-10 min-h-0 overflow-hidden">
        <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12 min-h-0">

          {/* Left column */}
          <div className="flex flex-col items-start space-y-3 sm:space-y-4 max-w-md w-full">
            {/* WE ARE */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] sm:text-[10px]" style={{ color: '#a78bfa' }}>
                We Are
              </span>
              <div className="h-px w-6" style={{ backgroundColor: 'rgba(139,92,246,0.25)' }} />
            </div>

            {/* Coming Soon! */}
            <h1
              className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              style={{ color: '#ffffff' }}
            >
              Coming{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Soon!
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-sm text-[11px] leading-relaxed sm:text-xs text-zinc-400">
              NIVPAP is all set to bring you premium quality{' '}
              <span
                className="font-semibold underline decoration-2 underline-offset-4"
                style={{ color: '#c4b5fd', textDecorationColor: 'rgba(139,92,246,0.25)' }}
              >
                printing and packaging solutions
              </span>{' '}
              that elevate your brand.
            </p>

            {/* Countdown */}
            <div className="flex items-start gap-1 sm:gap-2">
              {timerItems.map((item, idx) => (
                <div key={item.label} className="flex items-start">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="relative flex items-center justify-center rounded-xl"
                      style={{
                        width: 'clamp(44px, 7.5vw, 68px)',
                        height: 'clamp(44px, 7.5vw, 68px)',
                        backgroundColor: '#0c0c11',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: `0 0 15px ${item.color}08`,
                      }}
                    >
                      <div
                        className="absolute inset-x-0 top-1/2 h-px -translate-y-px pointer-events-none"
                        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                      />
                      <span
                        className="font-mono text-base font-black tabular-nums sm:text-xl lg:text-2xl"
                        style={{ color: item.color }}
                      >
                        {pad(item.value)}
                      </span>
                    </div>
                    <span className="text-[8px] font-semibold uppercase tracking-wider sm:text-[9px]" style={{ color: '#444' }}>
                      {item.label}
                    </span>
                  </div>
                  {idx < 3 && (
                    <span
                      className="select-none px-0.5 pt-2.5 text-sm font-thin sm:pt-3 sm:text-base"
                      style={{ color: '#27272a' }}
                    >
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Get Notified card */}
            <div
              className="w-full max-w-sm rounded-xl p-3.5 sm:p-4.5"
              style={{
                backgroundColor: 'rgba(12,12,17,0.75)',
                border: '1px solid rgba(255,255,255,0.04)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Header */}
              <div className="mb-3 flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'rgba(88,28,135,0.15)',
                    border: '1px solid rgba(139,92,246,0.15)',
                  }}
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="#a78bfa" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Get Notified</h3>
                  <p className="text-[9px] text-zinc-500">Be the first to know when we launch.</p>
                </div>
              </div>

              {/* Form */}
              {status === 'success' ? (
                <div
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 border border-emerald-500/10 bg-emerald-500/5"
                >
                  <svg className="h-4.5 w-4.5 flex-shrink-0" fill="none" stroke="#34d399" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-medium" style={{ color: '#6ee7b7' }}>{message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={status === 'loading'}
                    className="flex-1 rounded-lg px-3.5 py-2 text-xs outline-none transition-all disabled:opacity-50"
                    style={{
                      backgroundColor: '#0a0a0f',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#fff',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading' || !email}
                    className="flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      color: '#fff',
                    }}
                  >
                    {status === 'loading' ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    )}
                    <span>Notify Me</span>
                  </button>
                </form>
              )}

              {status === 'error' && (
                <div className="mt-2 flex items-center gap-1.5 px-1">
                  <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="#ef4444" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[10px]" style={{ color: '#f87171' }}>{message}</p>
                </div>
              )}

              <p className="mt-2.5 text-center text-[9px] text-zinc-600">
                🔒 We respect your privacy. No spam, ever.
              </p>
            </div>
          </div>

          {/* Right column — Mockup */}
          <div className="pointer-events-none hidden select-none items-center justify-center lg:flex min-h-0">
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '1 / 1',
                border: '1px solid rgba(139,92,246,0.08)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 25px rgba(139,92,246,0.04)',
              }}
            >
              <img
                src="/mockup.png"
                alt="NIVPAP Premium Packaging Mockup"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Left-edge fade to blend into page background */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(to right, #07070a 0%, transparent 10%)' }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom copyright */}
      <div className="relative z-10 pb-3 pt-1 text-center">
        <p className="text-[9px] uppercase tracking-widest text-zinc-600">
          &copy; {new Date().getFullYear()} NIVPAP &mdash; Printing & Packaging
        </p>
      </div>
    </main>
  );
}