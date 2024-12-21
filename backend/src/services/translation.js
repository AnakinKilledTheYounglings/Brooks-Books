// backend/src/services/translation.js
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
//alternative import option
//import { Translate } from '@google-cloud/translate';

const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

export async function translateWord(word, targetLanguage) {
  try {
    const validLanguages = ['es', 'fr', 'pt', 'it', 'hi', 'zh'];
    
    if (!validLanguages.includes(targetLanguage)) {
      throw new Error(`Unsupported language code: ${targetLanguage}`);
    }

    // Special handling for Chinese to ensure simplified characters
    const options = targetLanguage === 'zh' ? { to: 'zh-CN' } : { to: targetLanguage };
    
    const [translation] = await translate.translate(word, options);
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

export async function translateBatch(words, targetLanguages = ['es', 'fr', 'pt', 'it', 'hi', 'zh']) {
  try {
    const results = {};
    for (const word of words) {
      results[word] = {};
      for (const lang of targetLanguages) {
        const translation = await translateWord(word, lang);
        results[word][lang] = translation;
      }
    }
    return results;
  } catch (error) {
    console.error('Batch translation error:', error);
    throw error;
  }
}

// Add to vocabulary upload route:
// export async function translateBatch(words, targetLanguages = ['es', 'fr']) {
//   try {
//     const results = {};
//     for (const word of words) {
//       results[word] = {};
//       for (const lang of targetLanguages) {
//         const [translation] = await translate.translate(word, lang);
//         results[word][lang] = translation;
//       }
//     }
//     return results;
//   } catch (error) {
//     console.error('Batch translation error:', error);
//     throw error;
//   }
// }