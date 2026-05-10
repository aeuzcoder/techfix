import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Advisor } from '@/models/Advisor';

export async function GET() {
  try {
    await dbConnect();
    const advisors = await Advisor.find({}).lean();
    return NextResponse.json(advisors);
  } catch (error) {
    console.error('API /consultations/advisors error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
