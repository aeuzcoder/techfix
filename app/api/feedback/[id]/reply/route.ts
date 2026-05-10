import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { Feedback } from '@/models/Feedback';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { reply } = await request.json();
    if (!reply) {
      return NextResponse.json({ error: 'Reply is required' }, { status: 400 });
    }

    await dbConnect();
    const feedback = await Feedback.findByIdAndUpdate(
      params.id,
      {
        adminReply: reply,
        status: 'replied'
      },
      { new: true }
    ).lean();

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error(`API /feedback/${params?.id}/reply error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
