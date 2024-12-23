// src/utils/wordProcessing.js

import { etymologyService } from '../services/etymologyService';

import { translateWord } from '../services/translationService'; // Add this import

const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

export const getWordDetails = async (word) => {
  console.log('Starting word lookup for:', word);

  try {
    // Step 1: Get dictionary data
    console.log('Fetching dictionary data...');
    const dictResponse = await fetch(`${DICTIONARY_API_URL}${word}`);
    
    if (!dictResponse.ok) {
      console.error('Dictionary API error:', dictResponse.status);
      throw new Error('Failed to fetch from dictionary API');
    }
    
    const dictData = await dictResponse.json();
    console.log('Dictionary data received:', dictData);

    // Step 2: Get etymology analysis
    console.log('Getting etymology analysis...');
    const etymologyData = etymologyService.getLocalEtymology(word);
    console.log('Etymology data:', etymologyData);

    // Step 3: Get translations in all supported languages
    console.log('Getting translations...');
    try {
      const translations = await Promise.all([
        translateWord(word, 'es'),
        translateWord(word, 'fr'),
        translateWord(word, 'pt'),
        translateWord(word, 'it'),
        translateWord(word, 'hi'),
        translateWord(word, 'zh')
      ]);
      console.log('Translations received:', translations);

      // Combine all data
      const wordData = {
        word,
        definitions: extractDefinitions(dictData),
        partOfSpeech: extractPartOfSpeech(dictData),
        phonetics: extractPhonetics(dictData),
        etymology: etymologyData,
        translations: {
          es: translations[0],
          fr: translations[1],
          pt: translations[2],
          it: translations[3],
          hi: translations[4],
          zh: translations[5]
        }
      };

      console.log('Final word data:', wordData);
      return wordData;
    } catch (translationError) {
      console.error('Translation error:', translationError);
      // Continue with partial data if translation fails
      return {
        word,
        definitions: extractDefinitions(dictData),
        partOfSpeech: extractPartOfSpeech(dictData),
        phonetics: extractPhonetics(dictData),
        etymology: etymologyData,
        translations: {
          es: null,
          fr: null,
          pt: null,
          it: null,
          hi: null,
          zh: null
        }
      };
    }

  } catch (error) {
    console.error('Error in getWordDetails:', error);
    // Return basic word data structure even if main request fails
    return {
      word,
      definitions: [],
      partOfSpeech: [],
      phonetics: null,
      etymology: etymologyService.getLocalEtymology(word),
      translations: {
        es: null,
        fr: null,
        pt: null,
        it: null,
        hi: null,
        zh: null
      }
    };
  }
};

// Helper functions to extract dictionary data
const extractDefinitions = (dictData) => {
  if (!Array.isArray(dictData)) return [];
  
  return dictData[0]?.meanings?.flatMap(meaning => 
    meaning.definitions.map(def => ({
      definition: def.definition,
      example: def.example,
      partOfSpeech: meaning.partOfSpeech
    }))
  ) || [];
};

const extractPartOfSpeech = (dictData) => {
  if (!Array.isArray(dictData)) return [];
  
  return [...new Set(
    dictData[0]?.meanings?.map(meaning => meaning.partOfSpeech)
  )] || [];
};

const extractPhonetics = (dictData) => {
  if (!Array.isArray(dictData)) return null;
  
  const phoneticData = dictData[0]?.phonetics?.[0];
  return phoneticData ? {
    text: phoneticData.text,
    audio: phoneticData.audio
  } : null;
};