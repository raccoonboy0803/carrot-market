'use server';

import { z } from 'zod';

import { PASSWORD_REGEX, SPECAIL_REGEX } from '@/lib/constants';

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'Username must be a string.',
        required_error: 'Username must be required',
      })
      .min(3, 'Way too short!!')
      .max(10, 'That is too long!')
      .toLowerCase()
      .trim()
      .regex(SPECAIL_REGEX, 'No special characters allowed.'),
    // regex() : 첫번째인자로 오는 정규표현식을 통과하지못하면, 두번째인자인 에러메시지를 출력
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(4)
      .regex(
        PASSWORD_REGEX,
        'A password must have lowercase, UPPERCASE, a number and special Characters'
      ),
    confirmPassword: z.string().min(4),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Both passwords sholud be the same.', // 에러 메시지
    path: ['confirmPassword'], // 에러 메시지를 표시할 위치
  });
//.refine() : password와 confirmPassoword가 같은지 확인하는 유효성검사

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log('result::', result.data);
  }
}

// .parse() : 유효성검사 실패 시 throw error -> try catch와 함께 사용
// .safeParse() : throw error ❌, 결과(객체)를 반환 -> 반환값을 변수에 저장하여 사용
// .flatten() : error의 내용을 보기좋게 변형
