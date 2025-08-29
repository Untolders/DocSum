import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
import { createWorker } from 'tesseract.js';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extractTextFromPDF = async (file: File): Promise<{ content: string; pageCount: number }> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  const pageCount = pdf.numPages;
  
  // Create OCR worker
  const worker = await createWorker('eng');
  
  try {
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      
      // First try to extract text directly from PDF
      const textContent = await page.getTextContent();
      const directText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .trim();
      
      // If direct text extraction yields little content, use OCR
      if (directText.length < 50) {
        // Render page to canvas for OCR
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Convert canvas to blob and use OCR
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), 'image/png');
        });
        
        const { data: { text } } = await worker.recognize(blob);
        fullText += `Page ${pageNum}:\n${text}\n\n`;
      } else {
        fullText += `Page ${pageNum}:\n${directText}\n\n`;
      }
    }
    
    await worker.terminate();
    
    if (!fullText.trim()) {
      throw new Error('No structured content found in PDF. The document may be empty or contain only images without text.');
    }
    
    return { content: fullText.trim(), pageCount };
  } catch (error) {
    await worker.terminate();
    throw error;
  }
};

export const extractTextFromImage = async (file: File): Promise<{ content: string; confidence: number }> => {
  const worker = await createWorker('eng');
  
  try {
    const { data: { text, confidence } } = await worker.recognize(file);
    await worker.terminate();
    
    if (!text.trim()) {
      throw new Error('No structured content found in image. The image may not contain readable text.');
    }
    
    return { content: text.trim(), confidence };
  } catch (error) {
    await worker.terminate();
    throw error;
  }
};

export const extractTextFromWord = async (file: File): Promise<{ content: string }> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value.trim()) {
      throw new Error('No structured content found in Word document. The document may be empty or contain only formatting without text.');
    }
    
    return { content: result.value.trim() };
  } catch (error) {
    if (error instanceof Error && error.message.includes('No structured content')) {
      throw error;
    }
    throw new Error('Failed to extract text from Word document. The file may be corrupted or in an unsupported format.');
  }
};

export const extractTextFromExcel = async (file: File): Promise<{ content: string; sheetCount: number }> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    let fullText = '';
    const sheetCount = workbook.SheetNames.length;
    
    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      const sheetText = XLSX.utils.sheet_to_txt(worksheet);
      
      if (sheetText.trim()) {
        fullText += `Sheet ${index + 1} (${sheetName}):\n${sheetText}\n\n`;
      }
    });
    
    if (!fullText.trim()) {
      throw new Error('No structured content found in Excel file. The spreadsheet may be empty or contain only formatting without data.');
    }
    
    return { content: fullText.trim(), sheetCount };
  } catch (error) {
    if (error instanceof Error && error.message.includes('No structured content')) {
      throw error;
    }
    throw new Error('Failed to extract text from Excel file. The file may be corrupted or in an unsupported format.');
  }
};

export const extractTextFromTxt = async (file: File): Promise<{ content: string }> => {
  try {
    const text = await file.text();
    
    if (!text.trim()) {
      throw new Error('No structured content found in text file. The file appears to be empty.');
    }
    
    return { content: text.trim() };
  } catch (error) {
    if (error instanceof Error && error.message.includes('No structured content')) {
      throw error;
    }
    throw new Error('Failed to read text file. The file may be corrupted or in an unsupported encoding.');
  }
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

export const isPDFFile = (file: File): boolean => {
  return file.type === 'application/pdf';
};

export const isWordFile = (file: File): boolean => {
  return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
         file.type === 'application/msword';
};

export const isExcelFile = (file: File): boolean => {
  return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
         file.type === 'application/vnd.ms-excel';
};

export const isTxtFile = (file: File): boolean => {
  return file.type === 'text/plain';
};

export const getSupportedFileTypes = (): string => {
  return 'PDF, Word (.docx), Excel (.xlsx), Text (.txt), and Image files';
};