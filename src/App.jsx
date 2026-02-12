import { useState } from 'react'
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
      <div className="gradient-canvas fixed inset-0 z-10 pointer-events-none">
        
      </div>
    </div>
  );
}

