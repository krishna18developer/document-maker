"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCertificate } from "@/context/certificate-context";
import { useAuth } from "@/context/auth-context";

export function EmailSender() {
  const { csvData, elements, backgroundImage } = useCertificate();
  const { user, isAuthenticated, signIn } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const sendEmails = async () => {
    if (!isAuthenticated) {
      await signIn();
      return;
    }

    if (!csvData || !backgroundImage) {
      toast({
        title: "Error",
        description: "Please upload a template and CSV file first",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/send-certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          csvData,
          elements,
          backgroundImage,
          emailTemplate,
        }),
      });

      if (!response.ok) throw new Error("Failed to send emails");

      toast({
        title: "Success",
        description: "Certificates have been sent successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send certificates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {!isAuthenticated ? (
        <Button onClick={() => signIn()}>
          Sign in with Google to Send Emails
        </Button>
      ) : (
        <Button 
          onClick={sendEmails} 
          disabled={sending || !csvData || !backgroundImage}
        >
          {sending ? "Sending..." : "Send Certificates"}
        </Button>
      )}
    </div>
  );
} 