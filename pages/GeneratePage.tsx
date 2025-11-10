

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateImage } from '../services/geminiService';

const GeneratePage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numberOfImages, setNumberOfImages] = useState(1);
  const { user, updateCredits } = useAuth();

  const isUnlimited = user && user.credits >= 99999;
  const generationCost = numberOfImages;
  const hasEnoughCredits = user && (isUnlimited || user.credits >= generationCost);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    if (!hasEnoughCredits) {
      setError(`You need ${generationCost} credits to generate ${generationCost} images.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrls([]);

    try {
      const generatedImageUrls = await generateImage(prompt, numberOfImages);
      setImageUrls(generatedImageUrls);
      if (user && !isUnlimited) {
         updateCredits(user.credits - generationCost);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageUrl: string) => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      const fileName = `${prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'generated_image'}_${Date.now()}.png`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const NumberSelectorButton = ({ num }: { num: number }) => (
    <button
      onClick={() => setNumberOfImages(num)}
      disabled={isLoading}
      className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${
        numberOfImages === num
          ? 'bg-accent-dark text-accent dark:bg-accent dark:text-accent-dark'
          : 'bg-light dark:bg-dark border border-light-border dark:border-dark-border hover:bg-gray-200 dark:hover:bg-gray-800'
      }`}
    >
      {num}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">AI Image Generator</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-sans">
          Turn your imagination into stunning visuals.
        </p>
      </div>

      <div className="bg-light-secondary dark:bg-dark-secondary p-6 md:p-8 rounded-xl shadow-lg border border-light-border dark:border-dark-border font-sans">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A majestic lion wearing a crown, photorealistic"
            className="flex-grow w-full px-4 py-3 rounded-lg bg-light dark:bg-dark border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim() || !hasEnoughCredits}
            className="w-full md:w-auto bg-accent-dark text-accent dark:bg-accent dark:text-accent-dark px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
            {isLoading ? 'Generating...' : `Generate (${generationCost} C)`}
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Number of Images:</span>
            <div className="flex items-center space-x-2">
                <NumberSelectorButton num={1} />
                <NumberSelectorButton num={2} />
                <NumberSelectorButton num={3} />
            </div>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="w-full min-h-[32rem] bg-light dark:bg-dark rounded-lg flex items-center justify-center border border-light-border dark:border-dark-border overflow-hidden p-2 md:p-4">
          {isLoading && (
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-text dark:border-dark-text mx-auto"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">AI is thinking...</p>
            </div>
          )}
          {!isLoading && imageUrls.length > 0 && (
             <div className="grid grid-cols-2 gap-2 w-full h-full">
                {imageUrls.map((url, index) => (
                    <div key={index} className={`relative group aspect-square ${imageUrls.length === 3 && index === 0 ? 'col-span-2' : ''} ${imageUrls.length === 1 ? 'col-span-2' : ''}`}>
                         <img src={url} alt={`${prompt} - ${index + 1}`} className="w-full h-full object-contain rounded-md" />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                             <button
                                 onClick={() => handleDownload(url)}
                                 className="bg-white/90 text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white"
                             >
                                 Download
                             </button>
                         </div>
                    </div>
                ))}
             </div>
          )}
          {!isLoading && imageUrls.length === 0 && (
            <div className="text-center text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <p>Your generated images will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;