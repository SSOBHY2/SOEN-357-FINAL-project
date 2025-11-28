import { Sparkles } from "lucide-react";

interface SimplifyButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  label: string;
  loadingLabel: string;
}

export function SimplifyButton({ 
  loading, 
  disabled, 
  onClick, 
  label,
  loadingLabel 
}: SimplifyButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-sm"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
}