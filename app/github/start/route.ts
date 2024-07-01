// HTTP method handler(API route)
export function GET() {
  const baseURL = 'https://github.com/login/oauth/authorize';
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: 'read:user,user:email',
    allow_signup: 'true',
  };
  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseURL}?${formattedParams}`;
  return Response.redirect(finalUrl);
}
// /github/start 로 GET request를 보낼때 동작하는 함수
// URLSearchParams는 URL의 쿼리 문자열을 쉽게 조작할 수 있도록 도와주는 Web API
// 객체로 초기화
// const paramsWithObject = new URLSearchParams({ key1: 'value1', key2: 'value2' });
