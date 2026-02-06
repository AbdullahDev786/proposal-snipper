// "use client"
// import { useState, useEffect } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { useRouter } from 'next/navigation'
// // ADDED 'Save' and 'Settings' to the imports below
// import { 
//   User, Briefcase, Sparkles, Loader2, Plus, X, 
//   ChevronLeft, Type, Save, Settings 
// } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Link from 'next/link'

// export default function Onboarding() {
//   const router = useRouter()
//   const supabase = createClient()
//   const [loading, setLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)
//   const [newSkill, setNewSkill] = useState('')
  
//   const [profile, setProfile] = useState({
//     full_name: '',
//     experience: '',
//     tone_preference: 'Professional',
//     skills: [] as { name: string }[]
//   })

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const { data: { session } } = await supabase.auth.getSession()
//       if (!session) return router.push('/signup')
      
//       const { data } = await supabase.from('user_profiles')
//         .select('*')
//         .eq('id', session.user.id)
//         .single()
        
//       if (data) setProfile({
//         full_name: data.full_name || '',
//         experience: data.experience || '',
//         tone_preference: data.tone_preference || 'Professional',
//         skills: data.skills || []
//       })
//       setLoading(false)
//     }
//     fetchProfile()
//   }, [router, supabase])

//   const handleSave = async () => {
//     setIsSaving(true)
//     const { data: { user } } = await supabase.auth.getUser()
    
//     const { error } = await supabase.from('user_profiles').upsert({
//       id: user?.id,
//       full_name: profile.full_name,
//       experience: profile.experience,
//       tone_preference: profile.tone_preference,
//       skills: profile.skills,
//       updated_at: new Date()
//     })

//     if (!error) {
//       toast.success("Master Profile Synced!")
//       router.push('/dashboard')
//     } else {
//       toast.error("Sync failed: " + error.message)
//     }
//     setIsSaving(false)
//   }

//   const addSkill = () => {
//     if (!newSkill.trim()) return
//     if (profile.skills.some(s => s.name.toLowerCase() === newSkill.toLowerCase())) {
//       return toast.error("Skill already exists")
//     }
//     setProfile({ ...profile, skills: [...profile.skills, { name: newSkill.trim() }] })
//     setNewSkill('')
//   }

//   if (loading) return (
//     <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
//       <Loader2 className="animate-spin text-indigo-500" size={40} />
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 flex items-center justify-center">
//       <div className="w-full max-w-2xl bg-[#1e293b] border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
//         <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-[#243146]">
//           <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold">
//             <ChevronLeft size={18} /> BACK
//           </Link>
//           <h1 className="text-xl font-black italic flex items-center gap-2">
//             <Sparkles className="text-indigo-500" size={20} /> MASTER PROFILE
//           </h1>
//           <div className="w-10" />
//         </div>

//         <div className="p-8 space-y-8">
//           {/* REAL NAME FIELD */}
//           <div>
//             <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Your Real Name (For AI Sign-off)</label>
//             <div className="relative">
//               <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
//               <input 
//                 className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
//                 placeholder="e.g. Ahmad Raza"
//                 value={profile.full_name}
//                 onChange={(e) => setProfile({...profile, full_name: e.target.value})}
//               />
//             </div>
//           </div>

//           {/* BIO / EXPERIENCE */}
//           <div>
//             <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Professional Experience & Bio</label>
//             <textarea 
//               className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white h-32 focus:border-indigo-500 outline-none resize-none"
//               placeholder="Tell the AI about your background so it can write better hooks..."
//               value={profile.experience}
//               onChange={(e) => setProfile({...profile, experience: e.target.value})}
//             />
//           </div>

//           {/* SKILLS MANAGER */}
//           <div>
//             <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Your Tech Stack / Skills</label>
//             <div className="flex gap-2 mb-4">
//               <input 
//                 className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-indigo-500"
//                 placeholder="Add skill (e.g. Next.js)"
//                 value={newSkill}
//                 onChange={(e) => setNewSkill(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && addSkill()}
//               />
//               <button onClick={addSkill} className="bg-indigo-600 hover:bg-indigo-500 p-4 rounded-xl transition-all">
//                 <Plus size={24} />
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {profile.skills.map((skill, index) => (
//                 <span key={index} className="bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
//                   {skill.name}
//                   <X 
//                     size={14} 
//                     className="cursor-pointer hover:text-red-400" 
//                     onClick={() => setProfile({...profile, skills: profile.skills.filter((_, i) => i !== index)})}
//                   />
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* TONE PREFERENCE */}
//           <div>
//             <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Proposal Tone</label>
//             <div className="grid grid-cols-3 gap-3">
//               {['Professional', 'Friendly', 'Aggressive'].map((tone) => (
//                 <button
//                   key={tone}
//                   onClick={() => setProfile({...profile, tone_preference: tone})}
//                   className={`py-3 rounded-xl font-bold text-sm transition-all ${
//                     profile.tone_preference === tone 
//                     ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
//                     : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
//                   }`}
//                 >
//                   {tone}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <button 
//             onClick={handleSave}
//             disabled={isSaving}
//             className="w-full bg-indigo-600 py-5 rounded-[1.5rem] font-black text-lg text-white shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
//           >
//             {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />} SAVE MASTER PROFILE
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }




"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  User, Sparkles, Loader2, Plus, X, 
  ChevronLeft, Save, Target, Zap
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function Onboarding() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  
  const [profile, setProfile] = useState({
    full_name: '',
    experience: '',
    tone_preference: 'Professional',
    skills: [] as { name: string }[]
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/login')
      
      const { data } = await supabase.from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        
      if (data) setProfile({
        full_name: data.full_name || '',
        experience: data.experience || '',
        tone_preference: data.tone_preference || 'Professional',
        skills: data.skills || []
      })
      setLoading(false)
    }
    fetchProfile()
  }, [router, supabase])

  const handleSave = async () => {
    setIsSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!profile.full_name || !profile.experience) {
      toast.error("Name and Experience are required for AI accuracy.")
      setIsSaving(false)
      return
    }

    try {
      // 1. Update the Database
      const { error: dbError } = await supabase.from('user_profiles').upsert({
        id: user?.id,
        full_name: profile.full_name,
        experience: profile.experience,
        tone_preference: profile.tone_preference,
        skills: profile.skills,
        updated_at: new Date()
      })

      if (dbError) throw dbError

      // 2. CRITICAL: Set the onboarding flag in Supabase Auth Metadata
      // This tells your proxy.ts that the user is allowed into the dashboard
      const { error: authError } = await supabase.auth.updateUser({
        data: { onboarding_done: true }
      })

      if (authError) throw authError

      toast.success("Master Profile Primed!")
      router.push('/dashboard')
      
    } catch (error: any) {
      toast.error("Sync failed: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const addSkill = () => {
    if (!newSkill.trim()) return
    if (profile.skills.some(s => s.name.toLowerCase() === newSkill.toLowerCase())) {
      return toast.error("Skill already exists")
    }
    setProfile({ ...profile, skills: [...profile.skills, { name: newSkill.trim() }] })
    setNewSkill('')
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Loading Arsenal...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-zinc-200 p-6 flex items-center justify-center">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10">
        {/* Header */}
        <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
          <button onClick={() => router.back()} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold tracking-tighter">
            <ChevronLeft size={16} /> ESCAPE
          </button>
          <h1 className="text-sm font-black italic flex items-center gap-2 tracking-[0.2em] text-white uppercase">
            <Target className="text-indigo-500" size={18} /> Master Profile
          </h1>
          <div className="w-12" /> {/* Balancing spacer */}
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 flex gap-4 items-start">
            <Zap className="text-indigo-500 shrink-0" size={20} />
            <p className="text-[11px] text-zinc-400 leading-relaxed uppercase tracking-wider">
              This data acts as the <span className="text-white font-bold">Base Intel</span> for every proposal. The AI will use your bio and skills to tailor its tone and technical language.
            </p>
          </div>

          {/* NAME FIELD */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">Signature Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
              <input 
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
                placeholder="How should you sign off?"
                value={profile.full_name}
                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
              />
            </div>
          </div>

          {/* BIO */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">Operational Experience (Bio)</label>
            <textarea 
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 text-white h-32 focus:border-indigo-500/50 outline-none resize-none placeholder:text-zinc-700 leading-relaxed text-sm"
              placeholder="e.g. 5 years of React experience, specialized in SaaS Fintech. I focus on clean code and rapid deployment..."
              value={profile.experience}
              onChange={(e) => setProfile({...profile, experience: e.target.value})}
            />
          </div>

          {/* SKILLS */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">Tech Stack Arsenal</label>
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-indigo-500/50 text-sm placeholder:text-zinc-700"
                placeholder="Add tech (e.g. Tailwind)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              />
              <button onClick={addSkill} className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-xl transition-all border border-zinc-700">
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {profile.skills.map((skill, index) => (
                <span key={index} className="bg-zinc-900 text-zinc-300 border border-zinc-800 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 uppercase tracking-tighter hover:border-red-500/50 transition-colors group">
                  {skill.name}
                  <X 
                    size={12} 
                    className="cursor-pointer group-hover:text-red-500" 
                    onClick={() => setProfile({...profile, skills: profile.skills.filter((_, i) => i !== index)})}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* TONE */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">Default Voice Tone</label>
            <div className="grid grid-cols-3 gap-3">
              {['Professional', 'Friendly', 'Aggressive'].map((tone) => (
                <button
                  key={tone}
                  onClick={() => setProfile({...profile, tone_preference: tone})}
                  className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border ${
                    profile.tone_preference === tone 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={16} />} Save Intel & Proceed
          </button>
        </div>
      </div>
    </div>
  )
}