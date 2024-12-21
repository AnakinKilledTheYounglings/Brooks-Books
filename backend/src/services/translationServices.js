// src/services/translationService.js
const translateWord = async (word, targetLanguage) => {
  try {
    const response = await fetch('http://localhost:3001/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word,
        targetLanguage,
      }),
    });
    
    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

export { translateWord };