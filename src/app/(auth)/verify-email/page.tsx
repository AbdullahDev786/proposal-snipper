"use client"
import { Mail, ArrowLeft, Target } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-8">
        <div className="bg-indigo-600/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-indigo-500/30 animate-pulse">
          <Mail className="text-indigo-400" size={40} />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-white italic italic uppercase">Check Your Inbox, Sniper.</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            We've sent a reconnaissance link to your email. Click it to verify your identity and unlock your 3 free snipes.
          </p>
        </div>
        <div className="pt-8">
          <Link href="/login" className="text-slate-500 hover:text-white flex items-center justify-center gap-2 font-bold transition-colors">
            <ArrowLeft size={18} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}