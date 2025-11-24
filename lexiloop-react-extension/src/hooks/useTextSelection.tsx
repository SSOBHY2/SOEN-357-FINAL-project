import { useToast } from "./useToast";

export function useTextSelection(onTextSelected: (text: string) => void) {
  const { showToast } = useToast();

  const grabSelectedText = async () => {
    try {
      const selectedText = window.getSelection()?.toString() || "";
      
      if (selectedText) {
        onTextSelected(selectedText);
      } else {
        showToast("No text selected. Please select some text and try again.");
      }

    } catch (error) {
      console.error("Error during text selection:", error);
      showToast("Error: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  return { grabSelectedText };
}
