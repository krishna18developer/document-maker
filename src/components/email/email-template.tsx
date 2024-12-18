"use client";

import { useState } from "react";
import { useCertificate } from "@/context/certificate-context";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export function EmailTemplate() {
  const { csvData } = useCertificate();
  const [emailConfig, setEmailConfig] = useState({
    subject: "Your Certificate",
    bcc: "",
    body: `Dear {name},

Please find attached your certificate.

Best regards,
{sender_name}`
  });

  const insertField = (field: string, target: 'subject' | 'body') => {
    setEmailConfig(prev => ({
      ...prev,
      [target]: prev[target] + ` {${field}}`
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {csvData?.headers.map((header) => (
          <Badge
            key={header}
            className="cursor-pointer hover:bg-primary"
            onClick={() => insertField(header, 'body')}
          >
            {header}
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Subject</Label>
        <div className="flex gap-2 items-center">
          <Input
            value={emailConfig.subject}
            onChange={(e) => setEmailConfig(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Email subject..."
          />
          <div className="flex gap-1">
            {csvData?.headers.map((header) => (
              <Badge
                key={header}
                variant="outline"
                className="cursor-pointer hover:bg-primary"
                onClick={() => insertField(header, 'subject')}
              >
                +{header}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>BCC (comma-separated emails)</Label>
        <Input
          value={emailConfig.bcc}
          onChange={(e) => setEmailConfig(prev => ({ ...prev, bcc: e.target.value }))}
          placeholder="email1@example.com, email2@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Email Body</Label>
        <Textarea
          value={emailConfig.body}
          onChange={(e) => setEmailConfig(prev => ({ ...prev, body: e.target.value }))}
          className="h-[200px]"
          placeholder="Enter your email template..."
        />
      </div>
    </div>
  );
} 