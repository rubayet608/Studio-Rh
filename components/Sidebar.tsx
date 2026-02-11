import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Image as ImageIcon, 
  Video as VideoIcon,
  Mic, 
  Radio,
  Settings as SettingsIcon, 
  Trash2,
  User as UserIcon,
  LogIn,
  Zap
} from 'lucide-react';
import { Chat, UserProfile } from '../types';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  isOpen: boolean;
  activeTab: 'chat' | 'image' | 'voice' | 'video' | 'live';
  user: UserProfile;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenLogin: () => void;
  onSelectTab: (tab: 'chat' | 'image' | 'voice' | 'video' | 'live') => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats, activeChatId, isOpen, activeTab, user,
  onSelectChat, onDeleteChat, onNewChat, onOpenSettings, onOpenLogin, onSelectTab
}) => {
  const NavButton = ({ id, icon: Icon, label, colorHex, glowClass }: any) => (
    <button 
      onClick={() => onSelectTab(id)}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all group relative overflow-hidden ${activeTab === id ? 'neon-glass border border-white/15' : 'hover:bg-white/5 text-slate-400'}`}
    >
      {activeTab === id && <div className="absolute inset-0 bg-current opacity-5" style={{ color: colorHex }}></div>}
      <Icon size={18} style={{ color: activeTab === id ? colorHex : 'inherit' }} className={activeTab === id ? glowClass : 'group-hover:text-white'} />
      <span className={`font-black text-[10px] uppercase tracking-[0.25em] ${activeTab === id ? 'text-white' : ''}`}>{label}</span>
      {activeTab === id && <div className="absolute right-4 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorHex }}></div>}
    </button>
  );

  return (
    <aside className={`
      fixed md:static inset-y-0 left-0 w-80 bg-[#060608]/95 backdrop-blur-3xl border-r border-white/5 
      transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 
      transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-50 flex flex-col
    `}>
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-2xl shadow-2xl shrink-0">
          <Zap size={24} fill="currentColor" />
        </div>
        <div className="overflow-hidden">
          <span className="font-black tracking-tighter text-2xl italic block leading-none iridescent-text truncate">STUDIO R</span>
          <span className="v3-badge mt-1.5 inline-block shrink-0">v3.0</span>
        </div>
      </div>

      <div className="px-6 pb-8">
        <button onClick={onNewChat} className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-white text-black rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.03] active:scale-[0.97] transition-all shadow-2xl shadow-white/5 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>New Thread R</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-2 pb-8">
        <div className="px-5 mb-3 text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Nodes</div>
        <NavButton id="live" icon={Radio} label="Live Link" colorHex="#06b6d4" glowClass="glow-cyan" />
        <NavButton id="chat" icon={MessageSquare} label="Neural Chat" colorHex="#10b981" glowClass="glow-emerald" />
        <NavButton id="image" icon={ImageIcon} label="Visual Lab" colorHex="#d946ef" glowClass="glow-magenta" />
        <NavButton id="video" icon={VideoIcon} label="Video Lab" colorHex="#f59e0b" glowClass="glow-amber" />
        <NavButton id="voice" icon={Mic} label="Audio Lab" colorHex="#3b82f6" glowClass="glow-blue" />

        <div className="pt-10 mb-3 px-5 text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Active Threads</div>
        <div className="space-y-1">
          {chats.map(chat => (
            <div key={chat.id} className="group flex items-center gap-1">
              <button 
                onClick={() => onSelectChat(chat.id)}
                className={`flex-1 text-left px-5 py-4 rounded-[1.25rem] truncate transition-all ${activeChatId === chat.id && activeTab === 'chat' ? 'neon-glass text-white font-bold border border-white/10 shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
              >
                <span className="truncate text-[11px] font-bold uppercase tracking-tight">{chat.title}</span>
              </button>
              <button onClick={() => onDeleteChat(chat.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 transition-all shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {chats.length === 0 && <p className="px-5 text-[10px] text-slate-600 font-bold uppercase tracking-widest">No active links</p>}
        </div>
      </nav>

      <div className="p-6 mt-auto border-t border-white/5 space-y-4">
        <button onClick={onOpenLogin} className="w-full flex items-center gap-4 p-4 rounded-[2rem] bg-white/5 hover:bg-white/10 transition-all border border-white/5 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-magenta-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center text-white shadow-2xl relative z-10 glow-magenta">
            <UserIcon size={24} />
          </div>
          <div className="flex-1 text-left overflow-hidden relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest truncate text-white">{user.name}</p>
            <p className="text-[8px] text-slate-500 font-bold truncate tracking-widest uppercase">Identity Secure</p>
          </div>
          {!user.isLoggedIn && <LogIn size={18} className="text-cyan-400 relative z-10" />}
        </button>

        <button onClick={onOpenSettings} className="w-full flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-white transition-all group">
          <SettingsIcon size={18} className="group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-black text-[9px] uppercase tracking-[0.4em]">Core Config</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;