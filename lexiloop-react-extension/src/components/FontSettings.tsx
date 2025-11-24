import { useState, useRef, useEffect } from 'react';

interface FontSettingsProps {
  fontFamily: string;
  fontSize: number;
  onFontFamilyChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  fontLabel: string;
  sizeLabel: string;
}

const fontOptions = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "'Georgia', serif", label: "Georgia" },
  { value: "'OpenDyslexic', sans-serif", label: "OpenDyslexic" }
];

export function FontSettings({
  fontFamily,
  fontSize,
  onFontFamilyChange,
  onFontSizeChange,
  fontLabel,
  sizeLabel
}: FontSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedFont = fontOptions.find(opt => opt.value === fontFamily);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex gap-4 mb-3 pb-3 border-b border-gray-200">
      <div className="flex-1" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-900 mb-1.5">
          {fontLabel}
        </label>
        <div className="relative inline-block w-full">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <span>{selectedFont?.label}</span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="-mr-1 h-5 w-5 text-gray-400"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              />
            </svg>
          </button>

          {isOpen && (
            <div 
              className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg transition-all duration-100 ease-out"
              style={{
                animation: 'fadeIn 100ms ease-out'
              }}
            >
              <div className="py-1">
                {fontOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onFontFamilyChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`block bg-white w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none ${
                      fontFamily === option.value ? 'bg-gray-50 font-semibold' : ''
                    }`}
                    style={{ fontFamily: option.value }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-900 mb-1.5">
          {sizeLabel}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            value={fontSize}
            min={12}
            max={24}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="block accent-purple-600 w-full py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none"
          />
          <span className="text-sm font-medium text-gray-700 w-8 text-center">{fontSize}</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
