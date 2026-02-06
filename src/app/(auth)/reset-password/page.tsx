"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, Target } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Password updated! Target re-acquired.")
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Target className="text-indigo-500 mx-auto mb-4" size={40} />
          <h2 className="text-white text-3xl font-black italic uppercase italic">Set New Credentials</h2>
        </div>
        <div className="bg-[#1e293b] p-8 rounded-[3rem] border border-slate-800 shadow-2xl">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" required 
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 font-medium" 
                placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button disabled={loading} className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-white hover:bg-indigo-500 transition-all">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "UPDATE PASSWORD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}