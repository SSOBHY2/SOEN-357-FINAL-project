import { Sparkles } from "lucide-react";

interface SimplifiedTextOutputProps {
  simplified: string;
  fontFamily: string;
  fontSize: number;
  focusLineEnabled: boolean;
  currentLine: number;
  onLineClick: (index: number) => void;
  resultLabel: string;
  placeholder: string;
}

export function SimplifiedTextOutput({
  simplified,
  fontFamily,
  fontSize,
  focusLineEnabled,
  currentLine,
  onLineClick,
  resultLabel,
  placeholder
}: SimplifiedTextOutputProps) {
  const lines = simplified.split('\n').filter(line => line.trim());

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-700 flex items-center">
          <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
          {resultLabel}
        </label>
      </div>
      <div
        className="p-3 border-2 border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-purple-50 min-h-[150px] max-h-[200px] overflow-y-auto leading-relaxed text-sm"
        style={{ fontFamily, fontSize }}
      >
        {simplified ? (
          focusLineEnabled ? (
            <div>
              {lines.map((line, index) => (
                <div
                  key={index}
                  onClick={() => onLineClick(index)}
                  className={`cursor-pointer px-2 py-1 rounded transition-all ${
                    currentLine === index 
                      ? 'bg-purple-200 shadow-md' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          ) : (
            simplified
          )
        ) : (
          <span className="text-gray-400 italic text-xs">
            {placeholder}
          </span>
        )}
      </div>
    </div>
  );
}
