// src/App.tsx - Version avec Gradient Animé Fonctionnel
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { useTextSimplifier } from './hooks/useTextSimplifier';
import { usePdfExtractor } from './hooks/usePdfExtractor';
import { useTextSelection } from './hooks/useTextSelection';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { useFocusLine } from './hooks/useFocusLine';
import { useTextSettings } from './hooks/useTextSettings';
import { useLanguage } from './hooks/useLanguage';

export default function App() {
  const { language, t, toggleLanguage } = useLanguage();

  const { text, setText, simplified, simplifyLoading, simplifyText } = useTextSimplifier();
  const { loading: pdfLoading, fileInputRef, extractPdf } = usePdfExtractor(setText);
  const { grabSelectedText } = useTextSelection(setText);
  const { isSpeaking, toggleSpeech } = useTextToSpeech();
  const { focusLineEnabled, currentLine, toggleFocusLine, setLine } = useFocusLine();
  const { fontFamily, setFontFamily, fontSize, setFontSize } = useTextSettings();

  const handleCopy = () => {
    navigator.clipboard.writeText(simplified);
  };

  const handleToggleSpeech = () => {
    toggleSpeech(simplified);
  };

  const textSettings = {
    fontFamily,
    fontSize,
    onFontFamilyChange: setFontFamily,
    onFontSizeChange: setFontSize
  };

  const speechControl = {
    isSpeaking,
    onToggleSpeech: handleToggleSpeech
  };

  const focusControl = {
    focusLineEnabled,
    currentLine,
    onToggleFocus: toggleFocusLine,
    onLineClick: setLine
  };

  return (
    <div>
      <div className='wave'></div>
      <div className='wave'></div>
      <div className='wave'></div>
      <div className="p-4">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        
        <InputSection
          text={text}
          loading={pdfLoading}
          simplifyLoading={simplifyLoading}
          fileInputRef={fileInputRef}
          onTextChange={setText}
          onGrabText={grabSelectedText}
          onPdfUpload={extractPdf}
          onSimplify={simplifyText}
          t={t.input}
        />

        <OutputSection
          simplified={simplified}
          textSettings={textSettings}
          speechControl={speechControl}
          focusControl={focusControl}
          onCopy={handleCopy}
          t={t.output}
        />
      </div>
    </div>
  );
}