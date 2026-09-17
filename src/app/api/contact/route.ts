import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const recentLeads = new Map<string, number>();
const DEDUPLICATION_WINDOW_MS = 30000;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    let {
      firstName,
      lastName,
      email,
      phone,
      companyName,
      additionalInfo,
      sourceAgent,
    } = data;

    email = (email || '').replace(/^mailto:/i, '').toLowerCase().trim();
    phone = (phone || '').trim();

    const leadKey = `${email}:${phone}`;
    const now = Date.now();
    const lastSubmission = recentLeads.get(leadKey);

    if (lastSubmission && (now - lastSubmission) < DEDUPLICATION_WINDOW_MS) {
      console.log(`[Contact API] Deduplicated request for ${leadKey}. Skipping email.`);
      return NextResponse.json({ success: true, deduplicated: true });
    }
    
    recentLeads.set(leadKey, now);

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT);
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!smtpHost || !emailUser || !emailPass) {
      console.log(`[Contact API] Captured Lead (SMTP not configured):`, {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        companyName,
        additionalInfo,
        sourceAgent
      });
      return NextResponse.json({ 
        success: true, 
        message: "Enquiry logged successfully (SMTP credentials not configured)." 
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort || 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptionsInternal = {
      from: `"DPauls Travel AI" <${emailUser}>`,
      to: emailUser,
      subject: `New Holiday Enquiry: ${firstName} ${lastName} (${email})`,
      html: `
        <h2>New DPauls Travel AI Holiday Enquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Source Agent:</strong> ${sourceAgent || 'dpaul'}</p>
        <hr />
        <p><strong>Enquiry Notes & Details:</strong></p>
        <div style="background-color: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #cbd5e1;">${additionalInfo || 'None'}</div>
      `,
    };

    const mailOptionsUser = {
      from: `"DPauls Travel" <${emailUser}>`,
      to: email,
      subject: `Enquiry Received: DPauls Travel & Tours`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #1E88E5;">Namaste ${firstName},</h2>
          <p>Thank you for inquiring with <strong>DPauls Travel & Tours</strong>.</p>
          <p>We've received your travel details and our expert travel advisors are preparing a customized holiday proposal for you.</p>
          <p>A dedicated travel specialist will reach out to you at <strong>${phone || email}</strong> shortly.</p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">DPauls Travel & Tours Limited | B-40, Shivalik, Malviya Nagar, New Delhi - 110017<br/>Helpline: 011-66777111 / 011-68141111</p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(mailOptionsInternal),
      transporter.sendMail(mailOptionsUser),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process enquiry', details: error.message },
      { status: 500 }
    );
  }
}
