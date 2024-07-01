import db from '@/lib/db';
import getSession from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return notFound();
  }
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  // const accessTokenResponse = await (await fetch(accessTokenURL)).json()
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  const { error, access_token } = await accessTokenResponse.json();

  if (error) {
    return new Response(null, {
      status: 400,
    });
    // new Response(body? , init?)
    // body: 응답의 본문 설정 (null: 본문이 없음을 의미)
    // init: 응답의 초기화 옵션 설정 (status: 응답의 상태 코드)
  }
  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache', // 캐싱 ❌
  });
  // 기본적으로 GET request들은 Next.js에의해 캐싱됨

  const { id, avatar_url, login } = await userProfileResponse.json();
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
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect('/profile');
  }
  const newUser = await db.user.create({
    // 회원가입
    data: {
      username: login, // email-pwd 가입회원과 유저네임이 중복될수있음(수정사항)
      github_id: id + '', // toString
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });
  const session = await getSession();
  session.id = newUser.id;
  await session.save();
  return redirect('/profile');
}

// 서버에서의 .json() 메소드
// 서버에서는 주로 Response 객체의 메소드로 사용됩니다.
// 기능: 객체나 배열을 JSON 형식으로✅ 변환하여 HTTP 응답으로 반환합니다.
// 역할: JSON 데이터를 클라이언트에 전송합니다.

// 클라이언트에서의 .json() 메소드
// 클라이언트에서는 주로 Response 객체의 메소드로 사용되며, 서버에서 받은 응답을 처리하는 데 사용됩니다.
// 기능: JSON 형식의 응답 본문을 JavaScript 객체로✅ 파싱합니다.
// 역할: 서버로부터 받은 JSON 데이터를 JavaScript 객체로 변환하여 사용할 수 있게 합니다.
