import { NextResponse } from 'next/server';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const days = searchParams.get('days') || '30';

  if (!id) {
    return NextResponse.json(
      { error: 'Token ID is required' },
      { status: 400 }
    );
  }

  try {
    let retries = 0;
    let response;
    
    while (retries < 3) {
      response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${days}`,
        {
          headers: {
            'Accept': 'application/json',
            'X-CG-API-KEY': process.env.NEXT_PUBLIC_COINGECKO_API_KEY || ''
          }
        }
      );

      if (response.status !== 429) {
        break;
      }
      
      retries++;
      // Always retry after 2 seconds if we hit rate limit
      await sleep(2000);
    }

    if (!response) {
      return NextResponse.json(
        { error: 'Failed to fetch OHLC data' },
        { status: 500 }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { error: errorData?.error || `Failed to fetch OHLC data: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching OHLC data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 