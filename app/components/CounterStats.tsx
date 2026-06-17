"use client";

import { useEffect, useState, useRef } from "react";

interface Stat {
  displayValue: string;
  label: string;
  // internal animation
  animTarget: number;
  animCurrent: number;
  formatFn: (n: number) => string;
}

const STATS_CONFIG = [
  {
    animTarget: 10,
    label: "Años de Experiencia",
    formatFn: (n: number) => `${n}+`,
  },
  {
    // counts 0→1000, displays as "Xk+" where X = floor(n/100)*100 up to 1k+
    animTarget: 1000,
    label: "Trabajos Realizados",
    formatFn: (n: number) => n >= 1000 ? "1k+" : `${n}`,
  },
  {
    animTarget: 99,
    label: "Satisfacción Cliente",
    formatFn: (n: number) => `${n}%`,
  },
];

export default function CounterStats() {
  const [values, setValues] = useState(STATS_CONFIG.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setHasStarted(true); },
      { threshold: 0.1 }
    );
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let id: number;
    let start: number | null = null;
    const duration = 2200;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2; // ease in-out quad
      setValues(STATS_CONFIG.map((s) => Math.floor(ease * s.animTarget)));
      if (progress < 1) id = requestAnimationFrame(animate);
    };

    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [hasStarted]);

  return (
    <div ref={sectionRef} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
      {STATS_CONFIG.map((stat, idx) => (
        <div
          key={idx}
          className="p-8 bg-white/10 backdrop-blur-sm rounded-[2rem] border border-white/10 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1"
        >
          <span className="font-headline text-5xl font-extrabold block mb-2 text-white tabular-nums">
            {stat.formatFn(values[idx])}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-white/80">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
