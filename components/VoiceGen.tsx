
import React, { useState } from 'react';
import { Mic, Play, Loader2, Download, Trash2, Volume2, Save } from 'lucide-react';
import { generateSpeech, playPCM } from '../geminiService';
import { VoiceResult } from '../types';

const VOICES = [
  { id: 'Kore', name: 'Kore (Cheerful)' },
  { id: 'Puck', name: 'Puck (Enthusiastic)' },
  { id: 'Charon', name: 'Charon (Deep)' },
  { id: 'Fenrir', name: 'Fenrir (Serene)' },
  { id: 'Zephyr', name: 'Zephyr (Modern)' },
];

const VoiceGen: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<VoiceResult[]>(() => {
    const saved = localStorage.getItem('voiceResults');
    return saved ? JSON.parse(saved) : [];
  });

  const handleGenerate = async () => {
    if (!text.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const buffer = await generateSpeech(text, selectedVoice);
      await playPCM(buffer);
      
      // Store result (simplified for demo, typically you'd store as a blob URL if persistent)
      // Note: PCM data is large, we'll store basic info and re-gen or just allow one-time play
      const newResult: VoiceResult = {
        url: '', // Local URLs are tricky for persistence, so we show history of text
        text,
        voice: selectedVoice,
        timestamp: Date.now()
      };
      
      const updated = [newResult, ...history.slice(0, 19)]; // Keep last 20
      setHistory(updated);
      localStorage.setItem('voiceResults', JSON.stringify(updated));
    } catch (error) {
      alert("Failed to generate speech: " + error);
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteHistory = (timestamp: number) => {
    const updated = history.filter(h => h.timestamp !== timestamp);
    setHistory(updated);
    localStorage.setItem('voiceResults', JSON.stringify(updated));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <div className="p-4 border-b dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
             <Mic size={18} />
           </div>
           <h2 className="font-semibold">Professional AI Voice Studio</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border dark:border-zinc-800 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-zinc-500">Voice Selection</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {VOICES.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${selectedVoice === v.id ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'}`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-zinc-500">Input Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                placeholder="Type the message you want the AI to speak..."
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim()}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Volume2 size={20} />}
              {isGenerating ? 'Generating Audio...' : 'Generate & Speak'}
            </button>
          </div>

          <div className="space-y-4">
             <h3 className="font-semibold px-2">Recent Creations</h3>
             <div className="space-y-2">
                {history.map(item => (
                  <div key={item.timestamp} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border dark:border-zinc-800 flex items-center justify-between group">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm truncate dark:text-zinc-200">{item.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">{item.voice}</span>
                        <span className="text-[10px] text-zinc-400">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => {
                          setText(item.text);
                          setSelectedVoice(item.voice);
                        }}
                        className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                         <Play size={16} />
                      </button>
                      <button 
                        onClick={() => deleteHistory(item.timestamp)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                         <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-10 text-zinc-500 text-sm">No recent voice generations.</div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceGen;
