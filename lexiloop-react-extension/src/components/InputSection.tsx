import { TextSelectionButton } from './TextSelectionButton';
import { PdfUploadZone } from './PdfUploadZone';
import { TextInput } from './TextInput';
import { SimplifyButton } from './SimplifyButton';
import type { ChangeEvent, RefObject } from 'react';
import type { Translations } from '../types/translations';

interface InputSectionProps {
  text: string;
  loading: boolean;
  simplifyLoading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onTextChange: (text: string) => void;
  onGrabText: () => void;
  onPdfUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onSimplify: () => void;
  t: Translations['input'];
}

export function InputSection({
  text,
  loading,
  simplifyLoading,
  fileInputRef,
  onTextChange,
  onGrabText,
  onPdfUpload,
  onSimplify,
  t
}: InputSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-3 mb-3 border border-gray-100">
      <TextSelectionButton 
        onGrabText={onGrabText}
        label={t.grabText}
      />
      <PdfUploadZone 
        loading={loading}
        fileInputRef={fileInputRef}
        onUpload={onPdfUpload}
        uploadLabel={t.uploadPdf}
        uploadingLabel={t.uploading}
      />
      <TextInput 
        value={text} 
        onChange={onTextChange}
        placeholder={t.placeholder}
      />
      <SimplifyButton 
        loading={simplifyLoading}
        disabled={simplifyLoading || !text.trim()}
        onClick={onSimplify}
        label={t.simplifyButton}
        loadingLabel={t.simplifying}
      />
    </div>
  );
}