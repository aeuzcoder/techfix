import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { History } from '@/models/History';
import '@/models/Problem'; 

export async function GET(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.plan === 'free') {
      return NextResponse.json({ error: 'PREMIUM_REQUIRED' }, { status: 403 });
    }

    await dbConnect();
    const history = await History.find({ userId: user._id })
      .populate('problemId', 'name category')
      .sort({ viewedAt: -1 })
      .lean();

    // CSV format: Date, Problem Name, Category
    const headers = ['Date', 'Problem Name', 'Category'];
    const rows = history.map((item: any) => {
      const date = new Date(item.viewedAt).toISOString().split('T')[0];
      const name = item.problemId?.name?.uz || item.problemId?.name?.en || 'Unknown';
      const cat = item.problemId?.category || 'Unknown';
      return `"${date}","${name}","${cat}"`;
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=history.csv',
      },
      status: 200,
    });
  } catch (error) {
    console.error('API /history/export error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
