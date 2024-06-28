'use server';

export const login = async (prevState: any, formData: FormData) => {
  // 서버액션함수를 useFormState의 인자로 사용하면, 서버액션함수의 인자는 (이전상태,제출데이터) 로 변경됨
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  return {
    errors: ['wrong password', 'password too short'],
  };
};
// 유저가 입력한 값은 서버액션함수의 FormData로만 가져올수있다.
// input태그에 name속성이 반드시 필요하다
