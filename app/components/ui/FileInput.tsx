"use client";

import { useRef, useState } from 'react';

interface FileInputProps {
  accept?: string;
  multiple?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  buttonGradient?: string;
  colors: { input: string; text: string; textSecondary: string };
  selectFileText: string;
  noFileSelectedText: string;
}

export default function FileInput({ 
  accept, 
  multiple = false, 
  onChange, 
  className = '', 
  buttonGradient = 'from-blue-500 to-purple-600',
  colors,
  selectFileText,
  noFileSelectedText
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple) {
        setSelectedFileName(`${files.length} files selected`);
      } else {
        setSelectedFileName(files[0].name);
      }
    } else {
      setSelectedFileName('');
    }
    onChange(e);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border ${colors.input} cursor-pointer hover:opacity-90 transition-opacity ${className}`}
      >
        <div className={`px-4 py-2 rounded-xl bg-linear-to-r ${buttonGradient} text-white cursor-pointer`}>
          {selectFileText}
        </div>
        <span className={`flex-1 truncate ${selectedFileName ? colors.text : colors.textSecondary}`}>
          {selectedFileName || noFileSelectedText}
        </span>
      </div>
    </div>
  );
}
