"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCertificate } from "@/context/certificate-context";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export function CertificateGenerator() {
  const { elements, backgroundImage, csvData } = useCertificate();
  const [generating, setGenerating] = useState(false);

  const generateCertificate = async (rowData: string[], rowIndex: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 842; // A4 width at 96 DPI
    canvas.height = 595; // A4 height at 96 DPI
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw background
    if (backgroundImage) {
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = backgroundImage;
      });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    // Draw elements
    elements.forEach((element) => {
      ctx.font = `${element.fontSize}px ${element.fontFamily}`;
      ctx.fillStyle = element.color;
      
      let text = element.text;
      if (element.columnKey && csvData) {
        const columnIndex = csvData.headers.indexOf(element.columnKey);
        if (columnIndex !== -1) {
          text = rowData[columnIndex];
        }
      }
      
      ctx.fillText(text, element.x, element.y);
    });

    return canvas.toDataURL('image/png');
  };

  const generateAndDownload = async () => {
    if (!csvData || !csvData.rows.length) return;
    
    setGenerating(true);
    const zip = new JSZip();
    
    try {
      for (let i = 0; i < csvData.rows.length; i++) {
        const row = csvData.rows[i];
        const nameColumn = csvData.headers.indexOf('name');
        const fileName = nameColumn !== -1 
          ? `certificate_${row[nameColumn].replace(/\s+/g, '_')}.png`
          : `certificate_${i + 1}.png`;
        
        const certificateData = await generateCertificate(row, i);
        if (certificateData) {
          const base64Data = certificateData.split(',')[1];
          zip.file(fileName, base64Data, { base64: true });
        }
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "certificates.zip");
    } catch (error) {
      console.error("Error generating certificates:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button 
      onClick={generateAndDownload} 
      disabled={generating || !csvData || !backgroundImage}
    >
      {generating ? "Generating..." : "Generate & Download All"}
    </Button>
  );
} 