import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { csvData, elements, backgroundImage, emailTemplate } = await req.json();

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: session.user.accessToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: session.user.email,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessToken: session.user.accessToken,
    },
  });

  try {
    for (const row of csvData.rows) {
      const emailIndex = csvData.headers.indexOf("email");
      if (emailIndex === -1) continue;

      const recipientEmail = row[emailIndex];
      let personalizedTemplate = emailTemplate;

      // Replace placeholders with actual data
      csvData.headers.forEach((header, index) => {
        personalizedTemplate = personalizedTemplate.replace(
          new RegExp(`{${header}}`, "g"),
          row[index]
        );
      });

      // Generate certificate
      const certificate = await generateCertificate(row, elements, backgroundImage);

      await transporter.sendMail({
        from: session.user.email,
        to: recipientEmail,
        subject: "Your Certificate",
        text: personalizedTemplate,
        attachments: [
          {
            filename: "certificate.png",
            content: certificate.split("base64,")[1],
            encoding: "base64",
          },
        ],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
  }
} 