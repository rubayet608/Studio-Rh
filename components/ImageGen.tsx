
import React, { useState } from 'react';
import { ImageIcon, Send, Loader2, Download, Trash2, Maximize2 } from 'lucide-react';
import { generateImage } from '../geminiService';
import { ImageResult } from '../types';

const ImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ImageResult[]>(() => {
    const saved = localStorage.getItem('imageResults');
    return saved ? JSON.parse(saved) : [];
  });

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const url = await generateImage(prompt);
      const newResult: ImageResult = {
        url,
        prompt,
        timestamp: Date.now()
      };
      const updated = [newResult, ...results];
      setResults(updated);
      localStorage.setItem('imageResults', JSON.stringify(updated));
      setPrompt('');
    } catch (error) {
      alert("Failed to generate image: " + error);
    } finally {
      setIsGenerating(false);
    }
  };

  const removeImage = (timestamp: number) => {
    const updated = results.filter(r => r.timestamp !== timestamp);
    setResults(updated);
    localStorage.setItem('imageResults', JSON.stringify(updated));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <div className="p-4 border-b dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
             <ImageIcon size={18} />
           </div>
           <h2 className="font-semibold">Unlimited Image Studio</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border dark:border-zinc-800">
            <label className="block text-sm font-medium mb-3 text-zinc-500">Describe the image you want to create</label>
            <div className="flex gap-2">
               <textarea
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 className="flex-1 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-purple-500 outline-none min-h-[80px]"
                 placeholder="A cinematic shot of a futuristic neon city in the rain, 8k resolution, highly detailed..."
               />
               <button 
                 onClick={handleGenerate}
                 disabled={isGenerating || !prompt.trim()}
                 className={`px-6 rounded-xl flex items-center justify-center transition-all ${isGenerating || !prompt.trim() ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
               >
                 {isGenerating ? <Loader2 className="animate-spin" /> : <Send size={20} />}
               </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((res) => (
              <div key={res.timestamp} className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border dark:border-zinc-800">
                <img src={res.url} alt={res.prompt} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                  <div className="flex justify-end gap-2">
                    <a href={res.url} download={`gen-${res.timestamp}.png`} className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/40">
                      <Download size={18} />
                    </a>
                    <button onClick={() => removeImage(res.timestamp)} className="p-2 bg-red-500/20 rounded-lg text-white hover:bg-red-500/40">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-white text-xs line-clamp-3 bg-black/40 p-2 rounded-lg">{res.prompt}</p>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && !isGenerating && (
            <div className="text-center py-20 opacity-40">
              <ImageIcon size={48} className="mx-auto mb-4" />
              <p>Your generated masterpieces will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGen;
