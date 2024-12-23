import React from 'react';
import { Card } from './ui/card';
import { History, BookOpen, Languages } from 'lucide-react';

const EtymologyTree = ({ etymologyData }) => {
  if (!etymologyData) return null;

  const getTimelineDot = (index, total) => {
    const baseColor = 'bg-amber-600';
    const baseSize = 'w-4 h-4';
    return (
      <div className="relative">
        <div className={`rounded-full ${baseColor} ${baseSize} z-10 relative`} />
        {index < total - 1 && (
          <div className="absolute top-2 left-2 w-0.5 h-16 bg-amber-300 -z-10" />
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-6 h-6 text-amber-700" />
          <h3 className="text-2xl font-bold text-amber-900">
            Word Evolution: {etymologyData.word}
          </h3>
        </div>

        {/* Proto-Indo-European Root Section */}
        {etymologyData.pie && (
          <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <h4 className="text-lg font-semibold text-amber-800">Proto-Indo-European Root</h4>
            </div>
            <div className="pl-7">
              <p className="text-amber-900">Root: {etymologyData.pie.root}</p>
              <p className="text-amber-700">Meaning: {etymologyData.pie.meaning}</p>
            </div>
          </div>
        )}

        {/* Timeline Evolution */}
        <div className="relative pl-8 space-y-8">
          {etymologyData.evolution?.map((stage, index) => (
            <div key={index} className="flex gap-4">
              {getTimelineDot(index, etymologyData.evolution.length)}
              <div className="flex-1">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-amber-900">{stage.period}</h4>
                    <span className="text-sm text-amber-600">{stage.years}</span>
                  </div>
                  <p className="text-amber-800">{stage.form}</p>
                  {stage.changes && (
                    <p className="text-sm text-amber-600 mt-1">
                      Changes: {stage.changes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Related Words in Modern Languages */}
        {etymologyData.modernCognates && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="w-5 h-5 text-amber-700" />
              <h4 className="text-lg font-semibold text-amber-800">Related Words in Modern Languages</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(etymologyData.modernCognates).map(([language, word]) => (
                <div key={language} className="bg-white p-3 rounded-lg border border-amber-100">
                  <div className="text-sm text-amber-600">{language}</div>
                  <div className="font-medium text-amber-900">{word}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Semantic Development */}
        {etymologyData.semanticDevelopment && (
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-lg font-semibold text-amber-800 mb-2">Meaning Development</h4>
            <ul className="space-y-2">
              {etymologyData.semanticDevelopment.map((development, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-600">→</span>
                  <span className="text-amber-800">{development}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EtymologyTree;