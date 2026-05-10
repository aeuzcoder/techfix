import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { History } from '@/models/History';
import '@/models/Problem'; // ensure Problem model is loaded for populate

export async function GET(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await dbConnect();

    const limit = user.plan === 'free' ? 10 : 0;
    
    let query = History.find({ userId: user._id })
      .populate('problemId', 'name category slug icon')
      .sort({ viewedAt: -1 });

    if (limit > 0) {
      query = query.limit(limit);
    }

    const history = await query.lean();

    return NextResponse.json(history);
  } catch (error) {
    console.error('API /history GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { problemId } = await request.json();
    if (!problemId) return NextResponse.json({ error: 'problemId required' }, { status: 400 });

    await dbConnect();

    // Check if viewed today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existing = await History.findOne({
      userId: user._id,
      problemId,
      viewedAt: { $gte: startOfDay },
    });

    if (existing) {
      existing.viewedAt = new Date();
      await existing.save();
      return NextResponse.json(existing);
    }

    const newHistory = await History.create({
      userId: user._id,
      problemId,
      viewedAt: new Date(),
    });

    return NextResponse.json(newHistory, { status: 201 });
  } catch (error) {
    console.error('API /history POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await dbConnect();
    await History.deleteMany({ userId: user._id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /history DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
