import { FontSettings } from './FontSettings';
import { ControlButtons } from './ControlButtons';
import { SimplifiedTextOutput } from './SimplifiedTextOutput';
import type { Translations } from '../types/translations';

interface TextSettings {
  fontFamily: string;
  fontSize: number;
  onFontFamilyChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
}

interface SpeechControl {
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

interface FocusControl {
  focusLineEnabled: boolean;
  currentLine: number;
  onToggleFocus: () => void;
  onLineClick: (index: number) => void;
}

interface OutputSectionProps {
  simplified: string;
  textSettings: TextSettings;
  speechControl: SpeechControl;
  focusControl: FocusControl;
  onCopy: () => void;
  t: Translations['output'];
}

export function OutputSection({
  simplified,
  textSettings,
  speechControl,
  focusControl,
  onCopy,
  t
}: OutputSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100">
      <FontSettings
        fontFamily={textSettings.fontFamily}
        fontSize={textSettings.fontSize}
        onFontFamilyChange={textSettings.onFontFamilyChange}
        onFontSizeChange={textSettings.onFontSizeChange}
        fontLabel={t.fontLabel}
        sizeLabel={t.sizeLabel}
      />
      <ControlButtons
        isSpeaking={speechControl.isSpeaking}
        focusLineEnabled={focusControl.focusLineEnabled}
        hasSimplifiedText={!!simplified}
        onToggleSpeech={speechControl.onToggleSpeech}
        onToggleFocus={focusControl.onToggleFocus}
        onCopy={onCopy}
        readLabel={t.read}
        stopLabel={t.stop}
        focusLabel={t.focus}
      />
      <SimplifiedTextOutput
        simplified={simplified}
        fontFamily={textSettings.fontFamily}
        fontSize={textSettings.fontSize}
        focusLineEnabled={focusControl.focusLineEnabled}
        currentLine={focusControl.currentLine}
        onLineClick={focusControl.onLineClick}
        resultLabel={t.result}
        placeholder={t.resultPlaceholder}
      />
    </div>
  );
}
