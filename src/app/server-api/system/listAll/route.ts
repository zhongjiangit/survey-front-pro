// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { baseUrl, cookieValue } from '../../config';

export async function POST(req: Request) {
  const params = await req.json();
  // const cookieStore = cookies();
  // const JSESSIONID = cookieStore.get('JSESSIONID');

  try {
    const res = await fetch(`${baseUrl}/system/listAll`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `JSESSIONID=${cookieValue}`,
      },
      method: 'POST',
      body: JSON.stringify(params),
    });

    return res;
  } catch (error) {
    console.log('error======================', error);
  }
  return NextResponse.json({ code: 'error', msg: 'Error', data: null });
}
