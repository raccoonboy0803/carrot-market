'use client';

import { useFormState } from 'react-dom';

import Button from '@/components/button';
import Input from '@/components/input';
import { smsLogin } from './actions';

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, formAction] = useFormState(smsLogin, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number</h2>
      </div>
      <form className="flex flex-col gap-3" action={formAction}>
        <Input
          name="phone"
          type="text"
          placeholder="Phone number"
          required
          errors={state.error?.formErrors}
        />
        {state.token && (
          <Input
            name="token"
            type="number"
            placeholder="Verification code"
            required
            minLength={100000}
            maxLength={999999}
          />
        )}
        <Button text={state.token ? 'Verify Token' : 'Send Verification SMS'} />
      </form>
    </div>
  );
}
