import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Problem } from '@/models/Problem';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    await dbConnect();
    
    const problem = await Problem.findOneAndUpdate(
      { slug: params.slug },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean();

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error(`API /problems/${params.slug} error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
