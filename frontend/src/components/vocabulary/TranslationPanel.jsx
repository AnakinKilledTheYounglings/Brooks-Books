// frontend/src/components/vocabulary/TranslationPanel.jsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Globe } from 'lucide-react';

const TranslationPanel = ({ translations }) => {
  if (!translations) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Translations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(translations).map(([language, translation]) => (
            <div key={language}>
              <strong>{language.toUpperCase()}:</strong> {translation}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationPanel;