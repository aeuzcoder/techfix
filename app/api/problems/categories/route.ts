import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Problem } from '@/models/Problem';

export async function GET() {
  try {
    await dbConnect();

    const hardwareSubcategories = await Problem.distinct('subcategory', { category: 'hardware' });
    const softwareSubcategories = await Problem.distinct('subcategory', { category: 'software' });

    return NextResponse.json({
      hardware: hardwareSubcategories,
      software: softwareSubcategories,
    });
  } catch (error) {
    console.error('API /problems/categories error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
