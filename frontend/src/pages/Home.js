// frontend/src/pages/Home.js
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import treehouseImage from '../assets/treehouse-library.jpg';

function Home() {
  const { scrollY } = useScroll();
  
  // Create scroll-based transforms
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const navigationOpacity = useTransform(scrollY, [300, 500], [0, 1]);
  const navigationY = useTransform(scrollY, [300, 500], [50, 0]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background Image */}
      
      <motion.div 
        className="relative h-screen flex items-center justify-center"
        style={{
          opacity: heroOpacity,
          position: 'fixed',
          top: '64px', // Add this to start below navbar
          left: 0,
          right: 0,
          height: 'calc(100vh - 64px)', // Adjust height to account for navbar
          backgroundImage: `url(${treehouseImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-6xl md:text-8xl font-bold text-white text-center z-10"
        >
          Brooks'Books
        </motion.h1>
      </motion.div>

      {/* Navigation Section */}
      <motion.section 
        style={{ opacity: navigationOpacity, y: navigationY }}
        className="py-20 bg-gradient-to-b from-blue-900 to-blue-800 mt-screen relative z-10"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Book Gallery', path: '/books', description: 'Explore our collection and share your artwork' },
              { title: 'Discussions', path: '/discussions', description: 'Join the community in book discussions' },
              { 
                title: 'AI Assistant', 
                path: 'https://claude.ai', 
                description: 'Visit Claude AI - the assistant that helped build this site and can help with reading, coding, and learning',
                external: true 
              },
              { title: 'Little Free Library', path: '/little-library', description: 'Find and share books in your community' },
              { title: 'About Us', path: '/about', description: 'Learn more about Brooks\'Books' },
              { title: 'Contact', path: '/contact', description: 'Get in touch with us' }
            ].map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {item.external ? (
                  <a 
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 rounded-lg bg-white/10 backdrop-blur-sm 
                              hover:bg-white/20 transition-all duration-300
                              transform hover:-translate-y-1"
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
                    <p className="text-blue-100">{item.description}</p>
                  </a>
                ) : (
                  <Link 
                    to={item.path}
                    className="block p-6 rounded-lg bg-white/10 backdrop-blur-sm 
                              hover:bg-white/20 transition-all duration-300
                              transform hover:-translate-y-1"
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
                    <p className="text-blue-100">{item.description}</p>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Add some padding at the bottom to ensure smooth scrolling */}
      <div className="h-screen" />
    </div>
  );
}

export default Home;