import { NextResponse } from 'next/server';
import { baseUrl } from '../../config';

export async function POST(req: Request) {
  const params = await req.json();
  const cookieHeader = req.headers.get('cookie');

  if (params.currentSystemId && params.currentOrgId) {
    try {
      const res = await fetch(`${baseUrl}/staff/update`, {
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader || '',
        },
        method: 'POST',
        body: JSON.stringify(params),
      });

      return res;
    } catch (error) {}
  }

  return NextResponse.json({ code: 'error', msg: 'Error', data: null });
}
