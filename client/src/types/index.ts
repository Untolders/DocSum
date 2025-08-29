export interface DocumentFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface ExtractedText {
  content: string;
  pageCount?: number;
  confidence?: number;
}

export interface Summary {
  short: string;
  medium: string;
  long: string;
  keyPoints: string[];
  mainIdeas: string[];
  improvements: string[];
}

export type SummaryLength = 'short' | 'medium' | 'long';

export interface ProcessingStatus {
  stage: 'uploading' | 'extracting' | 'summarizing' | 'complete' | 'error';
  progress: number;
  message: string;
}