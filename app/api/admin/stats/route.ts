import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { History } from '@/models/History';
import { Feedback } from '@/models/Feedback';
import { Consultation } from '@/models/Consultation';
import { Problem } from '@/models/Problem';

export async function GET(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      todayHistory,
      newFeedback,
      activeConsultations,
      topProblems
    ] = await Promise.all([
      User.countDocuments(),
      History.countDocuments({ viewedAt: { $gte: startOfDay } }),
      Feedback.countDocuments({ status: 'new' }),
      Consultation.countDocuments({ status: { $in: ['pending', 'confirmed'] } }),
      Problem.find().sort({ viewCount: -1 }).limit(10).select('name category viewCount slug').lean()
    ]);

    return NextResponse.json({
      totalUsers,
      todayHistory,
      newFeedback,
      activeConsultations,
      topProblems,
    });
  } catch (error) {
    console.error('API /admin/stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
