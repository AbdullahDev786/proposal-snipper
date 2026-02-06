'use client'
import { RotateCcw } from 'lucide-react'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-white font-black italic tracking-widest mb-2">SYSTEM HICCUP</h2>
      <p className="text-zinc-500 text-xs uppercase mb-6">The sniper's scope is foggy. Try recalibrating.</p>
      <button 
        onClick={() => reset()}
        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-indigo-500 transition-all"
      >
        <RotateCcw size={16} /> RE-ESTABLISH LINK
      </button>
    </div>
  )
}