
// // fully working code
// 'use server'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'

// export async function generateProposal(jobDescription: string, userProfile: any) {
//   const systemPrompt = `You are an elite career strategist. 
//   User Name: ${userProfile.full_name}
//   User Role: ${userProfile.job_title}
//   User Skills: ${userProfile.skills}
//   User Resume Context: ${userProfile.resume_text}
  
//   Task: Write a highly personalized, short, and punchy job proposal. 
//   Sign off as ${userProfile.full_name}. Use Markdown formatting.`;

//   // Massive Waterfall List: 20+ models to ensure 100% uptime
//   const modelList = [
//     "google/gemini-2.0-flash-exp:free",
//     "meta-llama/llama-3.3-70b-instruct:free",
//     "google/gemini-flash-1.5-8b",
//     "meta-llama/llama-3.1-8b-instruct:free",
//     "mistralai/mistral-7b-instruct:free",
//     "microsoft/phi-3-medium-128k-instruct:free",
//     "qwen/qwen-2.5-72b-instruct",
//     "google/gemini-pro-1.5",
//     "mistralai/pixtral-12b:free",
//     "openchat/openchat-7b:free",
//     "gryphe/mythomax-l2-13b:free",
//     "undi95/toppy-m-7b:free",
//     "liquid/lfm-40b:free",
//     "nvidia/llama-3.1-nemotron-70b-instruct:free",
//     "microsoft/phi-3-mini-128k-instruct:free",
//     "qwen/qwen-2-7b-instruct:free",
//     "meta-llama/llama-3.2-3b-instruct:free",
//     "huggingfaceh4/zephyr-7b-beta:free",
//     "cognto-ai/phi-3-mini-4k-instruct",
//     "perigon/p-1-tiny:free"
//   ];

//   for (const modelId of modelList) {
//     try {
//       console.log(`Mission Control: Attempting deployment with ${modelId}`);
      
//       const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: { 
//           "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, 
//           "Content-Type": "application/json",
//           "HTTP-Referer": "http://localhost:3000",
//           "X-Title": "Sniper.ai"
//         },
//         body: JSON.stringify({
//           "model": modelId,
//           "messages": [
//             { "role": "system", "content": systemPrompt },
//             { "role": "user", "content": `Job Description to target:\n${jobDescription}` }
//           ],
//           "route": "fallback" 
//         })
//       });

//       if (!response.ok) {
//         console.warn(`Unit ${modelId} reported error. Moving to next unit.`);
//         continue; 
//       }

//       const data = await response.json();
      
//       if (data.choices?.[0]?.message?.content) {
//         // Unlimited Beta: Removed credit deduction logic
//         revalidatePath('/dashboard');
//         return data.choices[0].message.content.trim();
//       }
//     } catch (e) {
//       console.error(`Link failure with ${modelId}. Retrying...`);
//       continue; 
//     }
//   }

//   throw new Error("All Sniper units are currently engaged. Please wait 30 seconds and redeploy.");
// }

// export async function saveSnipe(snipeData: any) {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) throw new Error("Auth required");

//   // If id is null or undefined, remove it so Postgres generates a new one
//   const cleanData = { ...snipeData, user_id: user.id };
//   if (!cleanData.id) delete cleanData.id;

//   const { data, error } = await supabase.from('snipes').upsert(cleanData).select();
//   if (error) throw new Error(error.message);
  
//   revalidatePath('/dashboard');
//   return data;
// }

// export async function deleteSnipe(id: string) {
//   const supabase = await createClient();
//   const { error } = await supabase.from('snipes').delete().eq('id', id);
  
//   if (error) throw new Error(error.message);
  
//   revalidatePath('/dashboard');
// }



































































































// with link to proposal system
// 'use server'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'

// /**
//  * GENERATE PROPOSAL
//  * Handles both raw text and URLs. 
//  * Uses a waterfall of 20+ models for 100% uptime.
//  */
// export async function generateProposal(input: string, userProfile: any) {
//   let jobDescription = input;

//   // 1. LIGHTNING URL SCRAPER (Zero Cost)
//   // If the input is a link, we fetch the clean text version via Jina Reader
//   if (input.trim().startsWith('http')) {
//     try {
//       const scrapeRes = await fetch(`https://r.jina.ai/${input.trim()}`, {
//         headers: { 'Accept': 'text/event-stream' } // Optimized for speed
//       });
//       if (scrapeRes.ok) {
//         const text = await scrapeRes.text();
//         // Extracting only the first 4000 chars to keep AI processing fast
//         jobDescription = text.substring(0, 4000); 
//       }
//     } catch (e) {
//       console.error("Scraping failed, using raw URL/input as fallback");
//     }
//   }

//   const systemPrompt = `You are an elite career strategist. 
//   User Name: ${userProfile.full_name}
//   User Role: ${userProfile.job_title}
//   User Skills: ${userProfile.skills}
//   User Resume Context: ${userProfile.resume_text}
  
//   Task: Write a highly personalized, short, and punchy job proposal based on the job description provided. 
//   Sign off as ${userProfile.full_name}. Use Markdown formatting.`;

//   // 2. THE WATERFALL ENGINE (20+ Models for High Traffic)
//   const modelList = [
//     "google/gemini-2.0-flash-exp:free",
//     "meta-llama/llama-3.3-70b-instruct:free",
//     "google/gemini-flash-1.5-8b",
//     "mistralai/mistral-7b-instruct:free",
//     "microsoft/phi-3-medium-128k-instruct:free",
//     "qwen/qwen-2.5-72b-instruct",
//     "google/gemini-pro-1.5",
//     "mistralai/pixtral-12b:free",
//     "openchat/openchat-7b:free",
//     "gryphe/mythomax-l2-13b:free",
//     "undi95/toppy-m-7b:free",
//     "liquid/lfm-40b:free",
//     "nvidia/llama-3.1-nemotron-70b-instruct:free",
//     "microsoft/phi-3-mini-128k-instruct:free",
//     "qwen/qwen-2-7b-instruct:free",
//     "meta-llama/llama-3.2-3b-instruct:free",
//     "huggingfaceh4/zephyr-7b-beta:free"
//   ];

//   for (const modelId of modelList) {
//     try {
//       const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: { 
//           "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, 
//           "Content-Type": "application/json",
//           "HTTP-Referer": "http://localhost:3000",
//           "X-Title": "Sniper.ai"
//         },
//         body: JSON.stringify({
//           "model": modelId,
//           "messages": [
//             { "role": "system", "content": systemPrompt },
//             { "role": "user", "content": `Job Details:\n${jobDescription}` }
//           ],
//           "route": "fallback" 
//         })
//       });

//       if (!response.ok) continue; // Silently move to next model if busy

//       const data = await response.json();
//       if (data.choices?.[0]?.message?.content) {
//         revalidatePath('/dashboard');
//         return data.choices[0].message.content.trim();
//       }
//     } catch (e) {
//       continue; // Network failure, try next
//     }
//   }

//   throw new Error("Heavy traffic detected. Please try again in 10 seconds.");
// }

// /**
//  * SAVE SNIPE
//  * Maintained with full ID handling for both Create and Update (Pencil Edit)
//  */
// export async function saveSnipe(snipeData: any) {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) throw new Error("Auth required");

//   const cleanData = { ...snipeData, user_id: user.id };
//   // If it's a new snipe, ensure we don't pass an empty string as ID
//   if (!cleanData.id) delete cleanData.id;

//   const { data, error } = await supabase.from('snipes').upsert(cleanData).select();
//   if (error) throw new Error(error.message);
  
//   revalidatePath('/dashboard');
//   return data;
// }

// /**
//  * DELETE SNIPE
//  */
// export async function deleteSnipe(id: string) {
//   const supabase = await createClient();
//   const { error } = await supabase.from('snipes').delete().eq('id', id);
  
//   if (error) throw new Error(error.message);
  
//   revalidatePath('/dashboard');
// }

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

// 1. INITIALIZE GLOBAL SHIELD (Upstash Redis)
// This manages the "Intense Load" by tracking requests at the edge.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Limit: 5 snipes per 10 minutes per user. 
// This prevents cost spikes while allowing legitimate heavy use.
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
})

/**
 * GENERATE PROPOSAL
 * Optimized for: Slow internet, heavy AI load, and zero-cost scraping.
 */
export async function generateProposal(input: string, userProfile: any) {
  // A. LOAD PROTECTION (The Bouncer)
  const identifier = userProfile.id;
  const { success, reset } = await ratelimit.limit(identifier);

  if (!success) {
    const secondsLeft = Math.ceil((reset - Date.now()) / 1000);
    throw new Error(`System cooling down. Try again in ${secondsLeft}s.`);
  }

  let jobDescription = input;

  // B. INVISIBLE JINA SCRAPER (Cleans URLs into pure text)
  if (input.trim().startsWith('http')) {
    try {
      const scrapeRes = await fetch(`https://r.jina.ai/${input.trim()}`, {
        signal: AbortSignal.timeout(15000) // 15s timeout for scraping messy sites
      });
      if (scrapeRes.ok) {
        const text = await scrapeRes.text();
        // Extract 4000 chars to ensure the AI has enough context without being slow
        jobDescription = text.substring(0, 4000); 
      }
    } catch (e) {
      console.warn("Scraping timed out or failed, using raw input as fallback.");
    }
  }

  const systemPrompt = `You are an elite career strategist. 
  User Name: ${userProfile.full_name}
  User Role: ${userProfile.job_title}
  User Skills: ${userProfile.skills}
  User Resume Context: ${userProfile.resume_text}
  Task: Write a high-quality, personalized job proposal. Do not be overly brief; ensure it is punchy and professional. Sign off as ${userProfile.full_name}.`;

  // C. THE WATERFALL ENGINE (Uptime Insurance)
  // const modelList = [
  //   "google/gemini-2.0-flash-exp:free",
  //   "meta-llama/llama-3.3-70b-instruct:free",
  //   "mistralai/pixtral-12b:free", 
  //   "gryphe/mythomax-l2-13b:free",
  //   "openrouter/auto" 
  // ];
  const modelList = [
  "google/gemini-2.0-flash-lite:free", // ULTRA FAST (New for 2026)
  "meta-llama/llama-3.3-70b-instruct:free",
  "mistralai/mistral-7b-instruct:free", // Tiny and fast
  "openrouter/auto" 
];
  for (const modelId of modelList) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, 
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Sniper.ai"
        },
        body: JSON.stringify({
          "model": modelId,
          "messages": [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": `Job Details:\n${jobDescription}` }
          ]
        }),
        // INCREASED TIMEOUT: Accommodates slow free models + slow internet
        signal: AbortSignal.timeout(90000) 
      });

      if (!response.ok) {
        console.warn(`Model ${modelId} returned ${response.status}. Trying next...`);
        continue; 
      }

      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content.trim();
      }
    } catch (e) {
      console.error(`Model ${modelId} failed or timed out. Moving to next soldier.`);
      continue; 
    }
  }

  throw new Error("Heavy traffic on all AI nodes. Please try once more.");
}

/**
 * SAVE SNIPE (Rugged Version for Slow Connections)
 */
export async function saveSnipe(snipeData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");

  const cleanData = { 
    ...snipeData, 
    user_id: user.id,
    updated_at: new Date().toISOString() 
  };
  
  if (!cleanData.id) delete cleanData.id;

  // Retry logic: Attempt to push through slow internet 3 times
  let attempts = 0;
  while (attempts < 3) {
    try {
      const { data, error } = await supabase
        .from('snipes')
        .upsert(cleanData)
        .select();

      if (error) {
    // THIS LINE IS CRITICAL: It will print the real error in your terminal
    console.error("❌ SUPABASE DB ERROR:", error.message, "Details:", error.details);
    throw error;
  }
      
      revalidatePath('/dashboard');
      return data;
    } catch (err: any) {
      attempts++;
      console.warn(`Save attempt ${attempts} failed due to connection. Retrying...`);
      if (attempts === 3) throw new Error("Database sync failed. Check your internet.");
      
      // Exponential wait: 1.5s, then 3s
      await new Promise(res => setTimeout(res, 1500 * attempts)); 
    }
  }
}

/**
 * DELETE SNIPE
 */
export async function deleteSnipe(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('snipes').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard');
}