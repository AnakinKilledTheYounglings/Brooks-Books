// frontend/src/components/vocabulary/Etymology.jsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { History } from 'lucide-react';

const Etymology = ({ etymologyData }) => {
  if (!etymologyData) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Etymology Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <strong>Root:</strong> {etymologyData.root}
          </div>
          <div>
            <strong>Origin:</strong> {etymologyData.originLanguage}
          </div>
          <div>
            <strong>Original Meaning:</strong> {etymologyData.meaning}
          </div>
          {etymologyData.evolution && (
            <div>
              <strong>Evolution:</strong>
              <div className="ml-4">
                {etymologyData.evolution.map((stage, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>{stage.period}:</span>
                    <span>{stage.form}</span>
                    {index < etymologyData.evolution.length - 1 && (
                      <span>→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Etymology;