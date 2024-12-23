import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

const TreeNavigation = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [particles, setParticles] = useState([]);
  
  const navItems = [
    { path: '/about', label: 'About Us', x: 120, y: -180 },
    { path: '/contact', label: 'Contact', x: -120, y: -220 },
    { path: '/resources', label: 'Resources', x: 180, y: -260 },
    { path: '/little-library', label: 'Little Free Library', x: -180, y: -300 }
  ];

  // Create floating particles
  useEffect(() => {
    const createParticle = () => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 20,
      size: Math.random() * 3 + 1,
      duration: 8 + Math.random() * 4
    });

    setParticles(Array.from({ length: 15 }, createParticle));

    const interval = setInterval(() => {
      setParticles(prev => [...prev.slice(-14), createParticle()]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const branchVariants = {
    hover: {
      filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const mobileNavItems = navItems.map(item => ({
    ...item,
    x: 0,
    y: -navItems.indexOf(item) * 100 - 100
  }));

  const currentItems = isMobile ? mobileNavItems : navItems;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      {/* SVG Filters for glow effects */}
      <svg width="" height="0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Floating Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x,
              y: particle.y,
              opacity: 0.1
            }}
            animate={{ 
              y: -20,
              opacity: [0.1, 0.5, 0.1]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: particle.duration,
              ease: "linear"
            }}
            className="absolute rounded-full bg-blue-400"
            style={{
              width: particle.size,
              height: particle.size,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 pt-16 px-4">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-center text-blue-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ filter: 'url(#glow)' }}
        >
          Brooks'Books
        </motion.h1>

        <motion.p 
          className="text-xl text-center text-blue-300 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Explore the Future of Reading
        </motion.p>

        {/* Tree Navigation */}
        <svg 
          viewBox={isMobile ? "0 0 400 800" : "0 0 800 800"}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Central Tech Column */}
          <motion.path
            d={isMobile ? 
              "M200 750 L200 50" : 
              "M400 750 L400 50"
            }
            className="stroke-blue-500"
            strokeWidth="20"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
            style={{ filter: 'url(#glow)' }}
          />

          {/* Geometric Branches and Navigation */}
          {currentItems.map((item, index) => (
            <g key={index}>
              <motion.path
                d={isMobile ?
                  `M200 ${750 + item.y} L300 ${750 + item.y}` :
                  `M400 ${750 + item.y/2} L${400 + item.x} ${750 + item.y}`
                }
                className="stroke-blue-400"
                strokeWidth="4"
                strokeDasharray="8 4"
                fill="none"
                variants={branchVariants}
                whileHover="hover"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
                style={{ filter: 'url(#glow)' }}
              />

              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                whileHover={{ scale: 1.1 }}
              >
                <Link to={item.path}>
                  <motion.circle
                    cx={isMobile ? 300 : 400 + item.x}
                    cy={isMobile ? 750 + item.y : 750 + item.y}
                    r="30"
                    className="fill-gray-800 stroke-blue-400 stroke-2"
                    whileHover={{ 
                      scale: 1.1,
                      fill: "#1a365d",
                      stroke: "#60a5fa"
                    }}
                    style={{ filter: 'url(#glow)' }}
                  />
                  <text
                    x={isMobile ? 300 : 400 + item.x}
                    y={isMobile ? 750 + item.y : 750 + item.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-semibold fill-blue-300"
                    style={{ filter: 'url(#glow)' }}
                  >
                    {item.label}
                  </text>
                </Link>
              </motion.g>
            </g>
          ))}

          {/* Tech Nodes */}
          <motion.g
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {[100, 200, 300, 400, 500].map((y, i) => (
              <circle
                key={i}
                cx="400"
                cy={y}
                r="4"
                className="fill-blue-400"
                style={{ filter: 'url(#glow)' }}
              />
            ))}
          </motion.g>
        </svg>
      </div>
    </div>
  );
};

export default TreeNavigation;