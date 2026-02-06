"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Target, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success("Recruitment initiated.")
      // REDIRECT TO THE ENGAGING VERIFY PAGE
      router.push('/verify-email')
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.origin}/auth/callback` 
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-indigo-500 font-black text-3xl italic mb-6">
            <Target size={40} strokeWidth={3} /> SNIPER.AI
          </div>
          <h2 className="text-white text-3xl font-black italic uppercase tracking-tighter">Join the Elite.</h2>
          <p className="text-slate-500 font-bold text-sm mt-2">Precision-engineered proposals. No limits. No credits. Just results.</p>
        </div>

        <div className="bg-[#1e293b] p-8 rounded-[3rem] border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl -mr-16 -mt-16"></div>
          
          <form onSubmit={handleSignup} className="space-y-4 relative z-10">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" required 
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-all font-medium" 
                placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" required 
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-all font-medium" 
                placeholder="Create Password" value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            <button disabled={loading} className="group w-full bg-indigo-600 py-4 rounded-2xl font-black text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20">
              {loading ? <Loader2 className="animate-spin" /> : (
                <>RECRUIT ME <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 border-t border-slate-800"></div>
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Rapid Access</span>
            <div className="flex-1 border-t border-slate-800"></div>
          </div>

          <button onClick={handleGoogleLogin} className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" /> GOOGLE SIGNUP
          </button>
        </div>

        <p className="text-center text-slate-500 font-bold text-sm">
          Already a member? <Link href="/login" className="text-indigo-400 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  )
}