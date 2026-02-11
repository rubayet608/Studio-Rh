import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Plus, 
  Settings as SettingsIcon, 
  MessageSquare, 
  Image as ImageIcon, 
  Video as VideoIcon,
  Mic, 
  Radio,
  Sparkles
} from 'lucide-react';
import { Theme, Chat, Message, Settings, UserProfile } from './types';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ImageGen from './components/ImageGen';
import VoiceGen from './components/VoiceGen';
import VideoGen from './components/VideoGen';
import LiveChat from './components/LiveChat';
import SettingsModal from './components/SettingsModal';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'voice' | 'video' | 'live'>('chat');
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { name: 'Architect R', email: '', isLoggedIn: false };
  });

  const [settings, setSettings] = useState<Settings>({
    model: localStorage.getItem('model') || 'gemini-3-pro-preview',
    theme: Theme.DARK,
    systemPrompt: localStorage.getItem('systemPrompt') || 'You are the core intelligence of STUDIO R, a premium neural synthesis workspace. Be concise, brilliant, and professional.',
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      const parsed = JSON.parse(savedChats);
      setChats(parsed);
      if (parsed.length > 0) setActiveChatId(parsed[0].id);
    } else {
      createNewChat();
    }
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => localStorage.setItem('chats', JSON.stringify(chats)), [chats]);
  useEffect(() => localStorage.setItem('userProfile', JSON.stringify(user)), [user]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Neural Thread R',
      messages: [],
      createdAt: Date.now(),
      systemPrompt: settings.systemPrompt
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setActiveTab('chat');
    setIsSidebarOpen(false);
  };

  const deleteChat = (id: string) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (activeChatId === id) setActiveChatId(filtered.length > 0 ? filtered[0].id : null);
      return filtered;
    });
  };

  const updateChatMessages = (chatId: string, messages: Message[]) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        let title = chat.title;
        if (messages.length > 0 && chat.title === 'Neural Thread R') {
          const firstUserMsg = messages.find(m => m.role === 'user');
          if (firstUserMsg) {
            title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
          }
        }
        return { ...chat, messages, title };
      }
      return chat;
    }));
  };

  const currentChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-slate-100 selection:bg-cyan-500/40">
      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between p-5 neon-glass sticky top-0 z-30 border-b border-white/5">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-cyan-400 focus:outline-none"><Menu size={24} /></button>
        <div className="flex items-center gap-2">
           <span className="font-black tracking-tighter text-2xl italic iridescent-text">STUDIO R</span>
           <span className="v3-badge">3.0</span>
        </div>
        <button onClick={createNewChat} className="p-2 text-emerald-400 focus:outline-none"><Plus size={24} /></button>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-40 md:hidden animate-in fade-in duration-500" onClick={() => setIsSidebarOpen(false)} />}

      <Sidebar 
        chats={chats} 
        activeChatId={activeChatId} 
        isOpen={isSidebarOpen}
        user={user}
        activeTab={activeTab}
        onSelectChat={(id) => { setActiveChatId(id); setActiveTab('chat'); setIsSidebarOpen(false); }}
        onDeleteChat={deleteChat}
        onNewChat={createNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onSelectTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="tab-content flex-1 flex flex-col min-h-0">
          {activeTab === 'chat' && activeChatId ? (
            <ChatArea chat={currentChat!} settings={settings} onUpdateMessages={(msgs) => updateChatMessages(activeChatId, msgs)} />
          ) : activeTab === 'image' ? (
            <ImageGen />
          ) : activeTab === 'voice' ? (
            <VoiceGen />
          ) : activeTab === 'video' ? (
            <VideoGen />
          ) : activeTab === 'live' ? (
            <LiveChat />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 animate-in fade-in zoom-in duration-1000">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-[150px] opacity-30 animate-pulse"></div>
                <div className="w-40 h-40 neon-glass rounded-[3rem] flex items-center justify-center shadow-2xl border border-white/10 rotate-12 hover:rotate-0 transition-all duration-700 group cursor-pointer">
                  <Sparkles className="w-20 h-20 text-cyan-400 group-hover:text-magenta-400 transition-colors glow-cyan" />
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-6xl font-black tracking-tighter uppercase italic iridescent-text">R-Evolution</h2>
                <p className="text-slate-400 max-w-xl mx-auto font-medium text-lg leading-relaxed">Multimodal Synthesis Workspace v3.0. The highest tier of neural execution.</p>
              </div>
              <button onClick={createNewChat} className="px-14 py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10">
                Initialize Studio
              </button>
            </div>
          )}
        </div>
      </main>

      {isSettingsOpen && <SettingsModal settings={settings} onSave={(s) => { setSettings(s); setIsSettingsOpen(false); }} onClose={() => setIsSettingsOpen(false)} />}
      {isLoginOpen && <LoginModal onLogin={(n, e) => { setUser({ name: n, email: e, isLoggedIn: true }); setIsLoginOpen(false); }} onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
};

export default App;