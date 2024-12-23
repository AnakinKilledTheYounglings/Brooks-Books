// frontend/src/components/ThemeToggle.js
import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ currentTheme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 focus:outline-none"
    >
      <div
        className={`absolute left-1 transform transition-transform duration-200 ${
          currentTheme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {currentTheme === 'dark' ? (
          <Moon className="w-4 h-4 text-yellow-500" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggle;