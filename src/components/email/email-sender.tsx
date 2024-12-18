"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCertificate } from "@/context/certificate-context";
import { useAuth } from "@/context/auth-context";
import { generateCertificate } from "@/lib/certificate";

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
  summary?: {
    total: number;
    successful: number;
    failed: number;
    successfulEmails: string[];
    failedEmails: Array<{ email: string; error: string }>;
  };
}

export function EmailSender() {
  const { csvData, elements, backgroundImage, emailConfig } = useCertificate();
  const { isAuthenticated, signIn } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<string>("");

  const validateEmailConfig = () => {
    console.log("Validating email config:", { emailConfig });
    
    if (!emailConfig) {
      throw new Error("Email configuration is missing");
    }
    
    if (!emailConfig.subject?.trim()) {
      throw new Error("Email subject is required");
    }
    if (!emailConfig.body?.trim()) {
      throw new Error("Email body is required");
    }
    
    // Validate BCC emails if provided
    if (emailConfig.bcc) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const bccEmails = emailConfig.bcc.split(',').map(email => email.trim()).filter(Boolean);
      const invalidEmails = bccEmails.filter(email => !emailRegex.test(email));
      if (invalidEmails.length > 0) {
        throw new Error(`Invalid BCC email(s): ${invalidEmails.join(', ')}`);
      }
    }
  };

  const sendEmails = async () => {
    console.log("Starting email send process...");
    console.log("Current state:", {
      isAuthenticated,
      hasCsvData: Boolean(csvData?.rows?.length),
      hasBackgroundImage: Boolean(backgroundImage),
      elementsCount: elements?.length ?? 0,
      hasEmailConfig: Boolean(emailConfig)
    });

    if (!isAuthenticated) {
      console.log("User not authenticated, triggering sign in");
      await signIn();
      return;
    }

    if (!csvData?.rows?.length) {
      console.warn("Missing CSV data");
      toast({
        title: "Missing Data",
        description: "Please upload a CSV file with recipient data",
        variant: "destructive",
      });
      return;
    }

    if (!backgroundImage) {
      console.warn("Missing background image");
      toast({
        title: "Missing Template",
        description: "Please upload a certificate template",
        variant: "destructive",
      });
      return;
    }

    try {
      validateEmailConfig();
      setSending(true);
      setProgress("Generating certificates...");

      // Generate all certificates first
      const certificatesData = await Promise.all(
        csvData.rows.map(async (row, _index) => {
          const certificate = await generateCertificate(row, elements, backgroundImage, csvData.headers);
          return certificate?.split("base64,")[1];
        })
      );

      setProgress("Sending emails...");
      
      const payload = {
        csvData,
        certificatesData,
        emailConfig,
      };
      
      console.log("Sending request to API with data:", {
        csvRowCount: csvData.rows.length,
        certificatesCount: payload.certificatesData.length,
        hasBackgroundImage: Boolean(backgroundImage),
        emailConfigPresent: Boolean(emailConfig)
      });

      const response = await fetch("/api/send-certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("API Response status:", response.status);
      const data: ApiResponse = await response.json();
      console.log("API Response details:", {
        status: response.status,
        success: data.success,
        summary: data.summary,
        error: data.error
      });

      if (!response.ok || !data.success) {
        const errorMessage = data.error || 
          (data.summary ? 
            `Failed to send ${data.summary.failed} out of ${data.summary.total} emails` : 
            'Failed to send certificates');
            
        console.error('Email sending failed:', {
          error: errorMessage,
          failedEmails: data.summary?.failedEmails
        });
        
        throw new Error(errorMessage);
      }

      toast({
        title: "Certificates Sent",
        description: data.summary 
          ? `Successfully sent ${data.summary.successful} out of ${data.summary.total} certificates.${
              data.summary.failed ? ` (${data.summary.failed} failed)` : ''
            }`
          : "Certificates sent successfully",
        variant: data.summary?.failed ? "warning" : "default",
        duration: 5000,
      });
    } catch (error) {
      console.error("Email sending error:", error);
      console.error("Error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      setProgress("Failed to send certificates");
      toast({
        title: "Error Sending Certificates",
        description: error instanceof Error 
          ? `Error: ${error.message}`
          : "Failed to send certificates. Please check console for details.",
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setSending(false);
      setTimeout(() => setProgress(""), 3000);
    }
  };

  const sendEmailsOnly = async () => {
    if (!isAuthenticated || !csvData?.rows?.length) {
      return;
    }

    try {
      validateEmailConfig();
      setSending(true);
      setProgress("Sending emails...");
      
      const payload = {
        csvData,
        certificatesData: null, // Indicate no certificates
        emailConfig,
      };

      const response = await fetch("/api/send-certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send emails');
      }

      toast({
        title: "Emails Sent",
        description: `Successfully sent ${data.summary.successful} out of ${data.summary.total} emails`,
        variant: data.summary?.failed ? "warning" : "default",
      });
    } catch (error) {
      console.error("Email sending error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send emails",
        variant: "destructive",
      });
    } finally {
      setSending(false);
      setProgress("");
    }
  };

  return (
    <div className="space-y-4">
      {!isAuthenticated ? (
        <Button onClick={() => signIn()} className="w-full">
          Sign in with Google to Send Emails
        </Button>
      ) : (
        <div className="space-y-2">
          <Button 
            onClick={sendEmailsOnly} 
            disabled={sending || !csvData?.rows?.length}
            variant="outline"
            className="w-full"
          >
            {sending ? "Sending..." : "Send Emails Only"}
          </Button>
          <Button 
            onClick={sendEmails} 
            disabled={sending || !csvData?.rows?.length || !backgroundImage}
            className="w-full"
          >
            {sending ? "Sending Certificates..." : "Send Certificates"}
          </Button>
          {progress && (
            <p className="text-sm text-muted-foreground text-center">{progress}</p>
          )}
        </div>
      )}
    </div>
  );
} 