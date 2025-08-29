import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image } from 'lucide-react';
import { DocumentFile } from '../types';

interface FileUploadProps {
  onFileUpload: (file: DocumentFile) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isProcessing }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);

    // Handle rejected files
    if (fileRejections.length > 0) {
      const rejectedFile = fileRejections[0].file;
      setError(`File "${rejectedFile.name}" is not supported.`);
      return;
    }

    if (acceptedFiles.length > 0 && !isProcessing) {
      const file = acceptedFiles[0];
      const documentFile: DocumentFile = {
        id: Date.now().toString(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date()
      };
      onFileUpload(documentFile);
    }
  }, [onFileUpload, isProcessing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt']
    },
    multiple: false,
    disabled: isProcessing
  });

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-6 sm:space-y-8">
          <div className="flex justify-center space-x-4">
            <div className={`
              p-4 rounded-full transition-all transform
              ${isDragActive ? 'bg-blue-100 scale-110' : 'bg-gray-100 hover:scale-105'}
            `}>
              <Upload className={`h-10 w-10 ${isDragActive ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {isDragActive ? 'Drop your document here' : 'Upload Document'}
            </h3>
            <p className="text-gray-600 sm:text-base mb-4">
              Drag and drop your file here, or click to browse
            </p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-between gap-4 sm:gap-8">
            <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-500 hover:text-blue-600 transition">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>PDF & Word</span>
            </div>
            <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-500 hover:text-purple-600 transition">
              <Image className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Images & Excel</span>
            </div>
            <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-500 hover:text-green-600 transition">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Text Files</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-400">
            Maximum file size: 10MB
          </p>

          {/* Error message */}
          {error && (
            <div className="text-red-600 text-sm font-medium mt-2">
              {error}
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-2xl">
            <div className="text-blue-600 font-semibold text-lg animate-pulse">Processing...</div>
          </div>
        )}
      </div>
    </div>
  );
};
