"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  isDragging: boolean;
}

export function CertificateCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<TextElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  const fonts = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image if exists
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    // Draw text elements
    elements.forEach((element) => {
      ctx.font = `${element.fontSize}px ${element.fontFamily}`;
      ctx.fillStyle = element.color;
      ctx.fillText(element.text, element.x, element.y);

      // Draw selection box if element is selected
      if (selectedElement === element.id) {
        const metrics = ctx.measureText(element.text);
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
  }, [elements, selectedElement, backgroundImage]);

  const addTextElement = () => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      text: "Sample Text",
      x: 100,
      y: 100,
      fontSize: 24,
      fontFamily: "Arial",
      color: "#000000",
      isDragging: false,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on any element
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
        <Button onClick={addTextElement}>Add Text Element</Button>

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
                  {fonts.map((font) => (
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