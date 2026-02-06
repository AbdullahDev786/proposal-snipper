"use client"

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { 
  Target, Send, X, Sparkles, Loader2, Copy, Trash2, Save, 
  PenTool, User, LayoutDashboard, LogOut, Zap, Edit3, Search, Brain 
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { generateProposal, saveSnipe, deleteSnipe } from './actions'



export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const [profile, setProfile] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [isSnipeModalOpen, setIsSnipeModalOpen] = useState(false)
  const [currentSnipeId, setCurrentSnipeId] = useState<string | null>(null)
  const [proposalTitle, setProposalTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [generatedProposal, setGeneratedProposal] = useState('')
  // Add this with your other useStates
const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false)
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(true)

  const [activeStep, setActiveStep] = useState(0)
  const steps = [
    { label: "Targeting", icon: <Target size={14} /> },
    { label: "Scanned", icon: <Search size={14} /> },
    { label: "Calibrated", icon: <Brain size={14} /> },
    { label: "Firing", icon: <Zap size={14} /> }
  ]

  useEffect(() => {
  if (isGenerating) {
    document.title = "Targeting... | Sniper.ai";
  } else if (isSnipeModalOpen) {
    document.title = proposalTitle ? `${proposalTitle} | Sniper.ai` : "New Deployment | Sniper.ai";
  } else {
    document.title = "Mission Control | Sniper.ai";
  }
}, [isGenerating, isSnipeModalOpen, proposalTitle]);

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return router.push('/login')
    
    let { data: prof, error } = await supabase.from('user_profiles').select('*').eq('id', session.user.id).single()
    if (!prof || error) {
      const { data: newProf } = await supabase.from('user_profiles').insert([{ id: session.user.id, full_name: session.user.user_metadata.full_name || 'Sniper', credits: 999 }]).select().single()
      prof = newProf
    }

    const { data: hist } = await supabase.from('snipes').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    setHistory(hist || []); setProfile(prof); setLoading(false)
  }

  const copyToClipboard = () => {
    if (!generatedProposal) return
    navigator.clipboard.writeText(generatedProposal)
    toast.success("Copied to clipboard")
  }

  // const handleSnipe = async () => {
  //   if (!jobDescription) return toast.error("Provide recon data first.")
  //   setIsGenerating(true); setGeneratedProposal(''); setActiveStep(0)
  //   scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    
  //   try {
  //     await new Promise(r => setTimeout(r, 2500)); setActiveStep(1)
  //     await new Promise(r => setTimeout(r, 2500)); setActiveStep(2)
  //     await new Promise(r => setTimeout(r, 2500)); setActiveStep(3)

  //     const res = await generateProposal(jobDescription, profile)
  //     if (!res) throw new Error("Sniper missed.")
  //     setGeneratedProposal(res)
  //     toast.success("Target Eliminated")
  //     await fetchInitialData() 
  //   } catch (e: any) { 
  //     toast.error("AI units busy.") 
  //   } finally { 
  //     setIsGenerating(false) 
  //   }
  // }

  // very well working
//   const handleSnipe = async () => {
//   if (isGenerating) return;

//   setIsGenerating(true);
//   setGeneratedProposal("");

//   // 1. Run the animations FIRST
//   setStep(1);
//   await new Promise(r => setTimeout(r, 1000));
//   setStep(2);
//   await new Promise(r => setTimeout(r, 1000));
//   setStep(3);
//   await new Promise(r => setTimeout(r, 1000));
//   setStep(4);
  
//   // 2. IMPORTANT: Wait a tiny bit more so the UI "paints" Box 4
//   await new Promise(r => setTimeout(r, 500));

//   // 3. Now trigger the AI without blocking the UI thread
//   try {
//     const result = await generateProposal(jobDescription, profile);
//     setGeneratedProposal(result);
//     toast.success("Snipe Successful!");
//   } catch (error: any) {
//     toast.error(error.message || "AI units failed");
//   } finally {
//     setStep(0);
//     setIsGenerating(false);
//   }
// };

// very fast working yet
    const handleSnipe = async () => {
  if (isGenerating) return;
  setIsGenerating(true);
  setGeneratedProposal("");

  // Step 1
  setStep(1);
  await new Promise(r => setTimeout(r, 1200));
  // Step 2
  setStep(2);
  await new Promise(r => setTimeout(r, 1200));
  // Step 3
  setStep(3);
  await new Promise(r => setTimeout(r, 1200));
  // Step 4
  setStep(4);
  await new Promise(r => setTimeout(r, 1200));

  // By the time the code reaches here, Box 4 is 100% visible
  try {
    const result = await generateProposal(jobDescription, profile);
    setGeneratedProposal(result);
    toast.success("Snipe Successful!");
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setStep(0);
    setIsGenerating(false);
  }
};



  const handleSave = async () => {
    const t = toast.loading("Syncing mission logs...")
    try {
      await saveSnipe({ 
        id: currentSnipeId || undefined, 
        job_title: proposalTitle || "New Mission", 
        job_description: jobDescription, 
        generated_proposal: generatedProposal 
      })
      toast.success("Logs Updated", { id: t }); await fetchInitialData(); setIsSnipeModalOpen(false)
    } catch (err: any) { toast.error("Save failed", { id: t }) }
  }

  const handleDelete = async (id: string, e: any) => {
    e.stopPropagation()
    const t = toast.loading("Deleting...")
    try {
      await deleteSnipe(id); setHistory(prev => prev.filter(item => item.id !== id))
      toast.success("Deleted", { id: t })
    } catch (err) { toast.error("Delete failed", { id: t }) }
  }

  const viewSnipe = (s: any) => {
    setCurrentSnipeId(s.id); setProposalTitle(s.job_title); setJobDescription(s.job_description); setGeneratedProposal(s.generated_proposal); setIsSnipeModalOpen(true);
  }

  const editSnipe = (s: any) => {
    setCurrentSnipeId(s.id); setProposalTitle(s.job_title); setJobDescription(s.job_description); setGeneratedProposal(''); setIsSnipeModalOpen(true);
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-indigo-500 uppercase tracking-widest text-[10px]">
      <Loader2 className="animate-spin mb-4" size={32} /> Initializing...
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans">
      <aside className="fixed left-0 top-0 h-full w-64 bg-black border-r border-zinc-900 p-6 hidden lg:flex flex-col z-40">
        <div className="flex items-center gap-2 mb-10 text-white font-black text-xl italic tracking-tighter">
          <Target size={24} className="text-indigo-500" /> SNIPER.AI
        </div>
        <nav className="space-y-1 flex-1 font-mono uppercase text-[10px] font-bold tracking-widest">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600/10 text-indigo-400 font-bold">
            <LayoutDashboard size={16}/> Dashboard
          </Link>
          <Link href="/onboarding" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:text-white transition-all">
            <User size={16}/> Master Profile
          </Link>
        </nav>
        <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="flex items-center gap-3 px-4 py-3 text-zinc-700 hover:text-red-500 transition-colors border-t border-zinc-900 pt-6 font-mono text-[10px] font-bold uppercase tracking-widest">
          <LogOut size={16}/> Abort
        </button>
      </aside>

      <main className="lg:ml-64 p-6 lg:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Mission Logs</h1>
          <button onClick={() => { setIsSnipeModalOpen(true); setGeneratedProposal(''); setProposalTitle(''); setJobDescription(''); setCurrentSnipeId(null); }} className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg">
            <Send size={16} /> New Deployment
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {history.map((s) => (
            <div key={s.id} onClick={() => viewSnipe(s)} className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl cursor-pointer hover:border-indigo-600/50 transition-all group relative">
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-500"><PenTool size={18} /></div>
                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); editSnipe(s); }} className="p-2 text-zinc-600 hover:text-white transition-colors"><Edit3 size={18}/></button>
                  <button onClick={(e) => handleDelete(s.id, e)} className="p-2 text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
              </div>
              <p className="font-bold text-white mb-2 uppercase tracking-tight truncate">{s.job_title || "Untitled mission"}</p>
              <p className="text-[9px] font-mono text-zinc-600">{new Date(s.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {isSnipeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border border-zinc-900 w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl relative">
              
              {isGenerating && (
                <div className="absolute top-20 right-6 z-[60] flex flex-col gap-2">
                  {steps.map((s, idx) => (
                    <div key={idx} className={`flex items-center gap-3 px-4 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${idx <= activeStep ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-700'}`}>
                      {idx === activeStep ? <Loader2 size={12} className="animate-spin" /> : s.icon} {s.label}
                    </div>
                  ))}
                </div>
              )}

              <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/10">
                <div className="flex gap-2">
                  {/* DYNAMIC BUTTONS BASED ON STATE */}
                  {!generatedProposal ? (
                    <>
                      <button onClick={handleSnipe} disabled={isGenerating} className="px-6 py-2.5 bg-white text-black rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all">
                        {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>}
                        {isGenerating ? "Engaging..." : "Initiate Snipe"}
                      </button>
                      
                      {currentSnipeId && (
                        <button onClick={handleSave} disabled={isGenerating} className="px-6 py-2.5 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-white hover:bg-zinc-700 transition-all">
                          <Save size={14}/> Sync Changes
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button onClick={handleSave} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500"><Save size={14}/> Save Result</button>
                      <button onClick={copyToClipboard} className="px-6 py-2.5 bg-zinc-800 text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Copy size={14}/> Copy Intel</button>
                    </>
                  )}
                </div>
                <button onClick={() => setIsSnipeModalOpen(false)} className="text-zinc-600 hover:text-white transition-colors"><X size={24}/></button>
              </div>

              <div ref={scrollRef} className="p-8 overflow-y-auto custom-scrollbar">
                {!generatedProposal ? (
                  <div className={`space-y-8 transition-all ${isGenerating ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">Mission Name</label>
                      <input className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 px-6 text-white font-bold focus:border-indigo-600 outline-none" value={proposalTitle} onChange={(e) => setProposalTitle(e.target.value)} placeholder="e.g. Web Developer Role" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">Job Recon (URL or Text)</label>
                      <textarea className="w-full min-h-[400px] bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-zinc-400 focus:border-indigo-600 outline-none resize-none leading-relaxed" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste link or text..." />
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-10">
                    <div className="bg-zinc-900/20 p-8 lg:p-12 rounded-[2rem] border border-zinc-900 prose prose-invert prose-indigo max-w-none text-zinc-300 leading-relaxed shadow-inner">
                      <ReactMarkdown>{generatedProposal}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}





































// "use client"

// import { useEffect, useState, useRef } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { useRouter } from 'next/navigation'
// import ReactMarkdown from 'react-markdown'
// import { 
//   Target, Send, X, Sparkles, Loader2, Copy, Trash2, Save, 
//   PenTool, User, LayoutDashboard, LogOut, Zap, Edit3, Search, Brain 
// } from 'lucide-react'
// import toast from 'react-hot-toast'
// import Link from 'next/link'
// import { saveSnipe, deleteSnipe } from './actions' // Removed generateProposal as we use the API now
// // import { useCompletion } from 'ai/react'
// import { useCompletion } from '@ai-sdk/react';

// export default function Dashboard() {
//   const router = useRouter()
//   const supabase = createClient()
//   const scrollRef = useRef<HTMLDivElement>(null)
  
//   const [profile, setProfile] = useState<any>(null)
//   const [history, setHistory] = useState<any[]>([])
//   const [isSnipeModalOpen, setIsSnipeModalOpen] = useState(false)
//   const [currentSnipeId, setCurrentSnipeId] = useState<string | null>(null)
//   const [proposalTitle, setProposalTitle] = useState('')
//   const [jobDescription, setJobDescription] = useState('')
//   const [generatedProposal, setGeneratedProposal] = useState('')
//   const [isSaving, setIsSaving] = useState(false)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [activeStep, setActiveStep] = useState(-1) // Start at -1 so none are lit initially
//   const [loading, setLoading] = useState(true)

//   const steps = [
//     { label: "Targeting", icon: <Target size={14} /> },
//     { label: "Scanned", icon: <Search size={14} /> },
//     { label: "Calibrated", icon: <Brain size={14} /> },
//     { label: "Firing", icon: <Zap size={14} /> }
//   ]

//   // --- STREAMING ENGINE ---
//   const { completion, complete, isLoading: isStreaming } = useCompletion({
//     api: '/api/generate',
//     onFinish: (_prompt: string, completionText: string) => { // Added types here
//       setGeneratedProposal(completionText)
//       toast.success("Snipe Successful!")
//       setIsGenerating(false)
//       setActiveStep(-1)
//     },
//     onError: (err: Error) => {
//       toast.error("Signal lost. Check connection.")
//       setIsGenerating(false)
//       setActiveStep(-1)
//     }
//   })

//   useEffect(() => {
//     fetchInitialData()
//   }, [])

//   const fetchInitialData = async () => {
//     const { data: { session } } = await supabase.auth.getSession()
//     if (!session) return router.push('/login')
    
//     let { data: prof, error } = await supabase.from('user_profiles').select('*').eq('id', session.user.id).single()
//     if (!prof || error) {
//       const { data: newProf } = await supabase.from('user_profiles').insert([{ id: session.user.id, full_name: session.user.user_metadata.full_name || 'Sniper', credits: 999 }]).select().single()
//       prof = newProf
//     }

//     const { data: hist } = await supabase.from('snipes').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
//     setHistory(hist || []); setProfile(prof); setLoading(false)
//   }

//   const copyToClipboard = () => {
//     const textToCopy = completion || generatedProposal
//     if (!textToCopy) return
//     navigator.clipboard.writeText(textToCopy)
//     toast.success("Copied to clipboard")
//   }

//   const handleSnipe = async () => {
//     if (isGenerating || isStreaming) return
    
//     setIsGenerating(true)
//     setGeneratedProposal('') // Reset previous
    
//     // --- ANIMATION SEQUENCE ---
//     // This forces the HUD boxes to glow in order
//     for (let i = 0; i < 4; i++) {
//       setActiveStep(i)
//       await new Promise(r => setTimeout(r, 800))
//     }

//     // --- TRIGGER STREAM ---
//     try {
//       await complete(jobDescription, {
//         body: { userProfile: profile }
//       })
//     } catch (err) {
//       setIsGenerating(false)
//       setActiveStep(-1)
//     }
//   }

//   const handleSave = async () => {
//     const finalProposal = completion || generatedProposal
//     if (!finalProposal) return

//     const t = toast.loading("Syncing mission logs...")
//     try {
//       await saveSnipe({ 
//         id: currentSnipeId || undefined, 
//         job_title: proposalTitle || "New Mission", 
//         job_description: jobDescription, 
//         generated_proposal: finalProposal 
//       })
//       toast.success("Logs Updated", { id: t }); await fetchInitialData(); setIsSnipeModalOpen(false)
//     } catch (err: any) { toast.error("Save failed", { id: t }) }
//   }

//   const handleDelete = async (id: string, e: any) => {
//     e.stopPropagation()
//     const t = toast.loading("Deleting...")
//     try {
//       await deleteSnipe(id); setHistory(prev => prev.filter(item => item.id !== id))
//       toast.success("Deleted", { id: t })
//     } catch (err) { toast.error("Delete failed", { id: t }) }
//   }

//   const viewSnipe = (s: any) => {
//     setCurrentSnipeId(s.id); setProposalTitle(s.job_title); setJobDescription(s.job_description); setGeneratedProposal(s.generated_proposal); setIsSnipeModalOpen(true);
//   }

//   const editSnipe = (s: any) => {
//     setCurrentSnipeId(s.id); setProposalTitle(s.job_title); setJobDescription(s.job_description); setGeneratedProposal(''); setIsSnipeModalOpen(true);
//   }

//   if (loading) return (
//     <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-indigo-500 uppercase tracking-widest text-[10px]">
//       <Loader2 className="animate-spin mb-4" size={32} /> Initializing...
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-[#020202] text-slate-300 font-sans">
//       <aside className="fixed left-0 top-0 h-full w-64 bg-black border-r border-zinc-900 p-6 hidden lg:flex flex-col z-40">
//         <div className="flex items-center gap-2 mb-10 text-white font-black text-xl italic tracking-tighter">
//           <Target size={24} className="text-indigo-500" /> SNIPER.AI
//         </div>
//         <nav className="space-y-1 flex-1 font-mono uppercase text-[10px] font-bold tracking-widest">
//           <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600/10 text-indigo-400 font-bold">
//             <LayoutDashboard size={16}/> Dashboard
//           </Link>
//           <Link href="/onboarding" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:text-white transition-all">
//             <User size={16}/> Master Profile
//           </Link>
//         </nav>
//         <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="flex items-center gap-3 px-4 py-3 text-zinc-700 hover:text-red-500 transition-colors border-t border-zinc-900 pt-6 font-mono text-[10px] font-bold uppercase tracking-widest">
//           <LogOut size={16}/> Abort
//         </button>
//       </aside>

//       <main className="lg:ml-64 p-6 lg:p-12">
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
//           <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Mission Logs</h1>
//           <button onClick={() => { setIsSnipeModalOpen(true); setGeneratedProposal(''); setProposalTitle(''); setJobDescription(''); setCurrentSnipeId(null); }} className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg">
//             <Send size={16} /> New Deployment
//           </button>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {history.map((s) => (
//             <div key={s.id} onClick={() => viewSnipe(s)} className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl cursor-pointer hover:border-indigo-600/50 transition-all group relative">
//               <div className="flex justify-between items-start mb-6">
//                 <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-500"><PenTool size={18} /></div>
//                 <div className="flex gap-1">
//                   <button onClick={(e) => { e.stopPropagation(); editSnipe(s); }} className="p-2 text-zinc-600 hover:text-white transition-colors"><Edit3 size={18}/></button>
//                   <button onClick={(e) => handleDelete(s.id, e)} className="p-2 text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
//                 </div>
//               </div>
//               <p className="font-bold text-white mb-2 uppercase tracking-tight truncate">{s.job_title || "Untitled mission"}</p>
//               <p className="text-[9px] font-mono text-zinc-600">{new Date(s.created_at).toLocaleDateString()}</p>
//             </div>
//           ))}
//         </div>

//         {isSnipeModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
//             <div className="bg-[#0a0a0a] border border-zinc-900 w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl relative">
              
//               {/* HUD LOADING SYSTEM */}
//               {isGenerating && (
//                 <div className="absolute top-20 right-6 z-[60] flex flex-col gap-2">
//                   {steps.map((s, idx) => (
//                     <div key={idx} className={`flex items-center gap-3 px-4 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${idx <= activeStep ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-700'}`}>
//                       {idx === activeStep && !completion ? <Loader2 size={12} className="animate-spin" /> : s.icon} {s.label}
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/10">
//                 <div className="flex gap-2">
//                   {!generatedProposal && !completion ? (
//                     <>
//                       <button onClick={handleSnipe} disabled={isGenerating || isStreaming} className="px-6 py-2.5 bg-white text-black rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all">
//                         {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>}
//                         {isGenerating ? "Engaging..." : "Initiate Snipe"}
//                       </button>
                      
//                       {currentSnipeId && (
//                         <button onClick={handleSave} className="px-6 py-2.5 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-white hover:bg-zinc-700 transition-all">
//                           <Save size={14}/> Sync Changes
//                         </button>
//                       )}
//                     </>
//                   ) : (
//                     <>
//                       <button onClick={handleSave} disabled={isStreaming} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 disabled:opacity-50"><Save size={14}/> {isStreaming ? "Generating..." : "Save Result"}</button>
//                       <button onClick={copyToClipboard} className="px-6 py-2.5 bg-zinc-800 text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Copy size={14}/> Copy Intel</button>
//                     </>
//                   )}
//                 </div>
//                 <button onClick={() => setIsSnipeModalOpen(false)} className="text-zinc-600 hover:text-white transition-colors"><X size={24}/></button>
//               </div>

//               <div ref={scrollRef} className="p-8 overflow-y-auto custom-scrollbar">
//                 {/* INPUT MODE: Shown if no proposal is being generated/viewed */}
//                 {!generatedProposal && !completion ? (
//                   <div className={`space-y-8 transition-all ${isGenerating ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
//                     <div className="space-y-2">
//                       <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">Mission Name</label>
//                       <input className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 px-6 text-white font-bold focus:border-indigo-600 outline-none" value={proposalTitle} onChange={(e) => setProposalTitle(e.target.value)} placeholder="e.g. Web Developer Role" />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">Job Recon (URL or Text)</label>
//                       <textarea className="w-full min-h-[400px] bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-zinc-400 focus:border-indigo-600 outline-none resize-none leading-relaxed" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste link or text..." />
//                     </div>
//                   </div>
//                 ) : (
//                   /* RESULT MODE: Shows Typing Effect or Saved Proposal */
//                   <div className="max-w-3xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-10">
//                     <div className="bg-zinc-900/20 p-8 lg:p-12 rounded-[2rem] border border-zinc-900 prose prose-invert prose-indigo max-w-none text-zinc-300 leading-relaxed shadow-inner">
//                       <ReactMarkdown>
//                         {completion || generatedProposal}
//                       </ReactMarkdown>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }



