'use server';

import { z } from 'zod';

const formSchema = z
  .object({
    username: z.string().min(3).max(10),
    email: z.string().email(),
    password: z.string().min(10),
    confirmPassword: z.string().min(10),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password dont match', // 에러 메시지
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
  console.log('result::', result);
  if (!result.success) {
    return result.error.flatten();
  }
}

// .parse() : 유효성검사 실패 시 throw error -> try catch와 함께 사용
// .safeParse() : throw error ❌, 결과를 반환 -> 반환값을 변수에 저장하여 사용
// .flatten() : error의 내용을 보기좋게 변형
