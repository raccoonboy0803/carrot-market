import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionContent {
  id?: number;
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: 'funny-carrot',
    password: process.env.COOKIE_PASSWORD!, //쿠키를 암호화할때 사용할 password
  });
}
// getIronSession() :해당 쿠키네임의 쿠키를 가져오거나, 해당 이름의 쿠키를 가지고 있지않다면 생성함
//cookies() : 클라이언트에서의 현재 요청과 관련된 쿠키정보 얻을수있다. 이 함수는 서버 측에서 실행되며, 요청에 포함된 쿠키들을 객체형태로 반환
