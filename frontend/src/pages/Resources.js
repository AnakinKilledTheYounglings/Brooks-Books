import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { ExternalLink } from 'lucide-react';

const ResourcesPage = () => {
  const resources = [
    {
      title: 'MathTricks',
      description: 'Explore mathematical concepts through engaging puzzles and games.',
      url: 'https://mathtricks.com',
      category: 'Educational Apps'
    },
    {
      title: 'Reading Tracker',
      description: 'Track your reading progress and set reading goals.',
      url: 'https://readingtracker.com',
      category: 'Reading Tools'
    },
    {
      title: 'Vocabulary Builder',
      description: 'Enhance your vocabulary through interactive exercises.',
      url: 'https://vocabularybuilder.com',
      category: 'Language Learning'
    }
  ];

  const categories = [...new Set(resources.map(r => r.category))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-6">
              Helpful Resources
            </h1>
            
            <p className="text-amber-800 mb-8">
              Discover these carefully selected resources that complement your reading journey.
              Each has been chosen to enhance your learning and reading experience.
            </p>

            {categories.map(category => (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-semibold text-amber-900 mb-4">
                  {category}
                </h2>
                
                <div className="grid gap-4">
                  {resources
                    .filter(r => r.category === category)
                    .map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block transform transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="bg-green-50 p-6 rounded-lg border border-green-100 hover:border-amber-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-amber-900">
                              {resource.title}
                            </h3>
                            <ExternalLink className="w-5 h-5 text-amber-600" />
                          </div>
                          <p className="text-amber-800 mt-2">
                            {resource.description}
                          </p>
                        </div>
                      </a>
                    ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourcesPage;