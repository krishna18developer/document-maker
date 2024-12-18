"use client";

import { useCertificate } from "@/context/certificate-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PreviewSelector() {
  const { csvData, previewRow, setPreviewRow } = useCertificate();

  if (!csvData || csvData.rows.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground">Preview Row</label>
      <Select
        value={previewRow.toString()}
        onValueChange={(value) => setPreviewRow(parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {csvData.rows.map((_, index) => (
            <SelectItem key={index} value={index.toString()}>
              Row {index + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 