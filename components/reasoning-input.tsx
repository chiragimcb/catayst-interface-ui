"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Camera, X, Paperclip } from "lucide-react";

interface ReasoningInputProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (base64: string | null) => void;
  imagePreview?: string | null;
}

export function ReasoningInput({
  value,
  onChange,
  onImageUpload,
  imagePreview,
}: ReasoningInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <PenLine className="h-4 w-4 text-primary" />
          Log Your Methodology
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {" "}
        {/* Added relative here */}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your logic or snap a photo of your scratchpad..."
          className="min-h-[140px] resize-none text-sm pb-12" // Added padding-bottom
        />
        {/* The Action Bar (Camera & Preview) */}
        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          {imagePreview && (
            <div className="relative h-12 w-12 rounded-md border bg-slate-100 overflow-hidden shadow-sm">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => onImageUpload?.(null)}
                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            id="camera-upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="camera-upload"
            className="cursor-pointer p-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center"
          >
            <Camera className="w-5 h-5" />
          </label>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Snap a photo of your paper work to get a diagnostic critique.
        </p>
      </CardContent>
    </Card>
  );
}
