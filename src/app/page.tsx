"use client"
import Link from 'next/link'
import { Target, Sparkles, Zap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30 font-sans">
      
      {/* --- NAVIGATION --- */}
      <nav className="flex justify-between items-center px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-indigo-500 font-black text-2xl italic">
          <Target size={32} /> SNIPER.AI
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold hover:text-white transition-colors">LOGIN</Link>
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-indigo-600/20">
            GET STARTED
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="pt-20 pb-32 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black tracking-widest uppercase mb-8 animate-fade-in">
          <Sparkles size={14} /> AI-Powered Proposal Recon
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter mb-8 leading-[0.9]">
          STOP APPLYING.<br />
          <span className="text-indigo-600">START SNIPING.</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          Generate high-caliber, personalized job proposals in seconds. Use AI to analyze requirements and deploy the perfect response.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/signup" className="group bg-white text-black px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
            DEPLOY FIRST SNIPE <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center justify-center gap-2 text-slate-500 font-bold text-sm">
            <CheckCircle2 size={18} className="text-emerald-500" /> No Credit Card Required
          </div>
        </div>
      </header>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-[#1e293b]/30 border-y border-slate-800/50 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { icon: <Zap className="text-yellow-400" />, title: "Instant Deployment", desc: "Turn a job URL into a polished proposal in under 10 seconds." },
            { icon: <Target className="text-indigo-500" />, title: "Tactical Precision", desc: "AI matches your specific skills to the job's pain points perfectly." },
            { icon: <Shield className="text-emerald-500" />, title: "Secure History", desc: "All your missions are encrypted and stored for future reference." }
          ].map((f, i) => (
            <div key={i} className="space-y-4">
              <div className="bg-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-800 shadow-xl">
                {f.icon}
              </div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{f.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 text-center border-t border-slate-800/50">
        <p className="text-slate-600 text-sm font-bold tracking-widest uppercase">
          &copy; 2026 SNIPER.AI — Built for the Hustle.
        </p>
      </footer>
    </div>
  )
}