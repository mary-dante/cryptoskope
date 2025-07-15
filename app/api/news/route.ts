import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ status: 'error', message: 'API key not set' }, { status: 500 });
    }
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=crypto&language=en`;

    const res = await fetch(url);
    
    if (!res.ok) {
      console.error('News API error:', res.status, res.statusText);
      return NextResponse.json(
        { status: 'error', message: `News API error: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    if (!data || !data.results) {
      console.error('Invalid response format:', data);
      return NextResponse.json(
        { status: 'error', message: 'Invalid response format from News API' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
} 