"use client";

import { createContext, useContext, useState } from "react";

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  isDragging: boolean;
  columnKey?: string; // Maps to CSV column
}

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface EmailConfig {
  subject: string;
  body: string;
  bcc: string;
}

interface CertificateContextType {
  elements: TextElement[];
  setElements: (elements: TextElement[]) => void;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
  csvData: CSVData | null;
  setCsvData: (data: CSVData | null) => void;
  previewRow: number;
  setPreviewRow: (index: number) => void;
  emailConfig: EmailConfig;
  setEmailConfig: (config: EmailConfig | ((prev: EmailConfig) => EmailConfig)) => void;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export function CertificateProvider({ children }: { children: React.ReactNode }) {
  const [elements, setElements] = useState<TextElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [previewRow, setPreviewRow] = useState(0);
  const [emailConfig, setEmailConfig] = useState({
    subject: "Your Certificate",
    bcc: "",
    body: `Dear {name},\n\nPlease find attached your certificate.\n\nBest regards,\n{sender_name}`
  });

  return (
    <CertificateContext.Provider
      value={{
        elements,
        setElements,
        selectedElement,
        setSelectedElement,
        backgroundImage,
        setBackgroundImage,
        csvData,
        setCsvData,
        previewRow,
        setPreviewRow,
        emailConfig,
        setEmailConfig,
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificate() {
  const context = useContext(CertificateContext);
  if (context === undefined) {
    throw new Error("useCertificate must be used within a CertificateProvider");
  }
  return context;
} 