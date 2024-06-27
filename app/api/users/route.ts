import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log(request);

  return Response.json({
    ok: true,
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log('log the user in!!');
  return Response.json(data);
}

// 함수 이름은 상관없다
