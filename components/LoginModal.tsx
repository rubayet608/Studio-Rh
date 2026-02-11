
import React, { useState } from 'react';
import { X, LogIn, Mail, User } from 'lucide-react';

interface LoginModalProps {
  onLogin: (name: string, email: string) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md glass rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 space-y-8">
          <div className="text-center space-y-2">
             <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center mx-auto shadow-xl mb-4">
                <LogIn size={28} />
             </div>
             <h2 className="text-2xl font-black tracking-tight">Access Pro Account</h2>
             <p className="text-zinc-500 text-sm">Synchronize your studios across sessions.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 glass border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="e.g. Alex Studio"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 glass border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="alex@studio.pro"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button 
               onClick={onClose}
               className="flex-1 py-4 glass text-zinc-500 font-bold rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
             >
               Discard
             </button>
             <button 
               disabled={!name.trim() || !email.trim()}
               onClick={() => onLogin(name, email)}
               className="flex-[2] py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
             >
               Initialize Login
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
