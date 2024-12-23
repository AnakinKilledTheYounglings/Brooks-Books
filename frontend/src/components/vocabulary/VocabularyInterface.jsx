// frontend/src/components/vocabulary/VocabularyInterface.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import vocabularyService from '../../services/vocabularyService';
import { getWordDetails } from '../../utils/wordProcessing';
import TranslationPanel from './TranslationPanel';
import EtymologyTree from '../EtymologyTree';
import Etymology from './Etymology';
import { Book, Search, Save } from 'lucide-react';
import { etymologyService } from '../../services/etymologyService';

import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Alert } from '../ui/alert';



const VocabularyInterface = ({ bookId }) => {
  const navigate = useNavigate();
  const [passage, setPassage] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [wordDetails, setWordDetails] = useState(null);
  const [savedWords, setSavedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved words for this book
  useEffect(() => {
    if (bookId) {
      loadSavedWords();
    }
  }, [bookId]);

  const loadSavedWords = async () => {
    try {
      const words = await vocabularyService.getBookVocabulary(bookId);
      setSavedWords(words);
    } catch (err) {
      setError('Failed to load vocabulary words');
      console.error(err);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText.split(' ').length === 1) {
      setSelectedWord(selectedText);
      handleWordLookup(selectedText);
    }
  };

  const handleWordLookup = async (word) => {
    setLoading(true);
    try {
      console.log('Looking up word:', word);
      const wordData = await getWordDetails(word);
      console.log('Word data received:', wordData);
      
      setWordDetails({
        word: wordData.word,
        definitions: wordData.definitions,
        etymology: wordData.etymology,
        phonetics: wordData.phonetics,
        translations: wordData.translations,
        partOfSpeech: wordData.partOfSpeech
      });
    } catch (err) {
      setError('Failed to look up word details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = async () => {
    if (!selectedWord || !wordDetails) return;

    try {
      const wordData = {
        word: selectedWord,
        bookId,
        context: {
          passage: passage,
          pageNumber: null
        },
        etymology: wordDetails.etymology,
        definitions: wordDetails.definitions,
        translations: wordDetails.translations
      };

      await vocabularyService.addVocabularyWord(wordData);
      await loadSavedWords();
      setSelectedWord('');
      setWordDetails(null);
    } catch (err) {
      setError('Failed to save word');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Vocabulary Helper</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter Book Passage
            </label>
            <Textarea
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              placeholder="Enter a passage from the book..."
              className="min-h-[200px]"
            />
          </div>

          {passage && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Words for Analysis
              </label>
              <div 
                className="p-4 border rounded-lg bg-gray-50"
                onMouseUp={handleTextSelection}
              >
                {passage}
              </div>
            </div>
          )}

          {selectedWord && wordDetails && (
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-amber-900">
                  Word Analysis: {selectedWord}
                </h3>
                <Button
                  onClick={handleSaveWord}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Word
                </Button>
              </div>

              {/* Phonetics Section */}
              {wordDetails.phonetics && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{wordDetails.phonetics.text}</p>
                  {wordDetails.phonetics.audio && (
                    <audio controls src={wordDetails.phonetics.audio} className="mt-2">
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              )}

              {/* Definitions Section */}
              {wordDetails.definitions && wordDetails.definitions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-lg">Definitions:</h4>
                  {wordDetails.definitions.map((def, index) => (
                    <div key={index} className="ml-4 p-2 bg-gray-50 rounded">
                      <p>
                        <span className="italic">{def.partOfSpeech}</span>: {def.definition}
                      </p>
                      {def.example && (
                        <p className="text-gray-600 ml-4 mt-1">
                          Example: "{def.example}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Etymology Tree */}
              {wordDetails.etymology && (
                <EtymologyTree 
                  etymologyData={{
                    word: selectedWord,
                    ...wordDetails.etymology
                  }} 
                />
              )}

              {/* Translations Section */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-lg mb-3">Translations</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(wordDetails.translations).map(([lang, translation]) => {
                    if (!translation) return null;
                    
                    const langNames = {
                      es: 'Spanish',
                      fr: 'French',
                      pt: 'Portuguese',
                      it: 'Italian',
                      hi: 'Hindi',
                      zh: 'Chinese'
                    };

                    return (
                      <div 
                        key={lang}
                        className="p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                      >
                        <div className="text-sm text-gray-500">
                          {langNames[lang]}
                        </div>
                        <div className="font-medium">
                          {translation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {savedWords.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Saved Words</h3>
          <div className="space-y-3">
            {savedWords.map((word, index) => (
              <div 
                key={index}
                className="p-3 border rounded-lg hover:bg-gray-50"
              >
                <h4 className="font-medium">{word.word}</h4>
                <p className="text-sm text-gray-600">
                  Root: {word.etymology?.root}
                </p>
                {word.context?.passage && (
                  <p className="text-sm text-gray-500 mt-1">
                    Context: "{word.context.passage}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default VocabularyInterface;