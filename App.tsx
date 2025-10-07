import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { VideoInput } from './components/VideoInput';
import { GlossaryManager } from './components/GlossaryManager';
import { TranslationWorkspace } from './components/TranslationWorkspace';
import { translateText, extractTranscript } from './services/geminiService';
import { extractAudio } from './services/audioExtractor';
import { GlossaryEntry } from './types';

type ExtractionStatus = 'idle' | 'extracting' | 'transcribing';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [englishTranscript, setEnglishTranscript] = useState<string>('');
  const [vietnameseSubtitles, setVietnameseSubtitles] = useState<string>('');
  const [glossary, setGlossary] = useState<GlossaryEntry[]>([
    { id: '1', english: 'Pot odds', vietnamese: 'Tỷ lệ pot' },
    { id: '2', english: 'Check-raise', vietnamese: 'Check-tố' },
    { id: '3', english: 'Implied odds', vietnamese: 'Tỷ lệ ẩn' },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleVideoUpload = (file: File) => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setEnglishTranscript('');
    setVietnameseSubtitles('');
    setError(null);
  };

  const handleAddGlossaryEntry = (entry: Omit<GlossaryEntry, 'id'>) => {
    if (entry.english.trim() && entry.vietnamese.trim()) {
      const newEntry: GlossaryEntry = {
        ...entry,
        id: new Date().toISOString(),
      };
      setGlossary(prev => [...prev, newEntry]);
    }
  };

  const handleDeleteGlossaryEntry = (id: string) => {
    setGlossary(prev => prev.filter(entry => entry.id !== id));
  };

  const handleExtractTranscript = useCallback(async () => {
    if (!videoFile) {
        setError('Please upload a video file first.');
        return;
    }
    setError(null);
    setEnglishTranscript('');

    try {
        setExtractionStatus('extracting');
        const audioFile = await extractAudio(videoFile);
        
        setExtractionStatus('transcribing');
        const transcript = await extractTranscript(audioFile);
        setEnglishTranscript(transcript);
    } catch (err) {
        setError('An error occurred during transcript extraction. Please check the console for details.');
        console.error(err);
    } finally {
        setExtractionStatus('idle');
    }
  }, [videoFile]);

  const handleTranslate = useCallback(async () => {
    if (!englishTranscript.trim()) {
      setError('Please enter the English transcript to translate.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setVietnameseSubtitles('');

    try {
      const translation = await translateText(englishTranscript, glossary);
      setVietnameseSubtitles(translation);
    } catch (err)
 {
      setError('An error occurred during translation. Please check the console for details.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [englishTranscript, glossary]);

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-text">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <VideoInput
              onVideoUpload={handleVideoUpload}
              videoUrl={videoUrl}
              videoFile={videoFile}
              onExtract={handleExtractTranscript}
              extractionStatus={extractionStatus}
            />
            <GlossaryManager
              glossary={glossary}
              onAddEntry={handleAddGlossaryEntry}
              onDeleteEntry={handleDeleteGlossaryEntry}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8">
            <TranslationWorkspace
              englishTranscript={englishTranscript}
              onTranscriptChange={setEnglishTranscript}
              vietnameseSubtitles={vietnameseSubtitles}
              onTranslate={handleTranslate}
              isLoading={isLoading}
              isExtracting={extractionStatus !== 'idle'}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;