import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = await req.json();
    email = typeof body.email === 'string' ? body.email.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  let dbSaved = false;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseServiceKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { error: dbError } = await supabase
        .from('subscribers')
        .insert({ email });

      if (dbError) {
        if (dbError.code === '23505') {
          return NextResponse.json({ error: 'This email is already on the waitlist.' }, { status: 409 });
        }
        console.error('Supabase DB Error:', dbError);
        return NextResponse.json({ error: 'Failed to save your email to the database.' }, { status: 500 });
      }
      dbSaved = true;
    } catch (err) {
      console.error('Supabase connection/operation failed:', err);
      return NextResponse.json({ error: 'Database connection failed.' }, { status: 500 });
    }
  } else {
    console.log('Supabase not configured. Skipping database storage.');
  }

  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpPort = process.env.SMTP_PORT?.trim();
  const smtpSecure = process.env.SMTP_SECURE?.trim();
  const smtpFromName = process.env.SMTP_FROM_NAME?.trim();
  const smtpFrom = process.env.SMTP_FROM?.trim();
  const smtpToAdmin = process.env.SMTP_TO_ADMIN?.trim();

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort || 587),
        secure: smtpSecure === 'true',
        auth: { user: smtpUser, pass: smtpPass },
      });

      const fromName = smtpFromName || 'NIVPAP';
      const fromEmail = smtpFrom || smtpUser;

      await transporter.sendMail({
        from: { name: fromName, address: fromEmail },
        to: email,
        subject: `You're on the ${fromName} waitlist!`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0a0a0a;color:#e5e5e5;border-radius:16px;overflow:hidden;border:1px solid #1a1a1a;">
            <div style="padding:40px 32px;text-align:center;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#fff;">You&rsquo;re in!</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#737373;line-height:1.6;">
                Thanks for joining the ${fromName} waitlist.<br/>We&rsquo;ll notify you the moment we launch.
              </p>
              <div style="background:#141414;border:1px solid #222;border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#525252;">Your registered email</p>
                <p style="margin:4px 0 0;font-size:15px;color:#a78bfa;font-weight:600;">${email}</p>
              </div>
              <p style="margin:0;font-size:12px;color:#404040;">Stay tuned &mdash; something remarkable is coming from ${fromName}.</p>
            </div>
          </div>
        `,
      });

      if (smtpToAdmin) {
          await transporter.sendMail({
          from: { name: `${fromName} Waitlist`, address: fromEmail },
          to: smtpToAdmin,
          subject: 'New waitlist subscriber!',
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0a0a0a;color:#e5e5e5;border-radius:16px;overflow:hidden;border:1px solid #1a1a1a;">
              <div style="padding:40px 32px;text-align:center;">
                <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#fff;">New Signup!</h1>
                <p style="margin:0 0 24px;font-size:15px;color:#737373;line-height:1.6;">A new email has been added to the ${fromName} waitlist.</p>
                <div style="background:#141414;border:1px solid #222;border-radius:12px;padding:20px;margin-bottom:24px;">
                  <p style="margin:0;font-size:13px;color:#525252;">Email Address</p>
                  <p style="margin:4px 0 0;font-size:15px;color:#a78bfa;font-weight:600;">${email}</p>
                </div>
                <p style="margin:0;font-size:12px;color:#404040;">Received on: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC</p>
              </div>
            </div>
          `,
        });
      }
    } catch (mailErr) {
      console.error('Nodemailer Email Error:', mailErr);
      if (!dbSaved) {
        return NextResponse.json({ error: 'Failed to process your signup. Please try again later.' }, { status: 500 });
      }
      console.warn('Subscriber saved to DB, but confirmation email failed to send.');
    }
  } else {
    if (!dbSaved) {
      console.error('Neither Supabase nor SMTP is configured.');
      return NextResponse.json({ error: 'System is currently undergoing maintenance. Please try again later.' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "You're on the waitlist! We'll notify you at launch." });
}
