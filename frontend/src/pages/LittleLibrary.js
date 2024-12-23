import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Book, Heart, Users, ExternalLink } from 'lucide-react';

const LittleLibraryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-6">
              Little Free Library
            </h1>
            
            <p className="text-amber-800 mb-8">
              Join the worldwide movement of sharing books and building community through
              Little Free Library book-sharing boxes.
            </p>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <MapPin className="w-8 h-8 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  Find a Library
                </h3>
                <p className="text-amber-800">
                  Discover Little Free Libraries in your neighborhood using our map locator.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <Book className="w-8 h-8 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  Start a Library
                </h3>
                <p className="text-amber-800">
                  Learn how to start and maintain your own Little Free Library.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <Heart className="w-8 h-8 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  Support the Cause
                </h3>
                <p className="text-amber-800">
                  Donate to help build more Libraries in communities that need them.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <Users className="w-8 h-8 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  Join the Community
                </h3>
                <p className="text-amber-800">
                  Connect with other Library stewards and book lovers.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-amber-50 p-8 rounded-lg border border-amber-100 text-center">
              <h2 className="text-2xl font-semibold text-amber-900 mb-4">
                Become a Library Steward
              </h2>
              <p className="text-amber-800 mb-6">
                Ready to make a difference in your community? Start your journey to
                becoming a Little Free Library steward today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://littlefreelibrary.org/start/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white inline-flex items-center gap-2">
                    Get Started
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
                <a 
                  href="https://littlefreelibrary.org/donate/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button className="bg-green-600 hover:bg-green-700 text-white inline-flex items-center gap-2">
                    Make a Donation
                    <Heart className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-amber-900 mb-4">
                Resources & Guidelines
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">
                    Steward's Guide
                  </h3>
                  <p className="text-amber-800 mb-4">
                    Learn best practices for maintaining your Little Free Library and 
                    engaging with your community.
                  </p>
                  <a 
                    href="https://littlefreelibrary.org/stewards/"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 inline-flex items-center gap-2"
                  >
                    Read the Guide
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">
                    Success Stories
                  </h3>
                  <p className="text-amber-800 mb-4">
                    Get inspired by stories from other Library stewards and see the 
                    impact they've made in their communities.
                  </p>
                  <a 
                    href="https://littlefreelibrary.org/stories/"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 inline-flex items-center gap-2"
                  >
                    Read Success Stories
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LittleLibraryPage;