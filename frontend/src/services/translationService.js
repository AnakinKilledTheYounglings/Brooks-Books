// src/services/translationService.js
export const translateWord = async (word, targetLanguage) => {
  try {
    console.log(`Translating "${word}" to ${targetLanguage}...`);
    const response = await fetch('http://localhost:3001/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        word,
        targetLanguage
      })
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw error; // Rethrow to handle in the main function
  }
};