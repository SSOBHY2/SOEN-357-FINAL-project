import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useBackendUrl } from './useBackendUrl';
import { useToast } from './useToast';

interface PdfExtractResponse {
  text: string;
  pages: number;
}

export function usePdfExtractor(onTextExtracted: (text: string) => void) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backendUrl = useBackendUrl();
  const { showToast } = useToast();

  const extractPdf = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      showToast("Please upload a valid PDF file.");
      return;
    }

    setLoading(true);
    onTextExtracted("");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${backendUrl}/pdf/extract`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error: { detail?: string } = await response.json();
        showToast("Error extracting PDF: " + (error.detail || response.statusText));
        return;
      }

      const data: PdfExtractResponse = await response.json();
      onTextExtracted(data.text);

      showToast(`Text extracted successfully! (${data.pages} page${data.pages > 1 ? 's' : ''})`);

    } catch (error: unknown) {
      console.error("PDF Error:", error);
      if (error instanceof Error) {
        showToast("Error extracting PDF: " + error.message);
      } else {
        showToast("Error extracting PDF: " + String(error));
      }
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return {
    loading,
    fileInputRef,
    extractPdf
  };
}