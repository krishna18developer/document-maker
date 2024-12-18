"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCertificate } from "@/context/certificate-context";

export function CertificateCanvas() {
  const {
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    backgroundImage,
    csvData,
    previewRow
  } = useCertificate();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load and draw background image
  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [backgroundImage]);

  // Draw elements with CSV data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw background
    if (backgroundImage) {
      const img = new Image();
      img.src = backgroundImage;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    // Draw elements
    elements.forEach((element) => {
      ctx.font = `${element.fontSize}px ${element.fontFamily}`;
      ctx.fillStyle = element.color;
      
      // Replace placeholder with actual CSV data if available
      let displayText = element.text;
      if (element.columnKey && csvData && csvData.rows[previewRow]) {
        const columnIndex = csvData.headers.indexOf(element.columnKey);
        if (columnIndex !== -1) {
          displayText = csvData.rows[previewRow][columnIndex];
        }
      }

      ctx.fillText(displayText, element.x, element.y);

      if (selectedElement === element.id) {
        const metrics = ctx.measureText(displayText);
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          element.x - 2,
          element.y - element.fontSize,
          metrics.width + 4,
          element.fontSize + 4
        );
      }
    });
  }, [elements, selectedElement, backgroundImage, csvData, previewRow]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    elements.forEach((element) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.font = `${element.fontSize}px ${element.fontFamily}`;
      const metrics = ctx.measureText(element.text);
      
      if (
        x >= element.x &&
        x <= element.x + metrics.width &&
        y >= element.y - element.fontSize &&
        y <= element.y
      ) {
        setSelectedElement(element.id);
        setElements(
          elements.map((el) =>
            el.id === element.id ? { ...el, isDragging: true } : el
          )
        );
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setElements(
      elements.map((el) =>
        el.id === selectedElement && el.isDragging
          ? { ...el, x, y }
          : el
      )
    );
  };

  const handleMouseUp = () => {
    setElements(
      elements.map((el) => ({ ...el, isDragging: false }))
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 border rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={842}  // A4 width at 96 DPI
          height={595} // A4 height at 96 DPI
          className="border border-gray-200 w-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      <div className="space-y-4">
        {selectedElement && (
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                value={elements.find(el => el.id === selectedElement)?.text}
                onChange={(e) => {
                  setElements(elements.map(el =>
                    el.id === selectedElement
                      ? { ...el, text: e.target.value }
                      : el
                  ));
                }}
              />
            </div>

            <div>
              <Label>Font Family</Label>
              <Select
                value={elements.find(el => el.id === selectedElement)?.fontFamily}
                onValueChange={(value) => {
                  setElements(elements.map(el =>
                    el.id === selectedElement
                      ? { ...el, fontFamily: value }
                      : el
                  ));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Arial", "Times New Roman", "Courier New", "Georgia", "Verdana"].map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Font Size</Label>
              <Input
                type="number"
                value={elements.find(el => el.id === selectedElement)?.fontSize}
                onChange={(e) => {
                  setElements(elements.map(el =>
                    el.id === selectedElement
                      ? { ...el, fontSize: Number(e.target.value) }
                      : el
                  ));
                }}
              />
            </div>

            <div>
              <Label>Color</Label>
              <Input
                type="color"
                value={elements.find(el => el.id === selectedElement)?.color}
                onChange={(e) => {
                  setElements(elements.map(el =>
                    el.id === selectedElement
                      ? { ...el, color: e.target.value }
                      : el
                  ));
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 