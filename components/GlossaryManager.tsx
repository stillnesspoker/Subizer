
import React, { useState } from 'react';
import { GlossaryEntry } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface GlossaryManagerProps {
  glossary: GlossaryEntry[];
  onAddEntry: (entry: Omit<GlossaryEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
}

export const GlossaryManager: React.FC<GlossaryManagerProps> = ({ glossary, onAddEntry, onDeleteEntry }) => {
  const [english, setEnglish] = useState('');
  const [vietnamese, setVietnamese] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry({ english, vietnamese });
    setEnglish('');
    setVietnamese('');
  };

  return (
    <div className="bg-brand-surface rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">2. Teach the AI</h2>
      <p className="text-sm text-brand-text-secondary mb-4">Add custom translations for specific poker terms to improve accuracy.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          placeholder="English Term"
          className="flex-1 bg-brand-surface-light border border-gray-600 rounded-md py-2 px-3 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
        <input
          type="text"
          value={vietnamese}
          onChange={(e) => setVietnamese(e.target.value)}
          placeholder="Vietnamese Translation"
          className="flex-1 bg-brand-surface-light border border-gray-600 rounded-md py-2 px-3 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
        <button type="submit" className="bg-brand-blue-dark hover:bg-brand-blue text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
          Add
        </button>
      </form>
      
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {glossary.length > 0 ? glossary.map(entry => (
          <div key={entry.id} className="flex items-center justify-between bg-brand-surface-light p-2 rounded-md">
            <div>
              <p className="font-medium text-brand-text">{entry.english}</p>
              <p className="text-sm text-brand-blue">{entry.vietnamese}</p>
            </div>
            <button onClick={() => onDeleteEntry(entry.id)} className="text-gray-500 hover:text-red-500 transition-colors p-1">
              <TrashIcon />
            </button>
          </div>
        )) : <p className="text-center text-sm text-brand-text-secondary py-4">Your custom glossary is empty.</p>}
      </div>
    </div>
  );
};
