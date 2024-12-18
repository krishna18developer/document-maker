import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface EmailConfig {
  subject: string;
  body: string;
  bcc?: string;
}

interface CsvData {
  headers: string[];
  rows: string[][];
}

interface RequestData {
  csvData: CsvData;
  certificatesData: string[];
  emailConfig: EmailConfig;
}

interface SendMailResponse {
  success: boolean;
  summary?: {
    total: number;
    successful: number;
    failed: number;
    successfulEmails: string[];
    failedEmails: Array<{ email: string; error: string }>;
  };
  error?: string;
}

export async function POST(req: Request): Promise<NextResponse<SendMailResponse>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const { csvData, certificatesData, emailConfig }: RequestData = await req.json();
    const { subject, body: emailTemplate, bcc } = emailConfig;

    if (!csvData?.rows?.length) {
      return NextResponse.json(
        { success: false, error: "No recipient data provided" },
        { status: 400 }
      );
    }

    // Initialize Gmail API
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL
    );

    oauth2Client.setCredentials({
      access_token: session.user.accessToken,
      refresh_token: session.user.refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const successfulSends: string[] = [];
    const failedSends: { email: string; error: string }[] = [];

    for (let i = 0; i < csvData.rows.length; i++) {
      const row = csvData.rows[i];
      const emailIndex = csvData.headers.findIndex(header => 
        header.toLowerCase() === "email"
      );
      
      const recipientEmail = row[emailIndex];

      try {
        // Create a mapping of placeholders to values
        const placeholderMap = csvData.headers.reduce((acc, header, index) => {
          acc[header.toLowerCase()] = row[index] || '';
          return acc;
        }, {} as Record<string, string>);

        // Replace placeholders in subject and body
        let personalizedSubject = subject;
        let personalizedBody = emailTemplate;

        Object.entries(placeholderMap).forEach(([key, value]) => {
          const placeholder = new RegExp(`{${key}}`, "gi");
          personalizedSubject = personalizedSubject.replace(placeholder, value);
          personalizedBody = personalizedBody.replace(placeholder, value);
        });

        // Create email content
        const parts = [
          "MIME-Version: 1.0",
          "Content-Type: text/html; charset=utf-8",
          `From: ${session.user.name} <${session.user.email}>`,
          `To: ${recipientEmail}`,
          bcc ? `Bcc: ${bcc}` : '',
          `Subject: ${personalizedSubject}`,
          "",
          personalizedBody
        ];

        // Add certificate if available
        if (certificatesData?.[i]) {
          const boundary = "certificate_boundary";
          parts[1] = `Content-Type: multipart/mixed; boundary=${boundary}`;
          parts.push(
            `--${boundary}`,
            "Content-Type: text/html; charset=utf-8",
            "",
            personalizedBody,
            "",
            `--${boundary}`,
            "Content-Type: image/png",
            "Content-Transfer-Encoding: base64",
            `Content-Disposition: attachment; filename="certificate-${recipientEmail}.png"`,
            "",
            certificatesData[i],
            "",
            `--${boundary}--`
          );
        }

        const mimeEmail = parts.join("\r\n");

        const encodedEmail = Buffer.from(mimeEmail)
          .toString("base64")
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        await gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: encodedEmail
          }
        });

        successfulSends.push(recipientEmail);
      } catch (error) {
        console.error(`Failed to send email to ${recipientEmail}:`, error);
        failedSends.push({ 
          email: recipientEmail, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    const totalAttempted = csvData.rows.length;
    const successCount = successfulSends.length;
    const failureCount = failedSends.length;

    return NextResponse.json({
      success: successCount > 0,
      summary: {
        total: totalAttempted,
        successful: successCount,
        failed: failureCount,
        successfulEmails: successfulSends,
        failedEmails: failedSends
      }
    });

  } catch (error) {
    console.error("Error in email sending process:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to send emails"
      }, 
      { status: 500 }
    );
  }
} 