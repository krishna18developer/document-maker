"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type CSVData = {
  headers: string[];
  rows: string[][];
};

export function CSVUploader() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);

  const parseCSV = (text: string): CSVData => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const rows = lines.slice(1)
      .filter(line => line.trim())
      .map(line => line.split(',').map(cell => cell.trim()));
    
    return { headers, rows };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const data = parseCSV(text);
        setCsvData(data);
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/10" : "border-muted hover:border-muted-foreground"
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <p>Drag and drop a CSV file here, or click to select</p>
          <p className="text-sm text-muted-foreground">
            Make sure your CSV includes name and email columns
          </p>
        </div>
      </div>

      {csvData && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {csvData.headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 