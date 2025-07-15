import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://pro-api.coingecko.com/api/v3/global', {
      headers: {
        'accept': 'application/json',
        'x-cg-pro-api-key': 'CG-gCZtTBmLCJQabH8zAkDQJMUF'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
} 