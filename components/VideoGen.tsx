import React, { useState, useEffect } from 'react';
import { Video, Send, Loader2, ShieldAlert } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const VideoGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState<any[]>(() => {
    const saved = localStorage.getItem('videoResults');
    return saved ? JSON.parse(saved) : [];
  });

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    if (!(window as any).aistudio?.hasSelectedApiKey()) {
      await (window as any).aistudio?.openSelectKey();
      return;
    }

    setIsGenerating(true);
    setStatus('Initializing Neural Canvas R...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        setStatus('Synthesizing Frame Sequences... (~15s)');
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);

      const newResult = {
        url: videoUrl,
        prompt,
        timestamp: Date.now()
      };
      
      const updated = [newResult, ...results];
      setResults(updated);
      localStorage.setItem('videoResults', JSON.stringify(updated));
      setPrompt('');
    } catch (error) {
      console.error(error);
      alert("Neural render sequence failed. Check system resources.");
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden">
      <div className="p-10 border-b border-white/5 neon-glass flex items-center justify-between">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 neon-glass text-amber-500 rounded-[1.5rem] flex items-center justify-center border border-amber-500/30 shadow-2xl glow-amber">
             <Video size={32} />
           </div>
           <div>
             <h2 className="font-black uppercase tracking-tighter text-3xl italic iridescent-text">Video Studio R</h2>
             <p className="text-[11px] text-amber-500 font-black uppercase tracking-[0.4em] mt-1">Quantum Render Engine v3.1</p>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="neon-glass p-10 rounded-[3rem] border border-white/10 shadow-black/80 space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none"></div>
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-2 flex items-center gap-2">
                <Video size={14} className="text-amber-500" />
                Scene Specification
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-[#08080a] border border-white/10 rounded-[2rem] p-8 text-[17px] resize-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/40 outline-none min-h-[160px] transition-all font-bold placeholder:text-slate-800 shadow-inner"
                placeholder="Cinematic anamorphic shot of a cybernetic explorer reaching the edge of a Dyson Sphere, golden hour, chromatic aberration..."
              />
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-6 bg-gradient-to-r from-amber-600 to-amber-400 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl shadow-amber-500/20"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Send size={24} />}
              {isGenerating ? status : 'Generate Neural Scene R'}
            </button>
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 font-black uppercase tracking-widest bg-white/5 py-3 rounded-full">
              <ShieldAlert size={14} className="text-amber-500" />
              <span>Billing Tier: Enterprise High-Compute Mode</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {results.map((res) => (
              <div key={res.timestamp} className="group relative neon-glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all hover:scale-[1.03] hover:rotate-1">
                <video src={res.url} controls className="w-full aspect-video object-cover" />
                <div className="p-6 bg-black/60 backdrop-blur-xl border-t border-white/5">
                   <p className="text-[12px] font-bold text-slate-200 line-clamp-2 uppercase tracking-tight italic">Prompt: {res.prompt}</p>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && !isGenerating && (
            <div className="text-center py-40 opacity-10">
              <Video size={100} className="mx-auto mb-10 text-slate-500" />
              <p className="font-black uppercase tracking-[1em] text-sm">Awaiting Neural Link...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGen;