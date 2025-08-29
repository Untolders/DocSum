import React, { useState } from "react";
import { Copy, Eye, EyeOff, FileText, Hash } from "lucide-react";
import { ExtractedText } from "../types";

interface ExtractedContentProps {
  extractedText: ExtractedText;
  fileName: string;
}

export const ExtractedContent: React.FC<ExtractedContentProps> = ({
  extractedText,
  fileName,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const wordCount = extractedText.content
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const charCount = extractedText.content.length;
  const previewText =
    extractedText.content.substring(0, 300) +
    (extractedText.content.length > 300 ? "..." : "");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
        {/* Title */}
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-green-600" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Extracted Content
          </h3>
        </div>

        {/* File Stats + Copy */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 text-sm text-gray-600">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="flex items-center space-x-1">
              <Hash className="h-4 w-4" />
              <span>{wordCount} words</span>
            </div>
            <div>{charCount} characters</div>
            {extractedText.pageCount && <div>{extractedText.pageCount} pages</div>}
            {extractedText.confidence && (
              <div className="flex items-center space-x-1">
                <span>OCR Confidence:</span>
                <span
                  className={`font-medium ${
                    extractedText.confidence > 90
                      ? "text-green-600"
                      : extractedText.confidence > 70
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {Math.round(extractedText.confidence)}%
                </span>
              </div>
            )}
          </div>

          <button
            onClick={copyToClipboard}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
            title="Copy extracted text"
          >
            <Copy className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Copy Notification */}
      {copied && (
        <div className="mb-4 text-green-600 text-sm text-center bg-green-50 py-2 px-3 rounded-lg">
          Extracted content copied to clipboard!
        </div>
      )}

      {/* Content Preview */}
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border overflow-x-auto">
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-mono text-xs sm:text-sm md:text-base">
            {isExpanded ? extractedText.content : previewText}
          </div>
        </div>

        {/* Expand / Collapse */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors font-medium text-sm sm:text-base"
          >
            {isExpanded ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Show Full Content</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs sm:text-sm text-gray-500 text-center break-all">
        Source: {fileName}
      </div>
    </div>
  );
};
