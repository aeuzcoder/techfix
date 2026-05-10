/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { History } from '@/models/History';

export async function GET(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const dbUser = await getDbUser(verified.uid);
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    // only allow specific fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.language !== undefined) updates.language = body.language;
    if (body.avatar !== undefined) updates.avatar = body.avatar;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: verified.uid },
      { $set: updates },
      { new: true }
    ).lean();

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ firebaseUid: verified.uid });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete user from DB
    await User.deleteOne({ _id: user._id });
    
    // Delete all history docs
    await History.deleteMany({ userId: user._id });

    // Note: Deleting from firebase auth should happen client-side or
    // via Firebase Admin, but typically it is done client-side so user is signed out.

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
