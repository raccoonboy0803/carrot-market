import db from '@/lib/db';
import { sessionLogin } from '@/lib/login';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { getAccessToken, getUserEmail, getUserProfile } from './actions';

// 깃허브 사이트에 등록된 Authorization callback URL : http://localhost:3000✅/github/complete
// -> github/complete 라우트 내 route.ts 파일

interface AccessTokenType {
  error: string;
  access_token: string;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  const { error, access_token }: AccessTokenType = await (
    await getAccessToken(code)
  ).json();

  if (error) {
    return new Response(null, {
      status: 400,
    });
    // new Response(body? , init?)
    // body: 응답의 본문 설정 (null: 본문이 없음을 의미)
    // init: 응답의 초기화 옵션 설정 (status: 응답의 상태 코드)
  }

  const emailResponse = await (await getUserEmail(access_token)).json();
  const { id, avatar_url, login } = await (
    await getUserProfile(access_token)
  ).json();

  const user = await db.user.findUnique({
    where: {
      github_id: id + '',
    },
    select: {
      id: true,
    },
  });

  if (user) {
    // 로그인
    await sessionLogin(user.id);
    return redirect('/profile');
  }

  const existUsername = await db.user.findUnique({
    where: {
      username: login,
    },
  });

  if (existUsername) {
    const newUser = await db.user.create({
      // 회원가입
      data: {
        username: `${login}-gh`, // email-pwd 가입회원과 유저네임이 중복될수있음(수정사항)
        github_id: id + '', // toString
        avatar: avatar_url,
        email: emailResponse[0].email,
      },
      select: {
        id: true,
      },
    });
    await sessionLogin(newUser.id);
    return redirect('/profile');
  } else {
    const newUser = await db.user.create({
      // 회원가입
      data: {
        username: login, // email-pwd 가입회원과 유저네임이 중복될수있음(수정사항)
        github_id: id + '', // toString
        avatar: avatar_url,
        email: emailResponse[0].email,
      },
      select: {
        id: true,
      },
    });
    await sessionLogin(newUser.id);
    return redirect('/profile');
  }
}

// 서버에서의 .json() 메소드
// 서버에서는 주로 Response 객체의 메소드로 사용됩니다.
// 기능: 객체나 배열을 JSON 형식으로✅ 변환하여 HTTP 응답으로 반환합니다.
// 역할: JSON 데이터를 클라이언트에 전송합니다.

// 클라이언트에서의 .json() 메소드
// 클라이언트에서는 주로 Response 객체의 메소드로 사용되며, 서버에서 받은 응답을 처리하는 데 사용됩니다.
// 기능: JSON 형식의 응답 본문을 JavaScript 객체로✅ 파싱합니다.
// 역할: 서버로부터 받은 JSON 데이터를 JavaScript 객체로 변환하여 사용할 수 있게 합니다.
