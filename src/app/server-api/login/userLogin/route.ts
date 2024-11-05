import { NextResponse } from 'next/server';
import { baseUrl, cookieValue } from '../../config';

export async function POST(req: Request) {
  const params = await req.json();

  try {
    const res = await fetch(`${baseUrl}/login/userLogin`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `JSESSIONID=${cookieValue}`,
      },
      method: 'POST',
      body: JSON.stringify({ ...params }),
    });

    return res;
  } catch (error) {
    console.log('error======================', error);
  }
  return NextResponse.json({ code: 'error', message: 'Error', data: null });
}
