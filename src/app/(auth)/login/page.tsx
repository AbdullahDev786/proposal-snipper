"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Target, Mail, Lock, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Welcome back, Sniper.")
      router.push('/dashboard')
    }
    setLoading(false)
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
          <h2 className="text-white text-2xl font-black italic uppercase tracking-tighter">Target Acquired? Sign In.</h2>
        </div>

        <div className="bg-[#1e293b] p-8 rounded-[3rem] border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl -mr-16 -mt-16"></div>
          
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" required 
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-all font-medium" 
                placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" required 
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-all font-medium" 
                  placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end px-2">
                <Link href="/forgot-password" className="text-indigo-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
  Forgot Password?
</Link>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-white hover:bg-indigo-500 transition-all flex justify-center shadow-xl shadow-indigo-600/20">
              {loading ? <Loader2 className="animate-spin" /> : "ENTER DASHBOARD"}
            </button>
          </form>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 border-t border-slate-800"></div>
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">OR</span>
            <div className="flex-1 border-t border-slate-800"></div>
          </div>

          <button onClick={handleGoogleLogin} className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" /> GOOGLE
          </button>
        </div>

        <p className="text-center text-slate-500 font-bold text-sm">
          New to the field? <Link href="/signup" className="text-indigo-400 hover:underline">Create an Account</Link>
        </p>
      </div>
    </div>
  )
}