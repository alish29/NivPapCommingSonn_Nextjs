"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
        ),
        seconds: Math.floor(
          (distance % (1000 * 60)) / 1000
        ),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're on the list!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const timerItems = [
    { value: timeLeft.days, label: "DAYS" },
    { value: timeLeft.hours, label: "HOURS" },
    { value: timeLeft.minutes, label: "MINUTES" },
    { value: timeLeft.seconds, label: "SECONDS" },
  ];

  return (
    <main className="relative h-screen overflow-hidden bg-[#ebe6dd] text-[#1f1f1f] flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f1ea] via-[#ebe6dd] to-[#e3dbcf]" />

      {/* Blur Elements */}
      <div className="absolute top-[-150px] left-[-100px] h-[450px] w-[450px] rounded-full bg-[#c8a27a]/20 blur-[140px]" />
      <div className="absolute bottom-[-150px] right-[-100px] h-[450px] w-[450px] rounded-full bg-[#b8926a]/15 blur-[140px]" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h1 className="text-[7rem] md:text-[16rem] font-bold tracking-wider text-black/[0.025] select-none">
          NIVPAP
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-6 pt-6 pb-4 flex flex-col items-center">

        {/* Tagline */}
        <p className="text-xs uppercase tracking-[6px] text-[#b8926a] text-center">
          Packaging • Branding • Creative Studio
        </p>

        {/* Logo */}
       <h1
  className="mt-1 text-[4rem] md:text-[8rem] tracking-[0.18em] text-center text-[#111]"
  style={{ fontFamily: "Cinzel, Georgia, serif" }}
>
  NIVPAP
</h1>
        

        {/* Coming Soon */}
        <h2
  className="mt-3 text-lg md:text-3xl tracking-[0.35em] text-center text-[#111]"
  style={{ fontFamily: "Cinzel, Georgia, serif" }}
>
  COMING SOON
</h2>

        {/* Divider */}
        <div className="w-20 h-[2px] bg-[#b8926a] rounded-full mt-3" />

        {/* Description */}
        <div className="max-w-3xl text-center mt-4">
          <h3 className="text-2xl md:text-4xl font-light leading-relaxed">
            Crafting Exceptional Packaging Experiences
          </h3>

          <p className="mt-3 text-[#666] leading-7 text-base md:text-lg max-w-2xl mx-auto">
            At NIVPAP, we create premium packaging, branding,
            and creative solutions that help businesses stand out
            and leave a lasting impression.
          </p>

          <p className="mt-3 text-[#666] text-base md:text-lg">
            Our studio is preparing something remarkable.
          </p>
        </div>

        {/* Countdown */}
        <div className="mt-6">
          <p className="text-center text-xs uppercase tracking-[5px] text-[#b8926a] mb-4">
            Launching In
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {timerItems.map((item) => (
              <div
                key={item.label}
                className="h-24 w-24 md:h-28 md:w-28 bg-white/85 backdrop-blur-sm border border-[#d8c8b6] shadow-lg rounded-3xl flex flex-col items-center justify-center hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-3xl md:text-4xl font-semibold text-[#b8926a]">
                  {String(item.value).padStart(2, "0")}
                </span>

                <span className="mt-1 text-[10px] tracking-[2px] text-[#777]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Email Section */}
        <div className="mt-6 w-full max-w-2xl">
          <h3 className="mb-4 text-center text-sm uppercase tracking-[5px]">
            Get Notified When We Launch
          </h3>

          {status === "success" ? (
            <div className="flex items-center justify-center gap-3 rounded-xl border border-[#b8926a]/40 bg-[#b8926a]/10 px-5 py-4">
              <svg className="h-5 w-5 text-[#b8926a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-[#8c7b6b]">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={status === "loading"}
                className="flex-1 border border-[#d8c8b6] bg-white px-5 py-3 rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-[#b8926a]/30 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="bg-black text-white px-8 py-3 rounded-xl uppercase tracking-[2px] font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : null}
                Notify Me
              </button>
            </form>
          )}

          {status === "error" && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <svg className="h-4 w-4 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-red-600">{message}</p>
            </div>
          )}

          <p className="mt-3 text-center text-sm text-[#8c7b6b]">
            No spam, we promise.
          </p>
        </div>

      </div>
    </main>
  );
}