import React from 'react';
import { Loader2, CheckCircle, Circle, AlertCircle } from 'lucide-react';
// The types below were being imported from '../types' before, 
// but based on your code structure, it's better to define and export them here.

// --- FIX: Add the 'export' keyword here ---
export type StageStatus = 'pending' | 'in-progress' | 'complete' | 'error';

// --- FIX: Add the 'export' keyword here ---
export interface ProcessingStage {
  name: string;
  status: StageStatus;
  message: string;
}

interface ProcessingStatusProps {
  stages: ProcessingStage[];
  fileName: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ stages, fileName }) => {
  const getIcon = (status: StageStatus) => {
    switch (status) {
      case 'in-progress':
        return <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      case 'pending':
      default:
        return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const isComplete = stages.every(stage => stage.status === 'complete');
  const hasError = stages.some(stage => stage.status === 'error');

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border p-6">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-1">
          {isComplete && <CheckCircle className="h-6 w-6 text-green-600" />}
          {hasError && <AlertCircle className="h-6 w-6 text-red-600" />}
          <h2 className="text-xl font-bold text-gray-900">
            {isComplete ? 'Processing Complete' : hasError ? 'Processing Failed' : 'Processing Document'}
          </h2>
        </div>
        <p className="text-gray-600">File: {fileName}</p>
      </div>
      
      <div className="space-y-4">
        {stages.map((stage) => (
          <div
            key={stage.name}
            className={`p-4 rounded-lg flex items-center space-x-4 transition-all duration-300 ${
              stage.status === 'complete' ? 'bg-green-50 border border-green-200' :
              stage.status === 'in-progress' ? 'bg-blue-50 border border-blue-200' :
              stage.status === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-gray-50 border border-gray-200'
            }`}
          >
            <div>{getIcon(stage.status)}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{stage.name}</h3>
              <p className="text-sm text-gray-600">{stage.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};