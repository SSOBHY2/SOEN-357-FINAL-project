interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function TextInput({ value, onChange, placeholder }: TextInputProps) {
  return (
    <div className="mt-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full p-2 text-sm border-2 border-gray-200 rounded-lg resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}