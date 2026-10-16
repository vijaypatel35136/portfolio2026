# Contact Form Email Setup with Gmail

This Edge Function sends email notifications via Gmail when someone submits the contact form using EmailJS.

## Setup Instructions

### 1. Set Up EmailJS with Gmail

EmailJS is the easiest way to send emails from your Gmail account without exposing SMTP credentials.

#### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Sign up for a free account (200 emails/month free)
3. Verify your email address

#### Step 2: Add Email Service (Gmail)
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Select "Gmail"
4. You'll be redirected to Google to authorize EmailJS
5. Sign in with your Gmail account (vijaypatel35136@gmail.com)
6. Grant EmailJS permission to send emails on your behalf

#### Step 3: Create Email Template
1. In EmailJS dashboard, go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

**Subject:**
```
New Contact Form Message from {{from_name}}
```

**HTML Content:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #333;">New Contact Form Submission</h2>
  <p><strong>From:</strong> {{from_name}}</p>
  <p><strong>Email:</strong> {{from_email}}</p>
  <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 0;"><strong>Message:</strong></p>
    <p style="margin: 10px 0; white-space: pre-wrap;">{{message}}</p>
  </div>
  <p style="color: #666; font-size: 12px;">This message was sent from your portfolio contact form.</p>
</div>
```

4. Save the template and note the **Template ID**

#### Step 4: Get Your Credentials
You'll need three values from EmailJS:
- **Service ID**: From "Email Services" → Click on your Gmail service
- **Template ID**: From "Email Templates" → Click on your template
- **Public Key**: From "Account" → "Public Key" section 

### 2. Deploy the Edge Function to Supabase

First, install the Supabase CLI if you haven't already:
```bash
npm install -g supabase
```

Then deploy the function:
```bash
supabase functions deploy send-contact-email
```

### 3. Set Environment Variables

After deploying, set the EmailJS credentials as secrets:

```bash
supabase secrets set EMAILJS_SERVICE_ID=service_fpibzda
supabase secrets set EMAILJS_TEMPLATE_ID=template_ze7bvqa
supabase secrets set EMAILJS_PUBLIC_KEY=5yxeMQLF7F1f9VRCo
```

Or set them in the Supabase Dashboard:
1. Go to your Supabase project
2. Navigate to Edge Functions
3. Click on "send-contact-email"
4. Go to Settings → Environment Variables
5. Add the three variables:
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
   - `EMAILJS_PUBLIC_KEY`

### 4. Update the Recipient Email (Optional)

Currently, emails are sent to `vijaypatel35136@gmail.com`. To change this:

1. Go to EmailJS dashboard
2. Edit your email template
3. Change the "To" field to your desired email address
4. Or update the code in `index.ts` to use a different recipient

## How It Works

1. When a user submits the contact form, the message is saved to the Supabase `messages` table
2. The Edge Function is called to send an email notification via EmailJS
3. EmailJS sends the email through your authorized Gmail account
4. If email sending fails, the message is still saved to the database (non-blocking)

## Testing

You can test the Edge Function locally:
```bash
supabase functions serve send-contact-email
```

Then send a test request:
```bash
curl -X POST http://localhost:54321/functions/v1/send-contact-email \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
```

Or simply test the contact form on your portfolio website.

## Troubleshooting

- **Email not sending**: Check that all three EmailJS credentials are set correctly in Supabase Edge Function secrets
- **"Email service not configured"**: Make sure you've set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY
- **Gmail authorization failed**: Make sure you authorized EmailJS to send emails from your Gmail account
- **Template not found**: Verify the Template ID matches your EmailJS template
- **Rate limit exceeded**: EmailJS free tier allows 200 emails/month. Upgrade if needed

## Alternative: Direct Gmail SMTP (Not Recommended)

If you prefer to use SMTP directly (less secure), you can:
1. Generate an App Password from Google Account settings
2. Use a Node.js SMTP library in the Edge Function
3. Set GMAIL_USER and GMAIL_APP_PASSWORD as environment variables

However, EmailJS is recommended because:
- More secure (no SMTP credentials exposed)
- Easier to set up
- Better handling of Gmail's security policies
- Built-in rate limiting and delivery tracking
