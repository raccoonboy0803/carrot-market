'use server';

import { redirect } from 'next/navigation';

export const handleForm = async (prevState: any, data: FormData) => {
  // 서버액션함수를 useFormState의 인자로 사용하면, 서버액션함수의 인자는 (이전상태,제출데이터) 로 변경됨
  // console.log(data.get('email'), data.get('password'));
  console.log('prevState::', prevState);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  redirect('/');
  return {
    errors: ['wrong password', 'password too short'],
  };
};
// 유저가 입력한 값은 서버액션함수의 FormData로만 가져올수있다.
// input태그에 name속성이 반드시 필요하다
