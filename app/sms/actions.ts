'use server';

import validator from 'validator';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'ko-KR'),
    'Wrong phone format'
  );
// .refine() : 인자로 함수가 들어가는데, 해당 함수의 첫번째 인자는 refine하려는 data
// 함수가 true를 리턴하면 validation성공, false를 리턴하면 validation실패
// .isMobilePhone()의 인자로 밸리데이션을 진행할 데이터, 옵셔널인 두번째인자로 locale(지역) 정규식

const tokenSchema = z.coerce.number().min(100000).max(999999); // 6자리 숫자
// .coerce : 입력한 string을 number로 변환 cf)input태그로 입력받은 값의 타입은 string

interface ActionState {
  token: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get('phone');
  const token = formData.get('token');

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        token: true,
      };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      redirect('/');
    }
  }

  tokenSchema.parse(formData.get('token'));
}
