import React, { useState, useRef } from 'react';
import { Radio, MicOff, Volume2, Sparkles, X } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

const LiveChat: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcription, setTranscription] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputAudioContext = new AudioContext({ sampleRate: 16000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Quantum Link Verified');
            setIsActive(true);
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (msg: any) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const binary = atob(audioData);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              
              const int16 = new Int16Array(bytes.buffer);
              const buffer = audioContextRef.current!.createBuffer(1, int16.length, 24000);
              const data = buffer.getChannelData(0);
              for (let i = 0; i < int16.length; i++) data[i] = int16[i] / 32768.0;

              const source = audioContextRef.current!.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current!.destination);
              
              const startTime = Math.max(nextStartTimeRef.current, audioContextRef.current!.currentTime);
              source.start(startTime);
              nextStartTimeRef.current = startTime + buffer.duration;
              sourcesRef.current.add(source);
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (msg.serverContent?.outputTranscription) {
                setTranscription(prev => (prev + ' ' + msg.serverContent.outputTranscription.text).slice(-400));
            }
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Connection Terminated');
          },
          onerror: () => setStatus('Hardware Error')
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are Studio R Live Link Core. You are an advanced AI companion capable of extremely high-speed, multi-modal reasoning. Be professional, direct, and helpful.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      alert("Hardware synchronization failed. Check microphone access.");
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
    setStatus('Standby');
    setTranscription('');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-transparent overflow-hidden">
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/5 px-8 py-3 rounded-full border border-white/5 shadow-2xl">
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-cyan-500 animate-pulse glow-cyan shadow-[0_0_20px_cyan]' : 'bg-slate-700'}`}></div>
        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Neural Sync: {status}</span>
      </div>

      <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-magenta-500/30 blur-[150px] transition-all duration-1000 ${isActive ? 'opacity-100 scale-150' : 'opacity-0 scale-50'}`}></div>
        <div className={`w-80 h-80 rounded-full neon-glass flex items-center justify-center border-2 transition-all duration-700 relative z-10 ${isActive ? 'border-cyan-500 shadow-[0_0_80px_rgba(6,182,212,0.4)] orb-pulse' : 'border-white/5'}`}>
          <div className="flex flex-col items-center gap-6">
            <div className={`transition-all duration-700 ${isActive ? 'scale-110 glow-cyan' : 'opacity-20'}`}>
                {isActive ? <Radio className="w-24 h-24 text-cyan-400" /> : <MicOff className="w-24 h-24 text-slate-500" />}
            </div>
            <span className={`text-[12px] font-black uppercase tracking-[0.5em] transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                {isActive ? 'Live Uplink' : 'System Idle'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-20 max-w-2xl w-full text-center space-y-12">
        <div className="h-40 overflow-hidden relative glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex items-center justify-center">
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#040406] to-transparent z-10 opacity-80"></div>
            <p className="text-slate-300 italic text-xl font-bold animate-pulse leading-relaxed px-4">
                {transcription || 'Establishing cognitive uplink...'}
            </p>
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#040406] to-transparent z-10 opacity-80"></div>
        </div>

        {!isActive ? (
          <button 
            onClick={startSession}
            className="px-16 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-white/20"
          >
            Connect Neural Link R
          </button>
        ) : (
          <button 
            onClick={stopSession}
            className="px-16 py-6 bg-red-600 text-white rounded-full font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-red-500/40"
          >
            Terminate Session
          </button>
        )}
      </div>

      <div className="absolute bottom-16 flex gap-16">
        <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
            <Volume2 size={20} className="text-cyan-400 glow-cyan" />
            24kHz Neural PCM
        </div>
        <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
            <Sparkles size={20} className="text-magenta-400 glow-magenta" />
            R-Evolution AI
        </div>
      </div>
    </div>
  );
};

export default LiveChat;