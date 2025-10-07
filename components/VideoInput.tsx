import React, { useRef } from 'react';
import { Loader } from './Loader';

type ExtractionStatus = 'idle' | 'extracting' | 'transcribing';

interface VideoInputProps {
  onVideoUpload: (file: File) => void;
  videoUrl: string | null;
  videoFile: File | null;
  onExtract: () => void;
  extractionStatus: ExtractionStatus;
}

export const VideoInput: React.FC<VideoInputProps> = ({ 
  onVideoUpload, 
  videoUrl,
  videoFile,
  onExtract, 
  extractionStatus 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onVideoUpload(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = `video/*`;
      fileInputRef.current.click();
    }
  };
  
  const isExtracting = extractionStatus !== 'idle';

  const getButtonText = () => {
    switch(extractionStatus) {
      case 'extracting':
        return 'Extracting Audio...';
      case 'transcribing':
        return 'Requesting Transcript...';
      default:
        return 'Extract Transcript';
    }
  };

  return (
    <div className="bg-brand-surface rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">1. Load Video</h2>
      <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {videoUrl ? (
          <video src={videoUrl} controls className="w-full h-full object-contain" />
        ) : (
          <div className="text-center text-brand-text-secondary p-4">
            <svg xmlns="http://www.w.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p>Video preview will appear here</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="space-y-3">
        <button
          onClick={handleButtonClick}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>{videoUrl ? 'Change Video' : 'Upload Video'}</span>
        </button>
        
        <p className="text-xs text-brand-text-secondary mt-3 text-center">The transcript will be extracted from the uploaded video.</p>

        <button
          onClick={onExtract}
          disabled={isExtracting || !videoFile}
          className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isExtracting ? (
            <>
              <Loader isButtonLoader={true} />
              <span>{getButtonText()}</span>
            </>
          ) : (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span>{getButtonText()}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};