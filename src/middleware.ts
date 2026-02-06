// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function proxy(request: NextRequest) {
//   // Initialize response
//   let response = NextResponse.next({
//     request: { headers: request.headers },
//   })

//   const path = request.nextUrl.pathname

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => request.cookies.getAll(),
//         setAll: (cookiesToSet) => {
//           cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
//           response = NextResponse.next({ request })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           )
//         },
//       },
//     }
//   )

//   /**
//    * SAFETY LOCK LOGIC
//    * We use a try-catch block to handle the 'fetch failed' errors 
//    * caused by local internet instability.
//    */
//   try {

    
//     // Check user session
//     const { data: { user }, error } = await supabase.auth.getUser()

// if (user) {
//   // 1. Check if they have a 'completed_onboarding' flag in user_metadata
//   const hasCompletedOnboarding = user.user_metadata?.onboarding_done

//   // 2. If they haven't finished onboarding and aren't ALREADY on the onboarding page
//   if (!hasCompletedOnboarding && !path.startsWith('/onboarding')) {
//     return NextResponse.redirect(new URL('/onboarding', request.url))
//   }

//   // 3. If they ARE finished, don't let them go back to onboarding
//   if (hasCompletedOnboarding && path.startsWith('/onboarding')) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }
// }

//     // 1. If there's a network error (AuthRetryableFetchError), 
//     // do NOT redirect. Let the client-side handle the retry.
//     if (error && error.name === 'AuthRetryableFetchError') {
//       console.warn("Proxy: Network flicker detected. Staying on current page.")
//       return response
//     }

//     // 2. PROTECT PRIVATE ROUTES
//     const isProtectedRoute = path.startsWith('/dashboard') || 
//                            path.startsWith('/pricing') || 
//                            path.startsWith('/onboarding')

//     if (!user && isProtectedRoute) {
//       // Only redirect to login if we are CERTAIN the user is not logged in
//       return NextResponse.redirect(new URL('/login', request.url))
//     }

//     // 3. PROTECT AUTH ROUTES
//     const isAuthRoute = path === '/' || path === '/login' || path === '/signup'

//     if (user && isAuthRoute) {
//       // If logged in, warp to dashboard
//       return NextResponse.redirect(new URL('/dashboard', request.url))
//     }

//   } catch (err) {
//     // If the check fails completely due to internet, 
//     // default to 'Next' so the app doesn't crash or redirect.
//     console.error("Proxy: Critical handshake failure. Maintaining current state.")
//   }

//   return response
// }

// export const config = {
//   matcher: [
//     '/',
//     '/login',
//     '/signup',
//     '/dashboard/:path*',
//     '/pricing/:path*',
//     '/onboarding/:path*'
//   ],
// }

















// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: { headers: request.headers },
//   })

//   const path = request.nextUrl.pathname

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => request.cookies.getAll(),
//         setAll: (cookiesToSet) => {
//           cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
//           response = NextResponse.next({ request })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           )
//         },
//       },
//     }
//   )

//   try {
//     const { data: { user }, error } = await supabase.auth.getUser()

//     // 1. NETWORK SAFETY: If internet is unstable, do not redirect.
//     if (error && (error.name === 'AuthRetryableFetchError' || error.status === 0)) {
//       return response
//     }

//     // 2. LOGGED OUT LOGIC
//     if (!user) {
//       const isProtectedRoute = path.startsWith('/dashboard') || 
//                                path.startsWith('/pricing') || 
//                                path.startsWith('/onboarding')
//       if (isProtectedRoute) {
//         return NextResponse.redirect(new URL('/login', request.url))
//       }
//       return response
//     }

//     // 3. LOGGED IN LOGIC - AUTH GATE
//     const isAuthPage = path === '/' || path === '/login' || path === '/signup'
//     if (user && isAuthPage) {
//       return NextResponse.redirect(new URL('/dashboard', request.url))
//     }

//     // 4. ONBOARDING ENFORCEMENT
//     const hasCompletedOnboarding = user.user_metadata?.onboarding_done

//     if (!hasCompletedOnboarding && !path.startsWith('/onboarding')) {
//       return NextResponse.redirect(new URL('/onboarding', request.url))
//     }

//     if (hasCompletedOnboarding && path.startsWith('/onboarding')) {
//       return NextResponse.redirect(new URL('/dashboard', request.url))
//     }

//   } catch (err) {
//     console.error("Proxy error:", err)
//   }

//   return response
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public files (svg, jpg, etc)
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }














import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // let response = NextResponse.next({
  //   request: { headers: request.headers },
  // })

  // const path = request.nextUrl.pathname

  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       getAll: () => request.cookies.getAll(),
  //       setAll: (cookiesToSet) => {
  //         cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
  //         // Create a new response to reflect cookie changes
  //         response = NextResponse.next({ request })
  //         cookiesToSet.forEach(({ name, value, options }) =>
  //           response.cookies.set(name, value, options)
  //         )
  //       },
  //     },
  //   }
  // )

  // const { data: { user }, error } = await supabase.auth.getUser()

  // // 1. LOGGED OUT LOGIC
  // if (!user) {
  //   const isProtectedRoute = path.startsWith('/dashboard') || 
  //                            path.startsWith('/pricing') || 
  //                            path.startsWith('/onboarding')
  //   if (isProtectedRoute) {
  //     return NextResponse.redirect(new URL('/login', request.url))
  //   }
  //   return response
  // }

  // // 2. LOGGED IN LOGIC
  // // If user is logged in and tries to hit login/signup, send to dashboard
  // if (path === '/login' || path === '/signup') {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  // // 3. ONBOARDING ENFORCEMENT
  // const hasCompletedOnboarding = user.user_metadata?.onboarding_done

  // if (!hasCompletedOnboarding && !path.startsWith('/onboarding') && path !== '/') {
  //   return NextResponse.redirect(new URL('/onboarding', request.url))
  // }

  // return response
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}