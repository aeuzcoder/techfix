import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { Consultation } from '@/models/Consultation';
import { Advisor } from '@/models/Advisor';

export async function POST(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.plan !== 'pro') {
      return NextResponse.json({ error: 'PRO_REQUIRED' }, { status: 403 });
    }

    const body = await request.json();
    const { advisorId, date, timeSlot } = body;

    if (!advisorId || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Check advisor and slot availability
    const advisor = await Advisor.findById(advisorId);
    if (!advisor) return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });

    const isBooked = advisor.bookedSlots?.some(
      (s: any) => s.date === date && s.time === timeSlot
    );

    if (isBooked) {
      return NextResponse.json({ error: 'Slot already booked' }, { status: 400 });
    }

    // Add to bookedSlots
    advisor.bookedSlots.push({ date, time: timeSlot });
    await advisor.save();

    const meetUrl = `https://meet.google.com/techfix-${Date.now()}`;

    const consultation = await Consultation.create({
      userId: user._id,
      advisorId,
      date,
      timeSlot,
      status: 'pending',
      meetUrl,
      price: 50000,
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error('API /consultations/book error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
