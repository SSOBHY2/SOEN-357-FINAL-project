import { Upload } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";

interface PdfUploadZoneProps {
  loading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  uploadLabel: string;
  uploadingLabel: string;
}

export function PdfUploadZone({ 
  loading, 
  fileInputRef, 
  onUpload,
  uploadLabel,
  uploadingLabel 
}: PdfUploadZoneProps) {

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const event = {
        target: { files },
      } as ChangeEvent<HTMLInputElement>;
      onUpload(event);
    }
  };

  return (
    <div
      className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center relative cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Upload className="w-6 h-6 text-purple-400 mx-auto mb-1 group-hover:text-purple-600 transition-colors" />
      <p className="text-xs font-medium text-gray-700">
        {loading ? uploadingLabel : uploadLabel}
      </p>
      <input
        ref={fileInputRef}
        accept=".pdf"
        type="file"
        onChange={onUpload}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        disabled={loading}
      />
    </div>
  );
}
