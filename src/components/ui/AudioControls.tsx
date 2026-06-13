import React from 'react';
import { Volume2, VolumeX, Music, Mic, MicOff } from 'lucide-react';
import { useAudioStore } from '../../store/audioStore';

export const AudioControls: React.FC = () => {
  const { musicEnabled, sfxEnabled, narrationEnabled, toggleMusic, toggleSfx, toggleNarration } = useAudioStore();

  return (
    <div className="flex items-center gap-2 bg-glass-bg rounded-full p-1 border border-glass-border">
      <button 
        onClick={toggleMusic}
        className={`p-2 rounded-full transition-colors ${musicEnabled ? 'bg-world-coral/20 text-world-coral' : 'text-color-text-muted hover:bg-white/5'}`}
        title="Toggle Music"
      >
        <Music size={18} />
      </button>
      <button 
        onClick={toggleSfx}
        className={`p-2 rounded-full transition-colors ${sfxEnabled ? 'bg-world-jungle/20 text-world-jungle' : 'text-color-text-muted hover:bg-white/5'}`}
        title="Toggle Sound Effects"
      >
        {sfxEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
      <button 
        onClick={toggleNarration}
        className={`p-2 rounded-full transition-colors ${narrationEnabled ? 'bg-world-space/20 text-world-space' : 'text-color-text-muted hover:bg-white/5'}`}
        title="Toggle Narration"
      >
        {narrationEnabled ? <Mic size={18} /> : <MicOff size={18} />}
      </button>
    </div>
  );
};
