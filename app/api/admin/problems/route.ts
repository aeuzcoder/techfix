import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';
import dbConnect from '@/lib/mongodb';
import { Problem } from '@/models/Problem';

export async function POST(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminUser = await getDbUser(verified.uid);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    await dbConnect();

    const newProblem = await Problem.create(body);
    return NextResponse.json(newProblem, { status: 201 });
  } catch (error) {
    console.error('API /admin/problems POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
