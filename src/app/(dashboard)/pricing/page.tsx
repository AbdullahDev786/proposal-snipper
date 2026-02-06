// "use client"
// import { Check, ArrowLeft, Zap } from 'lucide-react'
// import Link from 'next/link'
// import toast from 'react-hot-toast'

// const plans = [
//   { 
//     name: "Starter", 
//     price: "Free", 
//     desc: "Perfect for exploring the field.",
//     features: ["3 high-caliber snipes", "Standard AI analysis", "Cloud save history"], 
//     current: true,
//     cta: "Active Mission"
//   },
//   { 
//     name: "Elite", 
//     price: "$19", 
//     desc: "For professionals who never miss.",
//     features: ["Unlimited monthly snipes", "Premium AI models", "Priority generation", "Custom skill matching"], 
//     current: false,
//     cta: "Upgrade to Elite"
//   }
// ]

// export default function Pricing() {
//   const handleUpgrade = (plan: string) => {
//     if (plan === "Starter") return;
//     toast.success("Redirecting to secure checkout...");
//     // Future Stripe logic goes here
//   }

//   return (
//     <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-indigo-500/30 antialiased">
//       <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24">
        
//         <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors mb-16 font-medium text-sm tracking-wide">
//           <ArrowLeft size={16} /> BACK TO BASE
//         </Link>

//         <div className="text-center mb-20">
//           <h1 className="text-white text-4xl md:text-5xl font-semibold tracking-tight mb-4">Pricing Plans</h1>
//           <p className="text-slate-500 max-w-md mx-auto">Choose the caliber of intelligence you need for your career growth.</p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//           {plans.map((p) => (
//             <div key={p.name} className={`relative p-8 rounded-3xl border transition-all duration-300 ${p.current ? 'border-slate-800 bg-slate-900/20' : 'border-indigo-500/50 bg-indigo-500/[0.02] shadow-[0_0_40px_-15px_rgba(99,102,241,0.2)]'}`}>
//               {!p.current && (
//                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
//                   Recommended
//                 </div>
//               )}
              
//               <div className="mb-8">
//                 <h3 className="text-white text-xl font-medium mb-2">{p.name}</h3>
//                 <div className="flex items-baseline gap-1">
//                   <span className="text-4xl font-bold text-white tracking-tight">{p.price}</span>
//                   {p.price !== "Free" && <span className="text-slate-500 text-sm">/month</span>}
//                 </div>
//                 <p className="text-slate-500 text-sm mt-4 leading-relaxed">{p.desc}</p>
//               </div>

//               <ul className="space-y-4 mb-10">
//                 {p.features.map(f => (
//                   <li key={f} className="flex items-center gap-3 text-sm text-slate-400">
//                     <div className="bg-indigo-500/10 p-1 rounded-full text-indigo-400"><Check size={12} /></div>
//                     {f}
//                   </li>
//                 ))}
//               </ul>

//               <button 
//                 onClick={() => handleUpgrade(p.name)}
//                 className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${p.current ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:bg-slate-200 active:scale-[0.98]'}`}>
//                 {p.cta}
//               </button>
//             </div>
//           ))}
//         </div>

//         <div className="mt-20 text-center">
//           <p className="text-slate-600 text-xs font-medium uppercase tracking-[0.2em]">Secure payments via Stripe</p>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"
import { Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const plans = [
  { 
    name: "Starter", 
    price: "Free", 
    features: ["3 high-caliber snipes", "Standard AI", "Cloud history"], 
    current: true,
    cta: "Active Mission"
  },
  { 
    name: "Elite", 
    price: "$19", 
    features: ["Unlimited snipes", "Premium AI", "Custom skill matching"], 
    current: false,
    cta: "Upgrade to Elite"
  }
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 antialiased overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors mb-8 font-medium text-xs tracking-wide">
          <ArrowLeft size={14} /> BACK TO BASE
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-white text-3xl font-semibold tracking-tight mb-2">Pricing</h1>
          <p className="text-slate-500 text-sm italic">Simple, transparent, effective.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((p) => (
            <div key={p.name} className={`relative p-6 rounded-2xl border transition-all ${p.current ? 'border-slate-800 bg-slate-900/40' : 'border-indigo-500/50 bg-indigo-500/[0.03] shadow-lg shadow-indigo-500/10'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">{p.name}</h3>
                {p.current && <span className="text-[10px] text-slate-500 font-bold border border-slate-700 px-2 py-0.5 rounded">CURRENT</span>}
              </div>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-white tracking-tight">{p.price}</span>
                {p.price !== "Free" && <span className="text-slate-500 text-xs">/mo</span>}
              </div>

              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <Check size={14} className="text-indigo-500" /> {f}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-lg font-bold text-xs transition-all ${p.current ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:bg-slate-200'}`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}