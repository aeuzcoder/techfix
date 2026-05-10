import { NextResponse } from 'next/server';
import { adminAuth, verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { uid } = verified;
    const dbUser = await getDbUser(uid);

    if (dbUser) {
      return NextResponse.json(dbUser);
    }

    // User not in DB, create them
    const firebaseUser = await adminAuth?.getUser(uid);
    if (!firebaseUser) {
      return NextResponse.json({ error: 'Firebase user not found' }, { status: 404 });
    }

    await dbConnect();
    const newUser = await User.create({
      firebaseUid: uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || 'Foydalanuvchi',
      avatar: firebaseUser.photoURL || '',
      role: 'user',
      plan: 'free',
      language: 'uz',
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
