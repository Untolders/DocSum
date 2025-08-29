import React, { useState } from 'react';
import { SummaryDisplay } from './SummaryDisplay';
import { ExtractedContent } from './ExtractedContent';
import { Summary, ExtractedText } from '../types';
import { FileText, Code, Key, Lightbulb } from 'lucide-react';

type Tab = 'summary' | 'original' | 'keyPoints' | 'mainIdeas' ;

interface ResultsTabsProps {
  summary: Summary;
  extractedText: ExtractedText;
  fileName: string;
}

export const ResultsTabs: React.FC<ResultsTabsProps> = ({ summary, extractedText, fileName }) => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  // New components to display Key Points and Main Ideas
  const KeyPointsTab = () => (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Key Points</h3>
      </div>
      <div className="space-y-3">
        {summary.keyPoints.map((point, index) => (
          <div key={index} className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </span>
            <p className="text-gray-700 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const MainIdeasTab = () => (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">Main Ideas</h3>
      </div>
      <div className="grid gap-4">
        {summary.mainIdeas.map((idea, index) => (
          <div key={index} className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <p className="text-gray-800 leading-relaxed">{idea}</p>
          </div>
        ))}
      </div>
    </div>
  );


  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <SummaryDisplay summary={summary} originalText={extractedText.content} fileName={fileName} />;
      case 'original':
        return <ExtractedContent extractedText={extractedText} fileName={fileName} />;
      case 'keyPoints':
        return <KeyPointsTab />;
      case 'mainIdeas':
        return <MainIdeasTab />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* --- FIX: Corrected Tab Buttons --- */}
      <div className="mb-4 flex border-b">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'summary' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <Code className="h-4 w-4" />
          <span>Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('keyPoints')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'keyPoints' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <Key className="h-4 w-4" />
          <span>Key Points</span>
        </button>

        <button
          onClick={() => setActiveTab('mainIdeas')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'mainIdeas' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          <span>Main Ideas</span>
        </button>
        
        <button
          onClick={() => setActiveTab('original')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'original' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Original Text</span>
        </button>
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
};