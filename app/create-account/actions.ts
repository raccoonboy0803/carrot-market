'use server';

import { z } from 'zod';

import {
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  SPECAIL_REGEX,
} from '@/lib/constants';
import db from '@/lib/db';

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true, // User테이블에서 id값만 가져온다
      // 이미 존재하면 id값을 가져오고, 기존에 존재하지않으면 null
    },
  });
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

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
      .regex(SPECAIL_REGEX, 'No special characters allowed.')
      // regex() : 첫번째인자로 오는 정규표현식을 통과하지못하면, 두번째인자인 에러메시지를 출력
      .refine(checkUniqueUsername, 'This username is already taken'),
    // refine에 함수이름만 등록해주면 zod가 자동으로 함수의 인자에 해당 인자(username)를 넣어줌
    // refine() : 내부 함수가 true를 반환하면 통과, false를 반환하면 두번째인자를 리턴

    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(
        checkUniqueEmail,
        'There is an account already registered with that email'
      ),
    password: z.string().min(4).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
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

  const result = await formSchema.safeParseAsync(data);
  //safeParseAsync : parse작업을 진행할 스키마 내부에 비동기 함수가 존재할때 사용
  //해당 스키마도 비동기로 실행되므로 await키워드도 추가

  if (!result.success) {
    return result.error.flatten();
  } else {
    // hash password
    // save the user to db
    // log the user in
    // redirect "/home"
  }
}

// .parse() : 유효성검사 실패 시 throw error -> try catch와 함께 사용
// .safeParse() : throw error ❌, 결과(객체)를 반환 -> 반환값을 변수에 저장하여 사용
// .flatten() : error의 내용을 보기좋게 변형
