'use client';

import { useFormState } from 'react-dom';

import Input from '@/components/input';
import Button from '@/components/button';
import SocialLogin from '@/components/social-login';
import { login } from './action';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

export default function LogIn() {
  const [state, formAction] = useFormState(login, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password</h2>
      </div>
      <form className="flex flex-col gap-3" action={formAction}>
        <Input name="email" type="email" placeholder="Email" required />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text="Login" />
      </form>

      <SocialLogin />
    </div>
  );
}

// server action
// nextjs 14에서 서버액션은 서버 측에서 직접 실행되는 비동기 함수
// 이를 통해 클라이언트 측 JS코드에서 데이터를 가져오고 처리하거나 ,DB와 상호작용 등 다양한 작업 수행 가능
// API 엔드포인트 별도 작성 ❌, 페이지 컴포넌트 내에서 직접 정의할수있다는 장점
// 서버 액션 사용 방법
// 서버 액션 함수 내부에는 반드시 'use server'를 표기

// ?? (널 병합 연산자) : 좌항이 null 또는 undefined일 경우 우항을 반환
