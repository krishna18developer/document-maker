"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useCertificate } from "@/context/certificate-context";

interface EmailConfig {
  subject: string;
  body: string;
  bcc: string;
}

export function EmailTemplate() {
  const { csvData, emailConfig, setEmailConfig } = useCertificate();

  const insertField = (field: string, target: 'subject' | 'body') => {
    const textArea = target === 'body' ? document.getElementById('email-body') as HTMLTextAreaElement : null;
    
    if (target === 'body' && textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const currentValue = emailConfig[target];
      const newValue = currentValue.substring(0, start) + 
        `{${field}}` + 
        currentValue.substring(end);
      
      setEmailConfig((prev: EmailConfig) => ({
        ...prev,
        [target]: newValue
      }));
      
      // Restore cursor position after update
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start + field.length + 2, start + field.length + 2);
      }, 0);
    } else {
      setEmailConfig((prev: EmailConfig) => ({
        ...prev,
        [target]: prev[target] + `{${field}}`
      }));
    }
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
            onChange={(e) => setEmailConfig((prev: EmailConfig) => ({ 
              ...prev, 
              subject: e.target.value 
            }))}
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
        <Label>Email Body</Label>
        <Textarea
          id="email-body"
          value={emailConfig.body}
          onChange={(e) => setEmailConfig((prev: EmailConfig) => ({ 
            ...prev, 
            body: e.target.value 
          }))}
          className="h-[200px]"
          placeholder="Enter your email template..."
        />
      </div>
    </div>
  );
} 