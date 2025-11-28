// src/hooks/useLanguage.ts
import { useState } from 'react';

export type Language = 'fr' | 'en';

interface Translations {
  input: {
    grabText: string;
    uploadPdf: string;
    uploading: string;
    placeholder: string;
    simplifyButton: string;
    simplifying: string;
  };
  output: {
    fontLabel: string;
    sizeLabel: string;
    read: string;
    stop: string;
    focus: string;
    result: string;
    resultPlaceholder: string;
  };
  alerts: {
    noText: string;
    textCopied: string;
    pdfSuccess: string;
    pdfError: string;
  };
}

const translations: Record<Language, Translations> = {
  fr: {
    input: {
      grabText: 'Récupérer texte sélectionné',
      uploadPdf: 'Glissez un PDF',
      uploading: 'Extraction en cours...',
      placeholder: 'Collez votre texte ici ou utilisez les options ci-dessus...',
      simplifyButton: 'Simplifier',
      simplifying: 'En cours...',
    },
    output: {
      fontLabel: 'Police',
      sizeLabel: 'Taille',
      read: 'Lire',
      stop: 'Arrêter',
      focus: 'Focus',
      result: 'Résultat',
      resultPlaceholder: 'Le texte simplifié apparaîtra ici...',
    },
    alerts: {
      noText: 'Aucun texte sélectionné. Sélectionnez du texte sur la page puis cliquez à nouveau.',
      textCopied: 'Texte copié !',
      pdfSuccess: 'Texte extrait avec succès !',
      pdfError: 'Erreur lors de l\'extraction du PDF',
    },
  },
  en: {
    input: {
      grabText: 'Grab selected text',
      uploadPdf: 'Drop PDF',
      uploading: 'Extracting...',
      placeholder: 'Paste your text here or use the options above...',
      simplifyButton: 'Simplify',
      simplifying: 'Processing...',
    },
    output: {
      fontLabel: 'Font',
      sizeLabel: 'Size',
      read: 'Read',
      stop: 'Stop',
      focus: 'Focus',
      result: 'Result',
      resultPlaceholder: 'Simplified text will appear here...',
    },
    alerts: {
      noText: 'No text selected. Select text on the page then click again.',
      textCopied: 'Text copied!',
      pdfSuccess: 'Text extracted successfully!',
      pdfError: 'Error extracting PDF',
    },
  },
};

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  return {
    language,
    t,
    toggleLanguage,
  };
}