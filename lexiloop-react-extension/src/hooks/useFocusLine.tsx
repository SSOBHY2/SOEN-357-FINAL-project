import { useState } from 'react';

export function useFocusLine() {
  const [focusLineEnabled, setFocusLineEnabled] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);

  const toggleFocusLine = () => {
    setFocusLineEnabled(!focusLineEnabled);
  };

  const setLine = (index: number) => {
    if (focusLineEnabled) {
      setCurrentLine(index);
    }
  };

  return {
    focusLineEnabled,
    currentLine,
    toggleFocusLine,
    setLine
  };
}