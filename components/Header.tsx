
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-surface shadow-lg">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.783 2.143a1 1 0 0 0-1.566 0L5.8 8.185a1 1 0 0 0 .783 1.67h10.834a1 1 0 0 0 .783-1.67L12.783 2.143zM4.001 10.855c-.756 0-1.45.38-1.84 1.006a2.007 2.007 0 0 0 0 2.28c.39.625 1.084 1.005 1.84 1.005h16.002c.756 0 1.45-.38 1.84-1.005a2.007 2.007 0 0 0 0-2.28c-.39-.625-1.084-1.006-1.84-1.006H4zM5.8 16.145l-5.417 6.042a1 1 0 0 0 .783 1.67h21.668a1 1 0 0 0 .783-1.67l-5.417-6.042a1 1 0 0 0-.783-.355H6.583a1 1 0 0 0-.783.355z"/>
            </svg>
            <h1 className="text-2xl font-bold text-white">Poker Subtitle Translator</h1>
        </div>
        <p className="text-sm text-brand-text-secondary hidden md:block">AI-Powered Academic Translation</p>
      </div>
    </header>
  );
};
