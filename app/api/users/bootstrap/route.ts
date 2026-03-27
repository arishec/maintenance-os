import { NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';

export async function POST() {
  try {
    const user = await requireDbUser();
    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
