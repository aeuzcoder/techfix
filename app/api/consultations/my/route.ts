import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { Consultation } from '@/models/Consultation';
import '@/models/Advisor'; // For population

export async function GET(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await dbConnect();
    const consultations = await Consultation.find({ userId: user._id })
      .populate('advisorId', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(consultations);
  } catch (error) {
    console.error('API /consultations/my error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
