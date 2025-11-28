import { useState } from 'react';
import { useBackendUrl } from './useBackendUrl';
import { useToast } from './useToast';

export function useTextSimplifier() {
  const [text, setText] = useState("");
  const [simplified, setSimplified] = useState("");
  const [simplifyLoading, setSimplifyLoading] = useState(false);
  const backendUrl = useBackendUrl();
  const { showToast } = useToast();

  const simplifyText = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setSimplified("Please enter text to simplify.");
      return;
    }

    setSimplifyLoading(true);
    setSimplified("");

    try {
      const response = await fetch(`${backendUrl}/simplify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error during simplification");
      }

      const data = await response.json();
      setSimplified(data.simplified_text);
      showToast("Text simplified successfully!", 'success');

    } catch (error) {
      showToast("Error during simplification.", 'error');
      setSimplified("Error during simplification: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setSimplifyLoading(false);
    }
  };

  return {
    text,
    setText,
    simplified,
    setSimplified,
    simplifyLoading,
    simplifyText
  };
}