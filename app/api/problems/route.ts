import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Problem } from '@/models/Problem';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const lang = searchParams.get('lang') || 'uz';

    await dbConnect();

    const query: any = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    
    if (search) {
      // Search in name.uz, name.ru, name.en
      query['$or'] = [
        { 'name.uz': { $regex: search, $options: 'i' } },
        { 'name.ru': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } },
      ];
    }

    // Return problems without the steps array for the list
    const problems = await Problem.find(query).select('-steps').lean();

    return NextResponse.json(problems);
  } catch (error) {
    console.error('API /problems error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
