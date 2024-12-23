import React from 'react';
import { Card, CardContent } from '../components/ui/card';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-6">About Brooks'Books</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-amber-800 mb-6">
                Brooks'Books is where the magic of traditional reading meets the digital age. 
                We believe in creating spaces—both virtual and physical—where readers can connect, 
                share, and grow their love of literature.
              </p>

              <h2 className="text-2xl font-semibold text-amber-900 mt-8 mb-4">Our Mission</h2>
              <p className="text-amber-800 mb-6">
                To foster a community of engaged readers by combining the charm of traditional 
                book-sharing with modern digital tools, making literature more accessible and 
                engaging for readers of all ages.
              </p>

              <h2 className="text-2xl font-semibold text-amber-900 mt-8 mb-4">What We Do</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-amber-900 mb-3">Digital Platform</h3>
                  <p className="text-amber-800">
                    Our online platform allows readers to track their reading journey, share insights, 
                    and connect with fellow book lovers.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-amber-900 mb-3">Community Building</h3>
                  <p className="text-amber-800">
                    We support and promote Little Free Libraries, creating physical spaces for 
                    book sharing in communities.
                  </p>
                </div>
                // frontend/src/pages/About.js
                // Add this section in the appropriate place in your existing About page:
                
                <div className="prose prose-lg max-w-none">
                  {/* ... existing content ... */}
                
                  <h2 className="text-2xl font-semibold text-amber-900 mt-8 mb-4">Our Development Story</h2>
                  <p className="text-amber-800 mb-6">
                    Brooks'Books was developed through an innovative collaboration between human creativity and artificial intelligence. 
                    The site was built with the assistance of Claude, an AI that helped with everything from code development to 
                    educational features. This partnership demonstrates how AI can make web development and learning more accessible, 
                    enabling the creation of educational platforms even without extensive technical background.
                  </p>
                  
                  <p className="text-amber-800 mb-6">
                    The same AI assistance that helped build this site is available to help our users with:
                    <ul className="list-disc pl-6 mt-2">
                      <li>Learning new vocabulary and languages</li>
                      <li>Understanding complex reading materials</li>
                      <li>Developing coding skills</li>
                      <li>Writing and analysis</li>
                    </ul>
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-amber-900 mt-8 mb-4">Join Our Community</h2>
              <p className="text-amber-800">
                Whether you're a casual reader or a dedicated bibliophile, Brooks'Books offers 
                a space for you to explore, share, and celebrate the joy of reading.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;