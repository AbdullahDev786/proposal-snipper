// import { createBrowserClient } from '@supabase/ssr'

// export const createClient = () =>
//   createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )

import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        // This is the "Nuclear Option" to fix terminal 'fetch failed' errors
        fetch: async (url, options) => {
          const MAX_RETRIES = 3;
          for (let i = 0; i < MAX_RETRIES; i++) {
            try {
              return await fetch(url, options);
            } catch (err) {
              if (i === MAX_RETRIES - 1) throw err;
              // Wait 500ms before retrying
              await new Promise((res) => setTimeout(res, 500));
            }
          }
          return fetch(url, options);
        },
      },
    }
  )