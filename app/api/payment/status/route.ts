import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
    });
  } catch (error) {
    console.error('API /payment/status error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
