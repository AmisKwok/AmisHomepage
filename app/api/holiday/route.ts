import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') || new Date().getFullYear();
  
  try {
    const response = await fetch(`https://timor.tech/api/holiday/year/${year}`);
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      year: year,
      holidays: data.holiday || {},
      workdays: data.workday || {}
    });
  } catch (error) {
    console.error('Failed to fetch holiday data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch holiday data' },
      { status: 500 }
    );
  }
}
