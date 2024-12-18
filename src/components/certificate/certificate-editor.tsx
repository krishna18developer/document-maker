"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

interface CertificateEditorProps {
  templateUrl: string;
}

export function CertificateEditor({ templateUrl }: CertificateEditorProps) {
  const [elements, setElements] = useState<TextElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const addTextElement = () => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      text: "Sample Text",
      x: 50,
      y: 50,
      fontSize: 24,
      color: "#000000",
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<TextElement>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 border rounded-lg p-4">
        <div className="relative w-full aspect-[1.414] bg-white">
          <img
            src={templateUrl}
            alt="Certificate template"
            className="absolute inset-0 w-full h-full object-contain"
          />
          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-move ${
                selectedElement === element.id ? "ring-2 ring-primary" : ""
              }`}
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                fontSize: `${element.fontSize}px`,
                color: element.color,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              {element.text}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Button onClick={addTextElement}>Add Text Element</Button>

        {selectedElement && (
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                value={elements.find(el => el.id === selectedElement)?.text}
                onChange={(e) => updateElement(selectedElement, { text: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 