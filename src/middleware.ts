import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const allowedPaths: (string | RegExp)[] = [
  '/login',
  '/signup',
  /^\/api\/.*/,
  /\.png$/,
  /\.svg$/,
  /\.css$/,
  /\.ico$/,
  /^\/socket\.io\/?/,
];

function isPathAllowed(
  pathname: string,
  allowedPaths: (string | RegExp)[]
): boolean {
  return allowedPaths.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(pathname);
    }
    return pathname === pattern;
  });
}

const middleware = withAuth(
  function middleware(request) {
    const token = request.nextauth?.token;
    const pathname = request.nextUrl?.pathname;
    console.log({ token, pathname });

    if(pathname.startsWith('/signup') || pathname.startsWith('/login')){
        if(token){
            const home = new URL('/', request.nextUrl?.origin);

            return NextResponse.redirect(home.toString());
        }else{
            return NextResponse.next();
        }

    }
    if (pathname.startsWith('/api')|| isPathAllowed(pathname, allowedPaths)) {
      return NextResponse.next();
    }


    if (token) {
        return NextResponse.next();
    } else {
  
        const signinurl = new URL('/login', request.nextUrl?.origin);
        return NextResponse.redirect(signinurl.toString());
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);
export default middleware;
