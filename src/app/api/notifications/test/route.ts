import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST() {
  try {
    const to = process.env.NOTIFICATION_EMAIL || ''
    const success = await sendEmail({
      to,
      subject: '✅ Test Email — ENT Job Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0ea5e9; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin:0;">Test Email</h2>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p>This is a test email from Dr. Tanvi's ENT Job Portal.</p>
            <p>If you received this, email notifications are working correctly!</p>
            <p style="color:#6b7280;font-size:12px;">Sent at: ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
      type: 'test',
    })

    return NextResponse.json({ success })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send test email' },
      { status: 500 }
    )
  }
}
