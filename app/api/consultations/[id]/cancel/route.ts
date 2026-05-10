import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { Consultation } from '@/models/Consultation';
import { Advisor } from '@/models/Advisor';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await dbConnect();

    const consultation = await Consultation.findOne({ _id: params.id, userId: user._id });
    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found or unauthorized' }, { status: 404 });
    }

    if (consultation.status === 'cancelled') {
        return NextResponse.json(consultation);
    }

    consultation.status = 'cancelled';
    await consultation.save();

    // Remove slot from advisor
    await Advisor.updateOne(
      { _id: consultation.advisorId },
      { $pull: { bookedSlots: { date: consultation.date, time: consultation.timeSlot } } }
    );

    return NextResponse.json(consultation);
  } catch (error) {
    console.error(`API /consultations/${params?.id}/cancel error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
