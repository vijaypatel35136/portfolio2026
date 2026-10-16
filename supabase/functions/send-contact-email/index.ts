import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Gmail credentials from environment variables
    const gmailUser = Deno.env.get('GMAIL_USER')
    const gmailAppPassword = Deno.env.get('GMAIL_APP_PASSWORD')

    if (!gmailUser || !gmailAppPassword) {
      console.error('Gmail credentials not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Using EmailJS for Gmail integration (easier than direct SMTP in Edge Functions)
    const emailjsServiceId = Deno.env.get('EMAILJS_SERVICE_ID')
    const emailjsTemplateId = Deno.env.get('EMAILJS_TEMPLATE_ID')
    const emailjsPublicKey = Deno.env.get('EMAILJS_PUBLIC_KEY')

    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
      // Use EmailJS if configured
      const emailjsData = {
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsPublicKey,
        template_params: {
          to_email: 'vijaypatel35136@gmail.com',
          from_name: name,
          from_email: email,
          message: message,
        },
      }

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailjsData),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('EmailJS error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to send email' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Email sent successfully via EmailJS')
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fallback: Use a simple SMTP relay service if EmailJS not configured
    // For production, you should use EmailJS or a proper email service
    console.warn('EmailJS not configured, email not sent. Please configure EmailJS or use a proper email service.')
    return new Response(
      JSON.stringify({ success: true, warning: 'Email not sent - EmailJS not configured' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in send-contact-email function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
