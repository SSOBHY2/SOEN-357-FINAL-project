import { Volume2, VolumeX, Highlighter, Download } from "lucide-react";
import { useToast } from "../hooks/useToast";

interface ControlButtonsProps {
  isSpeaking: boolean;
  focusLineEnabled: boolean;
  hasSimplifiedText: boolean;
  onToggleSpeech: () => void;
  onToggleFocus: () => void;
  onCopy: () => void;
  readLabel: string;
  stopLabel: string;
  focusLabel: string;
}

export function ControlButtons({
  isSpeaking,
  focusLineEnabled,
  hasSimplifiedText,
  onToggleSpeech,
  onToggleFocus,
  onCopy,
  readLabel,
  stopLabel,
  focusLabel
}: ControlButtonsProps) {

  const { showToast } = useToast();

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={onToggleSpeech}
          disabled={!hasSimplifiedText}
          className={`flex-1 px-3 py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 text-xs font-medium text-white ${
            isSpeaking 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
              : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:opacity-50'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isSpeaking ? stopLabel : readLabel}
        </button>

        <button
          onClick={onToggleFocus}
          disabled={!hasSimplifiedText}
          className={`flex-1 px-3 py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 text-xs font-medium text-white ${
            focusLineEnabled 
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600' 
              : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:opacity-50'
          }`}
        >
          <Highlighter className="w-4 h-4" />
          {focusLabel} {focusLineEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
      
      {hasSimplifiedText && (
        <div className="w-full flex mb-3">
          <button
            onClick={() => {
              onCopy();
              showToast("Simplified text copied to clipboard!", "success");
            }}
            className="w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 text-xs font-medium"
          >
            <Download className="w-4 h-4" />
            Copy
          </button>
        </div>
      )}
    </div>
  );
}