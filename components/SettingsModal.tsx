

import React, { useState } from 'react';
import { X, Moon, Sun, Save, Terminal } from 'lucide-react';
import { Settings, Theme } from '../types';

interface SettingsModalProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [formData, setFormData] = useState<Settings>(settings);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border dark:border-zinc-800">
        <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Preferences</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Appearance */}
          <section className="space-y-3">
             <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Appearance</label>
             <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
               <button 
                 onClick={() => setFormData({ ...formData, theme: Theme.LIGHT })}
                 className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${formData.theme === Theme.LIGHT ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500'}`}
               >
                 <Sun size={18} />
                 <span>Light</span>
               </button>
               <button 
                 onClick={() => setFormData({ ...formData, theme: Theme.DARK })}
                 className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${formData.theme === Theme.DARK ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500'}`}
               >
                 <Moon size={18} />
                 <span>Dark</span>
               </button>
             </div>
          </section>

          {/* Chat Settings */}
          <section className="space-y-4">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Chat Engine</label>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Model</label>
              <input 
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                placeholder="gemini-3-pro-preview"
              />
              <p className="text-[10px] text-zinc-400">Current model: {formData.model}</p>
            </div>
          </section>

          {/* Behavior */}
          <section className="space-y-4">
             <div className="flex items-center gap-2">
                <Terminal size={14} className="text-zinc-400" />
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">System Behavior</label>
             </div>
             <div className="space-y-2">
              <label className="text-sm font-medium">Global System Prompt</label>
              <textarea 
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] resize-none"
                placeholder="Define how the AI should act..."
              />
            </div>
          </section>
        </div>

        <div className="p-6 border-t dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <button 
            onClick={() => onSave(formData)}
            className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
          >
            <Save size={18} />
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;