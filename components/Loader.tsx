
import React from 'react';

interface LoaderProps {
  isButtonLoader?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ isButtonLoader = false }) => {
  if (isButtonLoader) {
    return (
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    );
  }
  
  return (
    <div className="absolute inset-0 bg-brand-surface-light bg-opacity-75 flex items-center justify-center z-10">
      <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
