import { InputHTMLAttributes } from 'react';

interface InputProps {
  // type: string;
  // placeholder: string;
  // required: boolean;
  // 위 세개의 속성은 input태그 고유의 속성들
  errors?: string[];
  name: string;
}

export default function Input({
  // type,
  // placeholder,
  // required,
  errors = [],
  name,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  //InputHTMLAttributes<HTMLInputElement> : input태그 자체적으로 존재하는 모든 속성들
  //태그가 자체적으로 가지고 있는 속성들같은 경우에 , rest parameter를 이용하면, 재사용성이 높아짐
  //이곳저곳에서 내려준 props들을 매번 추가하지않아도됨

  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className="bg-transparent rounded-md w-full h-10 ring-2 ring-neutral-200 focus:ring-2 focus:ring-orange-500 border-none placeholder:text-neutral-400 transition"
        // type={type}
        // placeholder={placeholder}
        // required={required}
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
