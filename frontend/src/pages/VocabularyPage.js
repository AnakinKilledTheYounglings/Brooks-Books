// frontend/src/pages/VocabularyPage.js

import React from 'react';
import { useParams } from 'react-router-dom';
import VocabularyInterface from '../components/vocabulary/VocabularyInterface';

function VocabularyPage() {
  const { bookId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vocabulary Training</h1>
      <VocabularyInterface bookId={bookId} />
    </div>
  );
}

export default VocabularyPage;