"use client";

import { useCertificate } from "@/context/certificate-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CSVFieldSelector() {
  const { csvData, elements, setElements } = useCertificate();

  const addField = (columnKey: string) => {
    const newElement = {
      id: `text-${Date.now()}`,
      text: `{${columnKey}}`,
      x: 100,
      y: 100,
      fontSize: 24,
      fontFamily: "Arial",
      color: "#000000",
      isDragging: false,
      columnKey,
    };
    setElements([...elements, newElement]);
  };

  if (!csvData) {
    return (
      <div className="text-muted-foreground">
        Import CSV data to see available fields
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Click on a field to add it to the certificate
      </div>
      <div className="flex flex-wrap gap-2">
        {csvData.headers.map((header) => (
          <Badge
            key={header}
            className="cursor-pointer hover:bg-primary"
            onClick={() => addField(header)}
          >
            {header}
          </Badge>
        ))}
      </div>
    </div>
  );
} 