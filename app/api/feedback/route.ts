import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { Feedback } from '@/models/Feedback';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, message, rating, imageUrl, problemId } = body;

    // Email can be optional if it's problem-specific feedback by a logged-in user
    if (!message || message.length < 3) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    let userId = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      const verified = await verifyToken(request);
      if (verified) {
        const user = await getDbUser(verified.uid);
        if (user) userId = user._id;
      }
    }

    await dbConnect();
    await Feedback.create({
      userId,
      problemId,
      email,
      name,
      message,
      rating,
      imageUrl,
      status: 'new'
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('API /feedback POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const verified = await verifyToken(request);
    let user = null;
    if (verified) {
      user = await getDbUser(verified.uid);
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const problemId = searchParams.get('problemId');

    await dbConnect();
    const query: any = {};
    if (statusFilter) query.status = statusFilter;
    if (problemId) query.problemId = problemId;
    
    // For GET by problemId, we don't necessarily need admin role if we're just showing reviews on the problem page.
    // However, existing check requires admin. Let's adjust access control so ANY user can read problem-specific feedback.
    if (!problemId && (!user || user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const feedbackList = await Feedback.find(query)
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(feedbackList);
  } catch (error) {
    console.error('API /feedback GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
