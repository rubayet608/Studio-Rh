import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, BrainCircuit, Code, PenTool, Database, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Chat, Message, Settings } from '../types';

interface ChatAreaProps {
  chat: Chat;
  settings: Settings;
  onUpdateMessages: (messages: Message[]) => void;
}

const BLUEPRINTS = [
  {
    id: 'logic',
    name: 'Logic Nexus',
    desc: 'Advanced software engineering & logic',
    icon: Code,
    colorClass: 'emerald',
    glowClass: 'glow-emerald',
    prompt: 'You are the Logic Nexus Core. Specialize in high-quality code, complex logic, and efficient software architecture. Be concise and professional.'
  },
  {
    id: 'creative',
    name: 'Creative Prism',
    desc: 'Narrative synthesis & world building',
    icon: PenTool,
    colorClass: 'amber',
    glowClass: 'glow-amber',
    prompt: 'You are the Creative Prism. Specialize in vivid, artistic, and evocative writing. Focus on metaphors and creative world-building.'
  },
  {
    id: 'data',
    name: 'Data Zenith',
    desc: 'Analytical research & deduction',
    icon: Database,
    colorClass: 'magenta',
    glowClass: 'glow-magenta',
    prompt: 'You are the Data Zenith. Specialize in scientific research, logical deduction, and objective data-driven insights.'
  },
  {
    id: 'vision',
    name: 'Visionary R',
    desc: 'High-end multimodal prompt design',
    icon: Zap,
    colorClass: 'cyan',
    glowClass: 'glow-cyan',
    prompt: 'You are the Visionary R. Specialize in crafting extremely detailed and complex visual prompts for image and video AI models.'
  }
];

const ChatArea: React.FC<ChatAreaProps> = ({ chat, settings, onUpdateMessages }) => {
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages, isStreaming]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const applyBlueprint = (blueprint: typeof BLUEPRINTS[0]) => {
    const systemMsg: Message = {
      id: 'blueprint-' + Date.now(),
      role: 'system',
      content: `[COGNITIVE SYNC: ${blueprint.name}] ${blueprint.prompt}`,
      timestamp: Date.now()
    };
    onUpdateMessages([systemMsg]);
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    const newMessages = [...chat.messages, userMsg];
    onUpdateMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };
    
    onUpdateMessages([...newMessages, assistantMsg]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const responseStream = await ai.models.generateContentStream({
        model: settings.model.includes('gemini') ? settings.model : 'gemini-3-pro-preview',
        contents: newMessages.filter(m => m.role !== 'system').map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: chat.messages.find(m => m.role === 'system')?.content || settings.systemPrompt,
        },
      });

      let accumulatedContent = '';
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          accumulatedContent += text;
          onUpdateMessages([...newMessages, { ...assistantMsg, content: accumulatedContent }]);
        }
      }
    } catch (error) {
      console.error(error);
      onUpdateMessages([...newMessages, { 
        ...assistantMsg, 
        content: "Neural thread synchronization error. Connection reset." 
      }]);
    } finally {
      setIsStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-12 py-10 space-y-12"
      >
        {chat.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-full space-y-16 max-w-6xl mx-auto py-12">
            <div className="text-center space-y-4">
              <div className="v3-badge mb-4 mx-auto block w-fit">Neural Layer R</div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-white iridescent-text">Synchronize Matrix</h2>
              <p className="text-slate-500 font-bold max-w-2xl mx-auto text-lg leading-relaxed">Initialize a specialized blueprint to optimize neural synthesis performance.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
              {BLUEPRINTS.map((bp) => (
                <div 
                  key={bp.id} 
                  onClick={() => applyBlueprint(bp)}
                  className={`blueprint-card group relative p-8 neon-glass rounded-[2.5rem] border border-white/5 hover:border-white/20 cursor-pointer overflow-hidden transition-all shadow-2xl`}
                >
                  <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all`}>
                    <bp.icon size={100} />
                  </div>
                  <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <bp.icon size={28} className={bp.glowClass} />
                  </div>
                  <h3 className="font-black uppercase tracking-[0.2em] text-[12px] mb-3 text-white">{bp.name}</h3>
                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-10">{bp.desc}</p>
                  <div className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2`} style={{ color: `var(--accent-${bp.colorClass})` }}>
                    <span>Deploy</span>
                    <Sparkles size={12} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-12 opacity-20 w-full max-w-4xl">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/50"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.6em] whitespace-nowrap">Neural Link Standby</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/50"></div>
            </div>
          </div>
        )}
        
        {chat.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-500`}>
            <div className={`max-w-[85%] md:max-w-[75%] flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-12 h-12 rounded-2xl shadow-2xl flex-shrink-0 flex items-center justify-center transition-all ${msg.role === 'user' ? 'bg-white text-black' : 'neon-glass text-cyan-400 border border-white/10'}`}>
                {msg.role === 'user' ? <User size={22} /> : (msg.content.includes('[COGNITIVE SYNC') ? <BrainCircuit size={26} className="text-emerald-400 glow-emerald" /> : <Bot size={26} className="glow-cyan" />)}
              </div>
              <div className={`p-8 rounded-[2.5rem] shadow-2xl chat-bubble-unique ${msg.role === 'user' ? 'bg-[#0f0f12] border border-white/10 text-white rounded-tr-none' : (msg.content.includes('[COGNITIVE SYNC') ? 'bg-emerald-500/5 border border-emerald-500/20 rounded-tl-none italic text-emerald-300 font-bold' : 'neon-glass rounded-tl-none border border-white/10')}`}>
                <div 
                  className={`prose prose-invert prose-zinc max-w-none text-[15px] leading-relaxed font-medium selection:bg-cyan-500/30`}
                  dangerouslySetInnerHTML={{ __html: (window as any).marked.parse(msg.content) }}
                />
              </div>
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="flex justify-start">
             <div className="flex gap-4 items-center neon-glass px-8 py-4 rounded-full border border-cyan-500/40 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                Neural Synthesis...
             </div>
          </div>
        )}
      </div>

      <div className="p-10 neon-glass border-t border-white/5 relative">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-cyan-500/5 blur-[120px] rounded-[3rem] group-focus-within:bg-magenta-500/5 transition-all duration-1000"></div>
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Input Neural Vector..."
            className="relative w-full pl-10 pr-24 py-8 bg-[#08080a] border border-white/10 rounded-[2.5rem] focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500/50 outline-none resize-none min-h-[84px] transition-all text-[16px] placeholder:text-slate-700 font-bold text-white shadow-2xl"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className={`absolute right-5 bottom-5 p-5 rounded-[1.5rem] transition-all ${input.trim() && !isStreaming ? 'bg-white text-black shadow-2xl hover:scale-110 active:scale-95' : 'bg-white/5 text-slate-800 cursor-not-allowed'}`}
          >
            <Send size={24} />
          </button>
        </div>
        <div className="mt-6 flex justify-center gap-10 opacity-30">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 glow-emerald"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Core R Active</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 glow-cyan"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Uplink Stable</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;