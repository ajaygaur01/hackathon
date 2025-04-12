// lib/tesseract.ts
import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(imagePath: string): Promise<string> {
  console.log('Starting OCR processing for image:', imagePath);
  
  try {
    // Create worker with specific configuration for better results
    const worker = await createWorker({
      logger: progress => {
        if (progress.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.floor(progress.progress * 100)}%`);
        }
      }
    });

    // Initialize the worker and set language
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    // Optional: Set image processing parameters for better results
    // Different parameters work better for different image types
    await worker.setParameters({
      tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,;:!?-_\'"/()[]{}@#$%^&*+=<>~ ', // Characters to recognize
      tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
      tessedit_ocr_engine_mode: '3', // Legacy + LSTM engines
      preserve_interword_spaces: '1', // Preserve spaces between words
    });

    console.log('OCR worker initialized, starting recognition...');
    
    // Recognize text
    const { data: { text } } = await worker.recognize(imagePath);
    
    // Terminate worker
    await worker.terminate();
    
    console.log('OCR processing completed, extracted text length:', text.length);
    
    return text;
  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error(`OCR failed: ${error.message}`);
  }
}

// Function to preprocess image for better OCR results (can be implemented later)
async function preprocessImage(imagePath: string): Promise<string> {
  // This would use libraries like sharp to improve image quality before OCR
  // For example: grayscale conversion, contrast enhancement, noise reduction
  // Would return path to processed image
  return imagePath; // Placeholder for now
}