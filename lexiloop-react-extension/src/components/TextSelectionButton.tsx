import { Copy } from "lucide-react";

interface TextSelectionButtonProps {
  onGrabText: () => void;
  label: string;
}

export function TextSelectionButton({ onGrabText, label }: TextSelectionButtonProps) {
  return (
    <button
      onClick={onGrabText}
      className="w-full mb-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium text-sm"
    >
      <Copy className="w-4 h-4" />
      {label}
    </button>
  );
}
