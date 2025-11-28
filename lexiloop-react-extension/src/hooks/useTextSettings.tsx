import { useState } from 'react';

export function useTextSettings() {
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [fontSize, setFontSize] = useState(16);

  return {
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize
  };
}