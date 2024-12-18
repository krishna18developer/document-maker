"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function CertificateUploader() {
  const [template, setTemplate] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setTemplate(file);
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTemplate(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

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
        {preview ? (
          <div className="space-y-4">
            <div className="relative w-full aspect-[1.414] mx-auto">
              <Image
                src={preview}
                alt="Certificate preview"
                fill
                className="object-contain"
              />
            </div>
            <Button variant="outline" onClick={handleRemove}>
              Remove Template
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p>Drag and drop a certificate template here, or click to select</p>
            <p className="text-sm text-muted-foreground">
              Supports PNG, JPG (Recommended size: A4 landscape)
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 