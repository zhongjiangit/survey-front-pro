import { NextResponse } from 'next/server';
import { baseUrl } from '../../config';

export async function POST(req: Request) {
  const { params } = await req.json();
  console.log('params================', JSON.stringify({ ...params }));

  try {
    const res = await fetch(`${baseUrl}/login/userLogin`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ ...params }),
    });
    console.log('res======================', res);

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
