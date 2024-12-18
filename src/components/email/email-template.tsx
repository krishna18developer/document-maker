"use client";

import { useState } from "react";
import { useCertificate } from "@/context/certificate-context";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmailTemplate() {
  const { csvData } = useCertificate();
  const [emailTemplate, setEmailTemplate] = useState(`Dear {name},

Please find attached your certificate.

Best regards,
{sender_name}`);

  const insertField = (field: string) => {
    setEmailTemplate((prev) => prev + ` {${field}}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {csvData?.headers.map((header) => (
          <Badge
            key={header}
            className="cursor-pointer hover:bg-primary"
            onClick={() => insertField(header)}
          >
            {header}
          </Badge>
        ))}
      </div>
      <Textarea
        value={emailTemplate}
        onChange={(e) => setEmailTemplate(e.target.value)}
        className="h-[200px]"
        placeholder="Enter your email template..."
      />
    </div>
  );
} 