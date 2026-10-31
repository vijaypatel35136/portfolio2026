import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') })

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

/**
 * Send email notification to admin when contact form is submitted
 */
export async function sendContactNotification(payload: {
  name: string
  email: string
  message: string
}): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'vijaypatel35136@gmail.com'

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Contact Form Submission from ${payload.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${payload.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">${payload.message}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            This message was submitted via your portfolio contact form.
          </p>
          <p style="color: #666; font-size: 14px;">
            <a href="mailto:${payload.email}" style="color: #007bff;">Reply to ${payload.email}</a>
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Email notification sent to admin:', adminEmail)
  } catch (error) {
    console.error('❌ Failed to send email notification:', error)
    throw error
  }
}

export default transporter
