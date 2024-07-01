import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import getSession from './lib/session';
import db from './lib/db';

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  '/': true,
  '/login': true,
  '/sms': true,
  '/create-account': true,
  '/github/start': true,
  '/github/complete': true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname]; // publicOnlyUrls 이외의 path에 존재하면 undefined
  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    if (exists) {
      return NextResponse.redirect(new URL('/products', request.url));
    }
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], // matcher와 일치하는 곳에서만 작동
};

// middleware, config 의 네이밍은 예약어

// middleware.ts
// 애플리케이션의 모든 요청에 대해 공통으로 적용할 미들웨어 로직을 정의하는 파일
// middleware는 속도에 대한 타협때문에 NodeJs 런타임에서 구동되지 ❌
// NodeJs의 경량 버전과 같은 Edge 런타임에서 실행됨(모든 npm package를 middleware에서 실행할수없음)

// NextRequest
// NextRequest는 Next.js에서 제공하는 확장된✅ 요청 객체로, Edge API Routes와 미들웨어에서 사용됩니다. NextRequest는 기본 Request 객체를 확장하여 추가적인 편의 기능을 제공합니다.

// NextResponse
// NextResponse는 Next.js에서 제공하는 확장된✅ 응답 객체로, Edge API Routes와 미들웨어에서 사용됩니다. NextResponse는 기본 Response 객체를 확장하여 추가적인 편의 기능을 제공합니다.

// Request
// Request 객체는 표준 Fetch API의 요청 객체로, 요청에 대한 정보를 담고 있습니다. Next.js에서도 사용되지만, 기본적으로 Fetch API의 일부분입니다.

// Response
// Response 객체는 표준 Fetch API의 응답 객체로, 응답에 대한 정보를 담고 있습니다. Next.js에서도 사용되지만, 기본적으로 Fetch API의 일부분입니다.

// NextResponse.next()는 Next.js의 미들웨어에서 사용하는 함수로, 요청을 다음 미들웨어 또는 최종 처리기로 넘겨주기 위해 사용됩니다. 이 함수는 NextResponse 객체를 반환합니다
