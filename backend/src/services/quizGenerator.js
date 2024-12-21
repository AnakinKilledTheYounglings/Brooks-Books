// backend/src/services/quizGenerator.js

import { translateWord } from './translation.js';


/**
 * Generates multiple choice questions from vocabulary words
 */

// Add at the top of your file with other constants

const PART_OF_SPEECH_PATTERNS = {
  noun: {
    templates: [
      'A person who [word]',
      'A thing that [word]',
      'The state of being [word]',
      'A place where [word]',
      'The quality of [word]'
    ],
    common_endings: ['ness', 'tion', 'ment', 'ity', 'er', 'or', 'ist'],
    option_formats: [
      'Someone who deals with [word]',
      'The process of [word]',
      'A collection of [word]',
      'A type of [word]'
    ]
  },
  verb: {
    templates: [
      'To [word] something',
      'The action of [word]ing',
      'When someone [word]s',
      'To actively [word]',
      'The process of [word]ing'
    ],
    common_endings: ['ate', 'ize', 'ify', 'en', 'ing', 'ed'],
    option_formats: [
      'To begin [word]ing',
      'Having [word]ed',
      'Will [word]',
      'Currently [word]ing'
    ]
  },
  adjective: {
    templates: [
      'Being [word]',
      'Having the quality of [word]',
      'Characterized by [word]',
      'In a [word] way',
      'Showing [word]ness'
    ],
    common_endings: ['able', 'ible', 'ful', 'ous', 'ive', 'ic', 'al'],
    option_formats: [
      'Full of [word]',
      'Somewhat [word]',
      'Very [word]',
      'Almost [word]'
    ]
  },
  adverb: {
    templates: [
      'In a [word] manner',
      'With [word]ness',
      'By doing it [word]ly',
      'Through [word] means'
    ],
    common_endings: ['ly', 'ward', 'wise'],
    option_formats: [
      'In a way that is [word]',
      'While being [word]',
      'By means of [word]',
      'Through [word] action'
    ]
  }
};



/**
 * Generates smart multiple choice options using various methods
 */
/**
 * Enhanced option generation combining multiple methods
 */
const generateSmartOptions = async (word, ageGroup = '9-12') => {
  const options = new Set();
  const settings = AGE_DIFFICULTY_MAPPINGS[ageGroup];
  const correctAnswer = word.etymology?.meaning;
  options.add(correctAnswer);

  try {
    // Determine likely part of speech based on word endings
    const partOfSpeech = determinePartOfSpeech(word.word);

    // Add part of speech specific options
    if (partOfSpeech && PART_OF_SPEECH_PATTERNS[partOfSpeech]) {
      const posPatterns = PART_OF_SPEECH_PATTERNS[partOfSpeech];
      
      // Add age-appropriate options based on part of speech
      if (settings.optionComplexity === 'basic') {
        // Simple options for young readers
        options.add(posPatterns.templates[0].replace('[word]', word.word));
      } else {
        // More complex options for older readers
        posPatterns.option_formats.forEach(format => {
          options.add(format.replace('[word]', word.word));
        });
      }
    }

    // Add existing option types
    if (settings.patterns.includes('basic')) {
      const familyOptions = generateWordFamilyOptions(word.word);
      familyOptions.forEach(option => options.add(option));
    }

    if (settings.useContext && word.context?.passage) {
      const contextOptions = generateContextClueOptions(
        word.context.passage,
        word.word,
        settings.optionComplexity
      );
      contextOptions.forEach(option => options.add(option));
    }

    if (word.etymology?.root && settings.patterns.includes('advanced')) {
      const rootOptions = generateRootBasedOptions(word.etymology);
      rootOptions.forEach(option => options.add(option));
    }

  } catch (error) {
    console.error('Error generating options:', error);
  }

  let finalOptions = Array.from(options);
  
  // Ensure we have enough age-appropriate options
  while (finalOptions.length < settings.maxOptions) {
    const simpleOption = generateSimpleOption(word.word, settings.optionComplexity);
    if (!finalOptions.includes(simpleOption)) {
      finalOptions.push(simpleOption);
    }
  }

  return shuffleArray(finalOptions.slice(0, settings.maxOptions));
};

// Helper function to determine part of speech
const determinePartOfSpeech = (word) => {
  word = word.toLowerCase();
  
  // Check common endings to guess part of speech
  for (const [pos, patterns] of Object.entries(PART_OF_SPEECH_PATTERNS)) {
    if (patterns.common_endings.some(ending => word.endsWith(ending))) {
      return pos;
    }
  }

  // Default checks
  if (word.endsWith('ly')) return 'adverb';
  if (word.endsWith('ing') || word.endsWith('ed')) return 'verb';
  if (word.endsWith('ful') || word.endsWith('ous')) return 'adjective';
  
  // Default to noun if unsure
  return 'noun';
};

/**
 * Generates options based on word families and common patterns
 */
const generateWordFamilyOptions = (word) => {
  const options = new Set();
  
  // Common prefixes and their meanings
  const prefixes = {
    'un': 'not',
    're': 'again',
    'dis': 'opposite of',
    'pre': 'before',
    'post': 'after',
    'mis': 'wrongly'
  };

  // Common suffixes and their meanings
  const suffixes = {
    'ing': 'action of',
    'ed': 'past state of',
    'able': 'capable of being',
    'ful': 'full of',
    'less': 'without',
    'ness': 'state of being'
  };

  // Check for prefixes
  for (const [prefix, meaning] of Object.entries(prefixes)) {
    if (word.startsWith(prefix)) {
      const root = word.slice(prefix.length);
      options.add(`${meaning} ${root}`);
      options.add(`opposite of ${root}`);
    }
  }

  // Check for suffixes
  for (const [suffix, meaning] of Object.entries(suffixes)) {
    if (word.endsWith(suffix)) {
      const root = word.slice(0, -suffix.length);
      options.add(`${meaning} ${root}`);
      options.add(`relating to ${root}`);
    }
  }

  return Array.from(options);
};

/**
 * Generates options based on context clues
 */
const generateContextClueOptions = (passage, word) => {
  const options = new Set();
  
  // Split passage into sentences
  const sentences = passage.split(/[.!?]+/);
  
  // Find the sentence containing our word
  const targetSentence = sentences.find(s => s.toLowerCase().includes(word.toLowerCase()));
  
  if (targetSentence) {
    // Get important words from the sentence
    const words = targetSentence
      .toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 4 && w !== word.toLowerCase());
    
    // Generate options based on context
    words.forEach(contextWord => {
      options.add(`Related to ${contextWord}`);
      options.add(`Similar to ${contextWord}`);
    });

    // Add some contextual phrases
    options.add(`As shown in the passage`);
    options.add(`Based on the surrounding words`);
  }

  return Array.from(options);
};

/**
 * Generates options based on etymology and root words
 */
const generateRootBasedOptions = (etymology) => {
  const options = new Set();
  
  if (etymology.root) {
    options.add(`From ${etymology.originLanguage} root meaning "${etymology.root}"`);
    
    // If we have evolution data, use it
    if (etymology.evolution) {
      etymology.evolution.forEach(stage => {
        options.add(`Originally meant "${stage.form}" in ${stage.period}`);
      });
    }
  }

  return Array.from(options);
};

// backend/src/services/quizGenerator.js

// Add age-based difficulty configurations
const AGE_DIFFICULTY_MAPPINGS = {
  '5-8': {
    maxWordLength: 6,
    useContext: false,
    optionComplexity: 'basic',
    maxOptions: 3,
    patterns: ['basic']
  },
  '9-12': {
    maxWordLength: 8,
    useContext: true,
    optionComplexity: 'moderate',
    maxOptions: 4,
    patterns: ['basic', 'intermediate']
  },
  '13-15': {
    maxWordLength: 12,
    useContext: true,
    optionComplexity: 'advanced',
    maxOptions: 4,
    patterns: ['basic', 'intermediate', 'advanced']
  },
  '16+': {
    maxWordLength: null, // no limit
    useContext: true,
    optionComplexity: 'expert',
    maxOptions: 4,
    patterns: ['all']
  }
};

// Enhanced word patterns by complexity
const WORD_PATTERNS = {
  basic: {
    prefixes: {
      'un': 'not',
      're': 'again',
      'in': 'not'
    },
    suffixes: {
      'ing': 'doing',
      'ed': 'done',
      'er': 'person who'
    }
  },
  intermediate: {
    prefixes: {
      'dis': 'opposite of',
      'pre': 'before',
      'post': 'after',
      'mis': 'wrongly',
      'non': 'not'
    },
    suffixes: {
      'able': 'can be',
      'ful': 'full of',
      'less': 'without',
      'ness': 'state of'
    }
  },
  advanced: {
    prefixes: {
      'anti': 'against',
      'inter': 'between',
      'trans': 'across',
      'sub': 'under',
      'super': 'above'
    },
    suffixes: {
      'ology': 'study of',
      'ation': 'process of',
      'esque': 'in the style of',
      'ify': 'to make'
    }
  },
  expert: {
    prefixes: {
      'pseudo': 'false',
      'meta': 'beyond',
      'crypto': 'hidden',
      'proto': 'first'
    },
    suffixes: {
      'itis': 'inflammation',
      'phobia': 'fear of',
      'centric': 'centered on',
      'archy': 'rule by'
    }
  }
};

/**
 * Generate questions based on age group
 */
export const generateQuestions = async (vocabularyWords, ageGroup = '9-12') => {
  const questions = [];
  const settings = AGE_DIFFICULTY_MAPPINGS[ageGroup];

  for (const word of vocabularyWords) {
    // Skip words that are too long for the age group
    if (settings.maxWordLength && word.word.length > settings.maxWordLength) {
      continue;
    }

    // Create consistent answer options
    const correctAnswer = word.etymology?.meaning || "No definition available";
    const options = [
      correctAnswer,
      `Related to ${word.word}`,
      `The opposite of ${word.word}`,
      `Similar to ${word.word}`
    ];

    // Context-based question
    if (settings.useContext && word.context?.passage) {
      questions.push({
        type: 'context',
        question: `In the passage: "${word.context.passage}", what does the word "${word.word}" mean?`,
        correctAnswer: correctAnswer,
        options: shuffleArray(options),
        wordId: word._id,
        context: word.context.passage,
        difficulty: calculateDifficultyForAge(word, ageGroup)
      });
    }

    // Etymology-based question for advanced age groups
    if (word.etymology?.root && settings.patterns.includes('advanced')) {
      const etymologyOptions = [
        word.etymology.meaning,
        `The opposite of ${word.etymology.meaning}`,
        `Similar to ${word.word}`,
        `Unrelated to ${word.etymology.root}`
      ];
      
      questions.push({
        type: 'etymology',
        question: `The word "${word.word}" comes from ${word.etymology.originLanguage} "${word.etymology.root}". What does it mean?`,
        correctAnswer: word.etymology.meaning,
        options: shuffleArray(etymologyOptions),
        wordId: word._id,
        difficulty: calculateDifficultyForAge(word, ageGroup)
      });
    }

    // Basic definition question
    const definitionOptions = [
      correctAnswer,
      `The process of ${word.word}ing`,
      `Someone who ${word.word}s`,
      `The state of being ${word.word}`
    ];

    questions.push({
      type: 'definition',
      question: `What is the meaning of the word "${word.word}"?`,
      correctAnswer: correctAnswer,
      options: shuffleArray(definitionOptions),
      wordId: word._id,
      difficulty: calculateDifficultyForAge(word, ageGroup)
    });
  }

  return shuffleArray(questions);
};


/**
 * Generate age-appropriate options
 */
const generateAgeAppropriateOptions = async (word, settings) => {
  const options = new Set();
  const correctAnswer = word.etymology?.meaning;
  options.add(correctAnswer);

  // Add options based on allowed patterns
  settings.patterns.forEach(patternLevel => {
    if (WORD_PATTERNS[patternLevel]) {
      const patternOptions = generatePatternBasedOptions(
        word.word, 
        WORD_PATTERNS[patternLevel]
      );
      patternOptions.forEach(option => options.add(option));
    }
  });

  // Add context-based options if appropriate for age
  if (settings.useContext && word.context?.passage) {
    const contextOptions = generateSimplifiedContextOptions(
      word.context.passage,
      word.word,
      settings.optionComplexity
    );
    contextOptions.forEach(option => options.add(option));
  }

  let finalOptions = Array.from(options);
  
  // Ensure age-appropriate number of options
  while (finalOptions.length < settings.maxOptions) {
    const simpleOption = generateSimpleOption(word.word, settings.optionComplexity);
    if (!finalOptions.includes(simpleOption)) {
      finalOptions.push(simpleOption);
    }
  }

  return shuffleArray(finalOptions.slice(0, settings.maxOptions));
};

/**
 * Generate simplified context options based on complexity level
 */
const generateSimplifiedContextOptions = (passage, word, complexity) => {
  const options = new Set();
  
  switch (complexity) {
    case 'basic':
      options.add(`Like a ${word}`);
      options.add(`Not a ${word}`);
      break;
    case 'moderate':
      options.add(`Similar to ${word}`);
      options.add(`Different from ${word}`);
      options.add(`Related to ${word}`);
      break;
    case 'advanced':
      // Add more complex options...
      break;
    case 'expert':
      // Add expert-level options...
      break;
  }

  return Array.from(options);
};

/**
 * Generate a simple option based on complexity level
 */
const generateSimpleOption = (word, complexity) => {
  switch (complexity) {
    case 'basic':
      return `Not ${word}`;
    case 'moderate':
      return `Similar to ${word}`;
    case 'advanced':
      return `Relating to the concept of ${word}`;
    case 'expert':
      return `Pertaining to the theoretical aspects of ${word}`;
    default:
      return `Alternative to ${word}`;
  }
};

/**
 * Calculate difficulty specifically for age group
 */
const calculateDifficultyForAge = (word, ageGroup) => {
  // Base difficulty on word length and complexity
  const wordLength = word.word.length;
  const hasContext = !!word.context?.passage;
  const hasEtymology = !!word.etymology?.root;

  switch (ageGroup) {
    case '5-8':
      return wordLength <= 5 ? 'easy' : 'medium';
    case '9-12':
      return wordLength <= 7 ? 'easy' : hasContext ? 'medium' : 'hard';
    case '13-15':
      return hasEtymology ? 'hard' : hasContext ? 'medium' : 'easy';
    case '16+':
      return hasEtymology && hasContext ? 'hard' : 'medium';
    default:
      return 'medium';
  }
};

// Keep existing utility functions...




/**
 * Helper function to create a basic sentence structure
 */
const generateSentenceOption = (word, type) => {
  const sentenceTemplates = [
    `Something that is ${word}`,
    `The act of being ${word}`,
    `Related to ${word}`,
    `Similar to ${word}`,
    `The opposite of ${word}`
  ];

  return sentenceTemplates[Math.floor(Math.random() * sentenceTemplates.length)];
};

/**
 * Generates options based on the context
 */
const generateContextualOptions = (passage, word) => {
  const options = [];
  
  // Split passage into words
  const words = passage.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  
  // Find words that appear near the target word
  const wordIndex = words.indexOf(word.toLowerCase());
  if (wordIndex !== -1) {
    // Get words before and after
    const nearbyWords = [
      ...words.slice(Math.max(0, wordIndex - 3), wordIndex),
      ...words.slice(wordIndex + 1, wordIndex + 4)
    ];
    
    // Use nearby words to generate related meanings
    options.push(...nearbyWords.map(w => `Related to "${w}"`));
  }

  return options;
};

/**
 * Generates options based on word patterns
 */
const generatePatternBasedOptions = (word) => {
  const options = [];
  
  // Add options based on common word patterns
  if (word.endsWith('ing')) {
    options.push(`Action of ${word.slice(0, -3)}`);
  }
  if (word.endsWith('ed')) {
    options.push(`Past state of ${word.slice(0, -2)}`);
  }
  if (word.startsWith('un')) {
    options.push(`Opposite of ${word.slice(2)}`);
  }

  return options;
};

/**
 * Calculates question difficulty based on word properties
 */
const calculateDifficulty = (word) => {
  let difficulty = 'medium';
  
  if (word.etymology?.evolution?.length > 2) {
    difficulty = 'hard';
  }
  if (word.word.length < 5 && !word.etymology?.root) {
    difficulty = 'easy';
  }
  
  return difficulty;
};



/**
 * Shuffles array elements
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};