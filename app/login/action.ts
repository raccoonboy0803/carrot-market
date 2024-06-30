'use server';

import { z } from 'zod';
import bcrypt from 'bcrypt';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, 'An account with tis email does not exists.'),
  password: z.string({
    required_error: 'Password is required!',
  }),
  // .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export const login = async (prevState: any, formData: FormData) => {
  // 서버액션함수를 useFormState의 인자로 사용하면, 서버액션함수의 인자는 (이전상태,제출데이터) 로 변경됨
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // if the user is found, check password hash
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(result.data.password, user!.password ?? '');
    //bcrypt.compare() : 사용자의 입력으로 받은 password와 hashed처리된 DB에 저장되어있는 password 비교

    // log the user in
    if (ok) {
      const session = await getSession();
      session.id = user!.id;

      redirect('/profile');
    } else {
      return {
        fieldErrors: {
          password: ['Wrong password.'],
          email: [],
        },
      };
    }
  }
};
// 유저가 입력한 값은 서버액션함수의 FormData로만 가져올수있다.
// input태그에 name속성이 반드시 필요하다
