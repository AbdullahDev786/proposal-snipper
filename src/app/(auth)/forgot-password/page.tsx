"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Loader2, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) toast.error(error.message)
    else toast.success("Reset link sent to your email!")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-sm">
          <ChevronLeft size={16} /> Back to Login
        </Link>
        <div className="bg-[#1e293b] p-8 rounded-[3rem] border border-slate-800 shadow-2xl space-y-6">
          <h2 className="text-white text-2xl font-black italic uppercase italic">Recover Access</h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">Enter your email and we'll send a recovery link to get you back in the field.</p>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" required 
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-all" 
                placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button disabled={loading} className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-white hover:bg-indigo-500 transition-all flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "SEND RECOVERY LINK"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}