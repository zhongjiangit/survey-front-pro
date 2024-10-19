import { NextResponse } from 'next/server';
import { baseUrl, cookieValue } from '../../config';

export async function POST(req: Request) {
  const params = await req.json();
  try {
    const res = await fetch(`${baseUrl}/template/createOutline`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `JSESSIONID=${cookieValue}`,
      },
      method: 'POST',
      body: JSON.stringify(params),
    });

    const resJson = await res.json();
    console.log('resJson======================', resJson);

    if (resJson.result === 0) {
      return NextResponse.json({
        code: 'success',
        msg: resJson.message,
        data: resJson.data,
      });
    }
  } catch (error) {
    console.log('error======================', error);
  }
  return NextResponse.json({ code: 'error', msg: 'Error', data: null });
}
