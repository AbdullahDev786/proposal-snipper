// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
//           response = NextResponse.next({
//             request,
//           })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           )
//         },
//       },
//     }
//   )

//   await supabase.auth.getUser()

//   return response
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }


// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: { headers: request.headers },
//   })

//   // 1. QUICK EXIT: Only run middleware for main pages
//   const path = request.nextUrl.pathname
//   const isInternal = path.startsWith('/_next') || path.includes('/api/') || path.includes('.')
//   if (isInternal) return response

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

//   // 2. SECURITY CHECK
//   const { data: { user } } = await supabase.auth.getUser()

//   // 3. THE REDIRECT GATE
//   // If Logged in: Don't let them see Landing/Login/Signup
//   if (user && (path === '/' || path === '/login' || path === '/signup')) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   // If Logged out: Don't let them see Dashboard/Pricing
//   if (!user && (path.startsWith('/dashboard') || path.startsWith('/pricing'))) {
//     return NextResponse.redirect(new URL('/', request.url))
//   }

//   return response
// }

// export const config = {
//   matcher: [
//     /* * Target only the paths we care about. 
//      * This prevents the middleware from slowing down your images/scripts.
//      */
//     '/',
//     '/login',
//     '/signup',
//     '/dashboard/:path*',
//     '/pricing/:path*',
//     '/onboarding/:path*'
//   ],
// }
