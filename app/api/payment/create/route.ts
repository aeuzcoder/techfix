import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { plan } = await request.json();
    if (!['premium', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Mock payment flow: just return redirect URL
    const mockRedirectUrl = `/pricing?payment=pending&plan=${plan}`;
    
    return NextResponse.json({ redirectUrl: mockRedirectUrl });
  } catch (error) {
    console.error('API /payment/create error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
