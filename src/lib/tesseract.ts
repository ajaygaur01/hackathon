import Tesseract from 'tesseract.js';
import { join } from 'path';
import { readFileSync } from 'fs';

export async function extractTextFromImage(imagePath: string) {
  const imageBuffer = readFileSync(imagePath);

  const {
    data: { text },
  } = await Tesseract.recognize(imageBuffer, 'eng', {
    logger: (m) => console.log(m),
  });

  return text;
}
