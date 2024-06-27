'use client';

import { useFormStatus } from 'react-dom';

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {pending ? 'Loading...' : text}
    </button>
  );
}

// useFormStatus는 <form>이 작성된 컴포넌트에서는 사용할수❌
// <form>태그 내부의 자식 요소 안에서 사용
