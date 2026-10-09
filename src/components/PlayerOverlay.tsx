import React, { useEffect, useState } from 'react';
import { 
  X, 
  Grid3X3, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Flame, 
  Radio, 
  Sparkles,
  BarChart3,
  Tv
} from 'lucide-react';
import { GameItem } from '../types';
import { FocusableItem } from './common/FocusableItem';
import { useToast } from '../context/ToastContext';

interface PlayerOverlayProps {
  game: GameItem;
  spoilerFree: boolean;
  onClose: () => void;
  onGoToSquares: (gameId: string) => void;
}

export const PlayerOverlay: React.FC<PlayerOverlayProps> = ({
  game,
  spoilerFree,
  onClose,
  onGoToSquares,
}) => {
  const { showToast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // Keyboard shortcut listener inside full-screen player:
  // Esc/Backspace -> Close player
  // '5' -> Jump to Squares for this game!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        onClose();
      } else if (e.key === '5') {
        e.preventDefault();
        showToast('Navigating to Squares', `Jumping to 10x10 Squares for ${game.awayTeam.shortName} vs ${game.homeTeam.shortName}`, 'info');
        onGoToSquares(game.id);
      }
    };

    const handleCustomBack = () => {
      onClose();
    };

    const handleCustomKey5 = () => {
      showToast('Navigating to Squares', `Jumping to 10x10 Squares for ${game.awayTeam.shortName} vs ${game.homeTeam.shortName}`, 'info');
      onGoToSquares(game.id);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('tv-remote-back', handleCustomBack);
    window.addEventListener('tv-remote-key5', handleCustomKey5);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('tv-remote-back', handleCustomBack);
      window.removeEventListener('tv-remote-key5', handleCustomKey5);
    };
  }, [game, onClose, onGoToSquares, showToast]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300">
      {/* Stadium / Broadcast Visual Canvas */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-[#101018] to-zinc-900 pointer-events-none">
        {/* Animated Broadcast Scanlines / Atmosphere */}
        <div className="absolute inset-0 tv-scanlines opacity-40"></div>
        
        {/* Animated Stadium Floodlights */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#ff7a1a]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#a3e635]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Live Broadcast Arena Canvas Simulation */}
        <div className="absolute inset-x-12 inset-y-16 rounded-3xl border border-zinc-800/60 bg-gradient-to-b from-[#181822]/40 to-[#0e0e14]/90 flex items-center justify-center overflow-hidden">
          {/* Tactical Pitch Lines & Player Trackers */}
          <div className="w-full h-full relative opacity-30 flex items-center justify-center">
            <div className="w-4/5 h-4/5 border-2 border-white/20 rounded-2xl flex items-center justify-center relative">
              <div className="w-full h-px bg-white/20"></div>
              <div className="w-48 h-48 border-2 border-white/20 rounded-full absolute"></div>
              {/* Animated player blips */}
              <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-[#ff7a1a] animate-ping" />
              <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-[#ff7a1a]" />
              <div className="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-[#a3e635] animate-ping" />
              <div className="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-[#a3e635]" />
            </div>
          </div>

          <div className="absolute text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-zinc-700 text-xs text-zinc-300 mb-2">
              <Radio className="w-3.5 h-3.5 text-[#ff7a1a] animate-pulse" />
              <span>LIVE FEED • 4K ULTRA HD • 60 FPS • DOLBY ATMOS</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-wider">
              {game.headline}
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Broadcasting from {game.venue}
            </p>
          </div>
        </div>
      </div>

      {/* Top TV Player Bar */}
      <div className="relative z-20 px-12 py-8 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-4">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#ff7a1a] text-white font-extrabold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(255,122,26,0.8)]">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            LIVE ON AIR
          </div>
          <span className="font-teko text-3xl font-bold text-white tracking-wide">
            {game.channel}
          </span>
        </div>

        {/* Remote Action Hints & Quick Buttons */}
        <div className="flex items-center gap-4">
          {/* Jump to Squares button in player */}
          <FocusableItem
            id="player-btn-squares"
            dataNavDown="player-btn-close"
            onSelect={() => onGoToSquares(game.id)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff7a1a] to-[#ea580c] text-white font-bold text-sm shadow-[0_0_25px_rgba(255,122,26,0.6)] flex items-center gap-2.5"
          >
            {() => (
              <>
                <Grid3X3 className="w-4 h-4 text-white" />
                <span>Jump to Squares</span>
                <span className="px-2 py-0.5 rounded bg-black/30 font-mono-num text-xs font-extrabold">
                  KEY 5
                </span>
              </>
            )}
          </FocusableItem>

          <FocusableItem
            id="player-btn-audio"
            dataNavDown="player-btn-close"
            onSelect={() => {
              setIsMuted(!isMuted);
              showToast('Audio', isMuted ? 'Stadium Sound Unmuted' : 'Audio Muted', 'info');
            }}
            className="px-4 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white font-bold text-sm flex items-center gap-2"
          >
            {() => (
              <>
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#a3e635]" />}
                <span>{isMuted ? 'Unmute' : 'Audio 5.1'}</span>
              </>
            )}
          </FocusableItem>

          <FocusableItem
            id="player-btn-close"
            dataNavUp="player-btn-squares"
            onSelect={onClose}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold text-sm flex items-center gap-2 hover:text-white"
          >
            {() => (
              <>
                <X className="w-4 h-4 text-zinc-400" />
                <span>Exit Player</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono-num text-zinc-300">
                  ESC
                </span>
              </>
            )}
          </FocusableItem>
        </div>
      </div>

      {/* Bottom Live Scorebug & Info Bar */}
      <div className="relative z-20 px-12 py-8 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-between">
        {/* Big TV Scorebug */}
        <div className="flex items-center gap-8 bg-zinc-950/90 backdrop-blur-xl border-2 border-zinc-700/80 rounded-2xl p-6 shadow-2xl">
          {/* Away Team */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center font-extrabold text-white text-xl shadow-lg"
              style={{ backgroundColor: game.awayTeam.logoColor }}
            >
              {game.awayTeam.shortName}
            </div>
            <div>
              <div className="text-xl font-bold text-white">{game.awayTeam.name}</div>
              <div className="text-xs text-zinc-400">{game.awayTeam.record}</div>
            </div>
            <div className="font-teko text-6xl font-bold text-white px-4">
              {spoilerFree ? (
                <span className="text-lg font-sans text-zinc-500 bg-zinc-900 px-3 py-1 rounded">
                  HIDDEN
                </span>
              ) : (
                game.awayTeam.score
              )}
            </div>
          </div>

          <div className="flex flex-col items-center px-4 border-x border-zinc-800">
            <div className="text-xs font-mono font-bold text-[#ff7a1a] uppercase tracking-wider">
              {game.quarterOrPeriod}
            </div>
            <div className="font-teko text-3xl font-bold text-white font-mono-num">
              {game.clock}
            </div>
            <div className="text-[11px] text-[#a3e635] font-semibold">
              LIVE
            </div>
          </div>

          {/* Home Team */}
          <div className="flex items-center gap-4">
            <div className="font-teko text-6xl font-bold text-[#ff7a1a] px-4">
              {spoilerFree ? (
                <span className="text-lg font-sans text-zinc-500 bg-zinc-900 px-3 py-1 rounded">
                  HIDDEN
                </span>
              ) : (
                game.homeTeam.score
              )}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">{game.homeTeam.name}</div>
              <div className="text-xs text-zinc-400">{game.homeTeam.record}</div>
            </div>
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center font-extrabold text-white text-xl shadow-lg"
              style={{ backgroundColor: game.homeTeam.logoColor }}
            >
              {game.homeTeam.shortName}
            </div>
          </div>
        </div>

        {/* TV Remote Shortcut Reminder Banner */}
        <div className="bg-zinc-900/90 border border-zinc-700/80 rounded-2xl p-5 text-right flex flex-col justify-center max-w-sm">
          <div className="text-xs uppercase font-bold text-[#a3e635] tracking-widest mb-1">
            TV Remote Hotkeys
          </div>
          <div className="text-sm text-zinc-300">
            Press <span className="font-mono-num font-bold text-[#ff7a1a] px-1.5 py-0.5 bg-black/60 rounded">5</span> on remote to open Squares Pool
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            Press <span className="font-mono font-bold text-white px-1 py-0.5 bg-black/60 rounded">ESC</span> or <span className="font-mono font-bold text-white px-1 py-0.5 bg-black/60 rounded">BACK</span> to return to TV Guide
          </div>
        </div>
      </div>
    </div>
  );
};
