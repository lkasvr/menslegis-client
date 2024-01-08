import { NextResponse } from 'next/server';

export interface Author {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    politicalBody: {
        id: string;
        name: string;
        created_at: string;
        updated_at: string;
    }
}

const baseUrl = 'http://localhost:3000';

export async function GET() {
  try {
    const res = await fetch(`${baseUrl}/author`, {
      cache: 'no-store',
    });

    const data: Author[] = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.error();
  }
}
