import { Languages } from "lucide-react";
import type { Language } from "../hooks/useLanguage";
import LexiloopLogo from "../assets/icon.png";

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
}

export function Header({ language, onToggleLanguage }: HeaderProps) {
  return (
    <div className="text-center mb-4 relative">
      <button
        onClick={onToggleLanguage}
        className="absolute right-0 top-0 px-3 py-1 bg-white border-2 border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-all shadow-sm flex items-center gap-1 text-xs font-medium"
        title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
      >
        <Languages className="w-3 h-3" />
        {language.toUpperCase()}
      </button>

      <img src={LexiloopLogo} alt="Lexiloop Logo" className="w-32 h-32 mx-auto mb-2" />

    <h1 className="text-xl font-bold text-white">
      Lexiloop
    </h1>
    </div>
  );
}