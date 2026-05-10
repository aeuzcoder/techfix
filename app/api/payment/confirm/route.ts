import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

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

    await dbConnect();
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          plan,
          planExpiresAt: expiryDate
        }
      },
      { new: true }
    ).lean();

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('API /payment/confirm error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
