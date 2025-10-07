
import React from 'react';
import { Loader } from './Loader';

interface TranslationWorkspaceProps {
  englishTranscript: string;
  onTranscriptChange: (value: string) => void;
  vietnameseSubtitles: string;
  onTranslate: () => void;
  isLoading: boolean;
  isExtracting: boolean;
  error: string | null;
}

export const TranslationWorkspace: React.FC<TranslationWorkspaceProps> = ({
  englishTranscript,
  onTranscriptChange,
  vietnameseSubtitles,
  onTranslate,
  isLoading,
  isExtracting,
  error,
}) => {
  return (
    <div className="bg-brand-surface rounded-xl shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-white">3. Translate Subtitles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div className="relative">
          <label htmlFor="english-transcript" className="block text-sm font-medium text-brand-text-secondary mb-1">
            English Transcript
          </label>
          <textarea
            id="english-transcript"
            value={englishTranscript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Paste the English transcript here, or extract it from the video..."
            className="w-full h-full min-h-[300px] bg-brand-surface-light border border-gray-600 rounded-md p-3 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
            readOnly={isExtracting}
          />
          {isExtracting && <Loader />}
        </div>
        <div className="relative">
          <label htmlFor="vietnamese-subtitles" className="block text-sm font-medium text-brand-text-secondary mb-1">
            Vietnamese Subtitles
          </label>
          <div className="w-full h-full min-h-[300px] bg-brand-surface-light border border-gray-600 rounded-md p-3 text-brand-text relative overflow-hidden">
            {isLoading && <Loader />}
            <pre className="whitespace-pre-wrap font-sans text-sm h-full overflow-y-auto">
              {vietnameseSubtitles}
            </pre>
             {!isLoading && !vietnameseSubtitles && (
              <div className="absolute inset-0 flex items-center justify-center text-brand-text-secondary">
                Translation will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      
      <button
        onClick={onTranslate}
        disabled={isLoading || isExtracting}
        className="mt-6 w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader isButtonLoader={true} />
            <span>Translating...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Translate to Vietnamese</span>
          </>
        )}
      </button>
    </div>
  );
};
