export const PASSWORD_MIN_LENGTH = 4;

export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
); //알파벳 소문자,대문자 / 숫자 / 특수문자 최소 1개씩 포함

export const SPECAIL_REGEX = new RegExp(
  /^[^!@#\$%\^&\*\(\)_\+\-\=\{\}\[\]\|\\:;'"<>\?,\.\/`~]*$/
); // []대괄호 안에 있는 특수문자들은 허용하지않는다

export const PASSWORD_REGEX_ERROR =
  'A password must have lowercase, UPPERCASE, a number and special Characters';
