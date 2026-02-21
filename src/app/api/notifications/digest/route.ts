import { NextResponse } from 'next/server'
import { sendWeeklyDigest } from '@/lib/email'

export async function POST() {
  try {
    const success = await sendWeeklyDigest()
    return NextResponse.json({ success })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send digest' },
      { status: 500 }
    )
  }
}
