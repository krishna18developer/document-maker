"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { useCertificate } from "@/context/certificate-context";

export function CertificateUploader() {
  const { setBackgroundImage } = useCertificate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setBackgroundImage(objectUrl);
    }
  }, [setBackgroundImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/10" : "border-muted hover:border-muted-foreground"
      )}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <p>Drag and drop a certificate template here, or click to select</p>
        <p className="text-sm text-muted-foreground">
          Supports PNG, JPG (Recommended size: A4 landscape)
        </p>
      </div>
    </div>
  );
} 