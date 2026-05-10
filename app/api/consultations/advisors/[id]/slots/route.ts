import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Advisor } from '@/models/Advisor';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    await dbConnect();
    const advisor = await Advisor.findById(params.id).lean();
    
    if (!advisor) {
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
    }

    if (!advisor.isAvailable) {
      return NextResponse.json([]); // No slots if unavailable
    }

    // Generate time slots: 09:00 to 17:00 every hour
    const allSlots = Array.from({ length: 9 }, (_, i) => {
      const hour = 9 + i;
      return `${hour.toString().padStart(2, '0')}:00`;
    });

    const bookedSlotsForDate = advisor.bookedSlots?.filter((slot: any) => slot.date === date) || [];
    const bookedSlotTimes = bookedSlotsForDate.map((slot: any) => slot.time);

    const availableSlots = allSlots.filter(time => !bookedSlotTimes.includes(time));

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error(`API /consultations/advisors/${params?.id}/slots error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
