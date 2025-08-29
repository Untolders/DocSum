import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ProcessingStatus, ProcessingStage } from './components/ProcessingStatus';
import { ResultsTabs } from './components/ResultsTabs';
import { DocumentFile, Summary, ExtractedText } from './types';
import { 
  extractTextFromPDF, 
  extractTextFromImage, 
  extractTextFromWord,
  extractTextFromExcel,
  extractTextFromTxt,
  isPDFFile, 
  isImageFile,
  isWordFile,
  isExcelFile,
  isTxtFile,
  getSupportedFileTypes
} from './utils/textExtraction';
import { generateSummary } from './utils/summarization';
import { RefreshCw, FileText, Brain } from 'lucide-react';

const initialStages: ProcessingStage[] = [
  { name: 'Extracting Text', status: 'pending', message: 'Waiting to start...' },
  { name: 'Generating Summary', status: 'pending', message: 'Waiting for text extraction...' },
  { name: 'Extracting Key Points', status: 'pending', message: 'Waiting for summary...' },
  { name: 'Identifying Main Ideas', status: 'pending', message: 'Waiting for key points...' },
  { name: 'Improvement Suggestions', status: 'pending', message: 'Waiting for main ideas...' }, 
];


function App() {
  const [currentDocument, setCurrentDocument] = useState<DocumentFile | null>(null);
  const [stages, setStages] = useState<ProcessingStage[]>(initialStages);
  const [extractedText, setExtractedText] = useState<ExtractedText | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateStage = (stageName: string, newStatus: Partial<ProcessingStage>) => {
    setStages(prevStages =>
      prevStages.map(stage =>
        stage.name === stageName ? { ...stage, ...newStatus } : stage
      )
    );
  };

  const handleFileUpload = async (documentFile: DocumentFile) => {
    setCurrentDocument(documentFile);
    setStages(initialStages);
    setExtractedText(null);
    setSummary(null);
    setError(null);

    try {
      updateStage('Extracting Text', { status: 'in-progress', message: 'Reading document content...' });
      
      let textResult: ExtractedText;
      if (isPDFFile(documentFile.file)) {
        textResult = await extractTextFromPDF(documentFile.file);
      } else if (isImageFile(documentFile.file)) {
        textResult = await extractTextFromImage(documentFile.file);
      } else if (isWordFile(documentFile.file)) {
        textResult = await extractTextFromWord(documentFile.file);
      } else if (isExcelFile(documentFile.file)) {
        const { content, sheetCount } = await extractTextFromExcel(documentFile.file);
        textResult = { content, pageCount: sheetCount };
      } else if (isTxtFile(documentFile.file)) {
        textResult = await extractTextFromTxt(documentFile.file);
      } else {
        throw new Error(`Unsupported file type. Please upload: ${getSupportedFileTypes()}`);
      }

      if (!textResult.content.trim()) {
        throw new Error('No content found in the document.');
      }
      setExtractedText(textResult);
      updateStage('Extracting Text', { status: 'complete', message: `Extracted ${textResult.content.split(/\s+/).length} words.` });

      updateStage('Generating Summary', { status: 'in-progress', message: 'Creating intelligent summary...' });
      const generatedSummary = await generateSummary(textResult.content);

      updateStage('Generating Summary', { status: 'complete', message: 'Summary generation complete.' });
      
      updateStage('Extracting Key Points', { status: 'in-progress', message: 'Pulling out key points...' });
      await new Promise(resolve => setTimeout(resolve, 200)); 
      updateStage('Extracting Key Points', { status: 'complete', message: `${generatedSummary.keyPoints.length} key points found.` });

      updateStage('Identifying Main Ideas', { status: 'in-progress', message: 'Determining main ideas...' });
      await new Promise(resolve => setTimeout(resolve, 200));
      updateStage('Identifying Main Ideas', { status: 'complete', message: `${generatedSummary.mainIdeas.length} main ideas identified.` });

       // Improvement Suggestions
      updateStage('Improvement Suggestions', { status: 'in-progress', message: 'Analyzing for improvements...' });
      await new Promise(resolve => setTimeout(resolve, 500));
      updateStage('Improvement Suggestions', { status: 'complete', message: 'Improvement suggestions ready.' });


      setSummary(generatedSummary);

    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Processing error:', err);
      setError(errorMessage);
      setStages(prevStages =>
        prevStages.map(stage =>
          stage.status === 'in-progress' 
            ? { ...stage, status: 'error', message: `Error: ${errorMessage}` } 
            : stage
        )
      );
    }
  };

  const resetApplication = () => {
    setCurrentDocument(null);
    setStages(initialStages);
    setExtractedText(null);
    setSummary(null);
    setError(null);
  };

  const isProcessing = stages.some(stage => stage.status === 'in-progress');
  const isComplete = stages.every(stage => stage.status === 'complete');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {!currentDocument ? (
            <>
              <div className="text-center py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Transform Documents into Smart Summaries
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Upload documents (PDF, Word, Excel, Text, Images) to extract content and generate intelligent summaries with AI-powered analysis. 
                  Perfect for research papers, reports, spreadsheets, and scanned documents.
                </p>
                <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 pt-12">
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Support</h3>
                  <p className="text-gray-600">
                    Extract content from PDF, Word, Excel, and text files while preserving structure.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">OCR Processing</h3>
                  <p className="text-gray-600">
                    Advanced OCR technology to extract text from scanned documents and images.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Summaries</h3>
                  <p className="text-gray-600">
                    AI-powered summarization with customizable length and key point extraction.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-8">
              <ProcessingStatus stages={stages} fileName={currentDocument.name} />

              {(isComplete || error) && (
                <div className="text-center">
                  <button
                    onClick={resetApplication}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <RefreshCw className="h-5 w-5" />
                    <span>Process Another Document</span>
                  </button>
                </div>
              )}
              
              {isComplete && summary && extractedText && (
                <ResultsTabs
                  summary={summary}
                  extractedText={extractedText}
                  fileName={currentDocument.name}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;