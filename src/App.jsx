import { useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'




export default function TodoList() {
  useEffect(() => {
    import('./scripts.js').catch(err => console.error('Failed to load scripts:', err));
}, []);
  return (
    <div className="relative isolate min-h-screen bg-transparent">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/texture-background-with-silver-foil-effect.jpg')" }}
      />
      <div className="rain-container fixed inset-0 z-[5] pointer-events-none overflow-hidden">
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${Math.random() * 300}%`,
              animationDuration: `${0.1 + Math.random() * 0.6}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.4 + Math.random() * 0.5,
              height: `${30 + Math.random() * 50}px`,
            }}
          />
        ))}
      </div>
      <div className="gradient-canvas fixed inset-0 z-10 pointer-events-none">
      </div>

      <header className="relative z-20 flex ps-8 pt-8 pb-2">
        <a href=""><img src="/logo1.png" alt="Logo" className="h-16 mb-2" /></a>
      </header>
      <nav className="flex flex-col gap-8 relative z-20 ps-8 w-md list-none">
          <li>
            <a href="signin" className="hover:text-white transition-colors text-sm tracking-wide" style={{color: '#8D8F90'}}>Sign in</a>
          </li>
          <li>
            <a href="services" className="hover:text-white transition-colors text-sm tracking-wide" style={{color: '#8D8F90'}}>Услуги</a>
          </li>
          <li>
            <a href="portfolio" className="hover:text-white transition-colors text-sm tracking-wide" style={{color: '#8D8F90'}}>Портфолио</a>
          </li>
          <li>
            <a href="about" className="hover:text-white transition-colors text-sm tracking-wide" style={{color: '#8D8F90'}}>О нас</a>
          </li>
          <li>
            <a href="contacts" className="hover:text-white transition-colors text-sm tracking-wide" style={{color: '#8D8F90'}}>Контакты</a>
          </li>
      </nav>

      {/** Flicker title **/}
      {(() => {
        const letters = ['M','a','s','s','a','g','e',' ','S','a','L','o','n'];
        // Generate a random order for delays, but keep the word visually correct
        const delays = useMemo(() => letters.map(() => Math.random() * 15.0), []);
        return (
          <h1 className="glow-text fixed inset-0 z-20 flex items-center justify-center text-6xl font-extralight tracking-[1em] uppercase pointer-events-none" style={{ fontFamily: "'Yanone Kaffeesatz', sans-serif" }}>
            {letters.map((char, i) =>
              <span
                key={i}
                className="flicker"
                style={{ animationDelay: `${delays[i]}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            )}
          </h1>
        );
      })()}

    </div>
  );
}

