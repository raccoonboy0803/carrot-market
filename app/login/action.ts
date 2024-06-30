'use server';

import { z } from 'zod';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string({
      required_error: 'Password is required!',
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export const login = async (prevState: any, formData: FormData) => {
  // 서버액션함수를 useFormState의 인자로 사용하면, 서버액션함수의 인자는 (이전상태,제출데이터) 로 변경됨
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result);
  }
};
// 유저가 입력한 값은 서버액션함수의 FormData로만 가져올수있다.
// input태그에 name속성이 반드시 필요하다
