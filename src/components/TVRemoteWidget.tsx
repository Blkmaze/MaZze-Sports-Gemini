import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  CornerDownLeft, 
  Undo2, 
  Tv, 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  Power,
  Grid3X3,
  HelpCircle
} from 'lucide-react';
import { useSpatialNav } from '../context/SpatialNavContext';
import { useToast } from '../context/ToastContext';

export const TVRemoteWidget: React.FC = () => {
  const { navigateDirection, triggerSelect, triggerBack, triggerKey5, focusedId } = useSpatialNav();
  const { showToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none font-sans">
      {/* Remote Box */}
      <div className="bg-[#14141e]/95 backdrop-blur-xl border-2 border-zinc-700/80 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 w-56">
        {/* Remote Top Header */}
        <div className="bg-zinc-900/90 px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-[#ff7a1a]" />
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">
              TV Remote
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse" />
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-zinc-400 hover:text-white p-0.5 rounded transition-colors"
              title={collapsed ? 'Expand Remote' : 'Collapse Remote'}
            >
              {collapsed ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsed view status pill */}
        {collapsed ? (
          <div
            onClick={() => setCollapsed(false)}
            className="p-2 text-center text-[10px] text-zinc-400 cursor-pointer hover:bg-zinc-800/60"
          >
            Click to expand virtual remote
          </div>
        ) : (
          <div className="p-3.5 flex flex-col items-center">
            {/* Active Focus Inspector */}
            <div className="w-full bg-black/60 rounded-lg p-1.5 mb-3 border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                Focus Target:
              </span>
              <span className="text-[11px] font-mono font-bold text-[#ff7a1a] truncate block">
                {focusedId || 'none'}
              </span>
            </div>

            {/* Power & Mute Quick Row */}
            <div className="flex items-center justify-between w-full mb-3 px-2">
              <button
                onClick={() => showToast('Power', 'MaZze Sports TV is in Standby mode.', 'info')}
                className="w-8 h-8 rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 hover:bg-red-900 transition-colors shadow-sm"
                title="Power"
              >
                <Power className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => triggerKey5()}
                className="px-2.5 py-1 rounded-full bg-[#ff7a1a]/20 border border-[#ff7a1a] text-[#ff7a1a] font-mono-num font-extrabold text-[11px] hover:bg-[#ff7a1a] hover:text-white transition-colors flex items-center gap-1"
                title="Key 5 (Jump to Squares)"
              >
                <Grid3X3 className="w-3 h-3" />
                <span>KEY 5</span>
              </button>

              <button
                onClick={() => showToast('Mute', 'Audio muted / unmuted', 'info')}
                className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:bg-zinc-700 transition-colors shadow-sm"
                title="Mute"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Circular D-Pad */}
            <div className="relative w-36 h-36 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center shadow-inner my-1">
              {/* Up */}
              <button
                onClick={() => navigateDirection('up')}
                className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-8 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-t-full transition-colors active:scale-95"
                title="Arrow Up"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Down */}
              <button
                onClick={() => navigateDirection('down')}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-8 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-b-full transition-colors active:scale-95"
                title="Arrow Down"
              >
                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Left */}
              <button
                onClick={() => navigateDirection('left')}
                className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-l-full transition-colors active:scale-95"
                title="Arrow Left"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Right */}
              <button
                onClick={() => navigateDirection('right')}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-r-full transition-colors active:scale-95"
                title="Arrow Right"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Center OK / Enter button */}
              <button
                onClick={() => triggerSelect()}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff7a1a] to-[#ea580c] text-white font-extrabold text-xs flex flex-col items-center justify-center shadow-[0_0_15px_rgba(255,122,26,0.5)] active:scale-90 transition-transform"
                title="Enter / Select"
              >
                <CornerDownLeft className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-[10px] tracking-wider leading-none">OK</span>
              </button>
            </div>

            {/* Back Button */}
            <div className="w-full mt-3 flex items-center justify-center">
              <button
                onClick={() => triggerBack()}
                className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-sm"
                title="Escape / Backspace"
              >
                <Undo2 className="w-3.5 h-3.5 text-[#ff7a1a]" />
                <span>BACK (ESC)</span>
              </button>
            </div>

            {/* Keyboard shortcut hint */}
            <div className="mt-2 text-[10px] text-zinc-500 text-center font-mono leading-tight">
              Physical keyboard: Arrow keys, Enter, Esc, 5
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
