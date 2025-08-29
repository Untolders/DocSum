import React, { useState } from 'react';
import { Copy, Download, Clock, Key, Lightbulb, Check, Wrench } from 'lucide-react';
import { Summary, SummaryLength } from '../types';
import { calculateReadingTime } from '../utils/summarization';

interface SummaryDisplayProps {
  summary: Summary;
  originalText: string;
  fileName: string;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, originalText, fileName }) => {
  const [selectedLength, setSelectedLength] = useState<SummaryLength>('medium');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const currentSummary = summary[selectedLength];
  const readingTime = calculateReadingTime(currentSummary);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const downloadSummary = () => {
    const content = `
Document Summary: ${fileName}
Generated on: ${new Date().toLocaleString()}

--- SUMMARY (${selectedLength.toUpperCase()}) ---
${currentSummary}

--- KEY POINTS ---
${summary.keyPoints.map((p) => `- ${p}`).join("\n")}

--- MAIN IDEAS ---
${summary.mainIdeas.map((i) => `- ${i}`).join("\n")}

--- IMPROVEMENTS ---
${summary.improvements.map((s) => `- ${s}`).join("\n")}
`.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border text-gray-500 hover:text-blue-600 hover:scale-105"
      title={`Copy ${field}`}
    >
      {copiedField === field ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* --- Main Summary Card --- */}
      <div className="bg-white rounded-xl shadow-lg border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Document Summary</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 shrink-0">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
            <button
              onClick={downloadSummary}
              className="ml-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="Download full summary"
            >
              <Download className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(['short', 'medium', 'long'] as SummaryLength[]).map((length) => (
            <button
              key={length}
              onClick={() => setSelectedLength(length)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize text-sm sm:text-base ${
                selectedLength === length
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {length}
            </button>
          ))}
        </div>

        <div className="relative group">
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border-l-4 border-blue-600 min-h-[150px]">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {currentSummary}
            </p>
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={currentSummary} field="summary" />
          </div>
        </div>
      </div>

      {/* --- Responsive Grid for Key Points & Main Ideas --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* --- Key Points Card --- */}
        <div className="bg-white rounded-xl shadow-lg border p-4 sm:p-6 relative group">
          <div className="flex items-center space-x-3 mb-4">
            <Key className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Key Points</h3>
          </div>
          <div className="space-y-3">
            {summary.keyPoints.map((point, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium ring-4 ring-blue-50">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed pt-0.5">{point}</p>
              </div>
            ))}
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={summary.keyPoints.join('\n')} field="keyPoints" />
          </div>
        </div>

        {/* --- Main Ideas Card --- */}
        <div className="bg-white rounded-xl shadow-lg border p-4 sm:p-6 relative group">
          <div className="flex items-center space-x-3 mb-4">
            <Lightbulb className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">Main Ideas</h3>
          </div>
          <div className="space-y-4">
            {summary.mainIdeas.map((idea, index) => (
              <div key={index} className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-gray-800 leading-relaxed">{idea}</p>
              </div>
            ))}
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={summary.mainIdeas.join('\n')} field="mainIdeas" />
          </div>
        </div>
      </div>

      {/* --- Improvements Card --- */}
      <div className="bg-white rounded-xl shadow-lg border p-4 sm:p-6 relative group">
        <div className="flex items-center space-x-3 mb-4">
          <Wrench className="h-6 w-6 text-orange-600" />
          <h3 className="text-xl font-bold text-gray-900">Improvement Suggestions</h3>
        </div>
        <div className="space-y-3">
          {summary.improvements && summary.improvements.length > 0 ? (
            summary.improvements.map((sugg, index) => (
              <div key={index} className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-gray-800 leading-relaxed">{sugg}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No improvement suggestions available.</p>
          )}
        </div>
        {summary.improvements && summary.improvements.length > 0 && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={summary.improvements.join('\n')} field="improvements" />
          </div>
        )}
      </div>
      
      {/* Animated "Copied!" Toast Notification */}
      <div
        className={`fixed bottom-10 right-10 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-xl transition-all duration-300 ${
          copiedField ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Check />
        <span>Copied {copiedField}!</span>
      </div>
    </div>
  );
};
