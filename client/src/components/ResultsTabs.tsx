import React, { useState } from "react";
import { SummaryDisplay } from "./SummaryDisplay";
import { ExtractedContent } from "./ExtractedContent";
import { Summary, ExtractedText } from "../types";
import { FileText, Code, Key, Lightbulb } from "lucide-react";

type Tab = "summary" | "original" | "keyPoints" | "mainIdeas";

interface ResultsTabsProps {
  summary: Summary;
  extractedText: ExtractedText;
  fileName: string;
}

export const ResultsTabs: React.FC<ResultsTabsProps> = ({
  summary,
  extractedText,
  fileName,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  const KeyPointsTab = () => (
    <div className="bg-white rounded-xl shadow-lg border p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Key Points</h3>
      </div>
      <div className="space-y-3">
        {summary.keyPoints.map((point, index) => (
          <div key={index} className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
              {index + 1}
            </span>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {point}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const MainIdeasTab = () => (
    <div className="bg-white rounded-xl shadow-lg border p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Main Ideas</h3>
      </div>
      <div className="grid gap-3 sm:gap-4">
        {summary.mainIdeas.map((idea, index) => (
          <div
            key={index}
            className="bg-purple-50 rounded-lg p-3 sm:p-4 border-l-4 border-purple-500"
          >
            <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
              {idea}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <SummaryDisplay
            summary={summary}
            originalText={extractedText.content}
            fileName={fileName}
          />
        );
      case "original":
        return (
          <ExtractedContent extractedText={extractedText} fileName={fileName} />
        );
      case "keyPoints":
        return <KeyPointsTab />;
      case "mainIdeas":
        return <MainIdeasTab />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4">
      {/* Responsive Tab Buttons */}
      <div className="mb-4 flex overflow-x-auto no-scrollbar border-b">
        {[
          { key: "summary", label: "Summary", icon: Code },
          { key: "keyPoints", label: "Key Points", icon: Key },
          { key: "mainIdeas", label: "Main Ideas", icon: Lightbulb },
          { key: "original", label: "Original Text", icon: FileText },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as Tab)}
            className={`flex items-center flex-shrink-0 space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm md:text-base transition-colors ${
              activeTab === key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};
