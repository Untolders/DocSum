import React from "react";
import { FileText, Brain } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between h-auto md:h-20 py-4 md:py-0">
          
          {/* Left Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 w-full md:w-auto mb-4 md:mb-0">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white rounded-xl shadow-lg hover:scale-105 transform transition duration-300 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="p-3 bg-white rounded-xl shadow-lg hover:scale-105 transform transition duration-300 flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Document Summary Assistant
              </h1>
              <p className="text-sm sm:text-base text-gray-200">
                AI-powered document analysis & summarization
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-center md:justify-end w-full md:w-auto">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl shadow-md hover:bg-white/30 transition duration-300 text-center md:text-right">
              <div className="text-sm sm:text-base font-semibold text-white">
                Smart Analysis
              </div>
              <div className="text-xs sm:text-sm text-gray-200">
                PDF & Image Support
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
