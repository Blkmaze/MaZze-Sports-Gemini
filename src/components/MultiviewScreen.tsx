import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Grid2X2, 
  Columns2, 
  RotateCw, 
  Radio, 
  Clock,
  Sparkles
} from 'lucide-react';
import { GameItem } from '../types';
import { FocusableItem } from './common/FocusableItem';
import { useToast } from '../context/ToastContext';

interface MultiviewScreenProps {
  games: GameItem[];
  spoilerFree: boolean;
  onOpenPlayer: (game: GameItem) => void;
  onGoToSquares: (gameId: string) => void;
}

export const MultiviewScreen: React.FC<MultiviewScreenProps> = ({
  games,
  spoilerFree,
  onOpenPlayer,
  onGoToSquares,
}) => {
  const { showToast } = useToast();
  const [layoutMode, setLayoutMode] = useState<'4' | '2'>('4');
  const [activeSoundGameId, setActiveSoundGameId] = useState<string>(games[0]?.id || 'game-kc-sf');

  const displayedGames = layoutMode === '2' ? games.slice(0, 2) : games.slice(0, 4);

  const handleTileEnter = (game: GameItem) => {
    setActiveSoundGameId(game.id);
    showToast(
      'Audio Focus Switched',
      `Sound assigned to ${game.awayTeam.shortName} vs ${game.homeTeam.shortName} (${game.channel})`,
      'success',
      2500
    );
  };

  const handleSwapAudio = () => {
    const currentIndex = displayedGames.findIndex((g) => g.id === activeSoundGameId);
    const nextIndex = (currentIndex + 1) % displayedGames.length;
    const nextGame = displayedGames[nextIndex];
    if (nextGame) {
      setActiveSoundGameId(nextGame.id);
      showToast('Audio Swapped', `Now listening to ${nextGame.awayTeam.shortName} vs ${nextGame.homeTeam.shortName}`, 'info', 2500);
    }
  };

  const handleOpenCurrentFullScreen = () => {
    const activeGame = games.find((g) => g.id === activeSoundGameId) || games[0];
    onOpenPlayer(activeGame);
  };

  return (
    <div className="flex-1 h-full flex flex-col p-8 overflow-hidden select-none bg-[#0d0d10]">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#a3e635] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            SYNCHRONIZED MULTIVIEW
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Arena Quad-Stream
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ff7a1a]/20 text-[#ff7a1a] border border-[#ff7a1a]/40">
              {layoutMode === '4' ? '2x2 QUAD BOX' : '2-GAME SPLIT'}
            </span>
          </h1>
        </div>

        {/* Action Buttons: 2 Games, 4 Games, Swap, Full Screen */}
        <div className="flex items-center gap-3">
          <FocusableItem
            id="multi-btn-2games"
            dataNavDown="multi-tile-0"
            dataNavRight="multi-btn-4games"
            onSelect={() => {
              setLayoutMode('2');
              showToast('Layout Changed', 'Switched to 2-Game Side-by-Side view', 'info');
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              layoutMode === '2'
                ? 'bg-[#a3e635] text-black shadow-[0_0_15px_rgba(163,230,53,0.5)]'
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            {() => (
              <>
                <Columns2 className="w-4 h-4" />
                <span>2 Games</span>
              </>
            )}
          </FocusableItem>

          <FocusableItem
            id="multi-btn-4games"
            dataNavDown="multi-tile-0"
            dataNavLeft="multi-btn-2games"
            dataNavRight="multi-btn-swap"
            onSelect={() => {
              setLayoutMode('4');
              showToast('Layout Changed', 'Switched to 4-Game Quad view', 'info');
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              layoutMode === '4'
                ? 'bg-[#a3e635] text-black shadow-[0_0_15px_rgba(163,230,53,0.5)]'
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            {() => (
              <>
                <Grid2X2 className="w-4 h-4" />
                <span>4 Games</span>
              </>
            )}
          </FocusableItem>

          <FocusableItem
            id="multi-btn-swap"
            dataNavDown="multi-tile-1"
            dataNavLeft="multi-btn-4games"
            dataNavRight="multi-btn-fullscreen"
            onSelect={handleSwapAudio}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm flex items-center gap-2"
          >
            {() => (
              <>
                <RotateCw className="w-4 h-4 text-[#ff7a1a]" />
                <span>Swap Audio</span>
              </>
            )}
          </FocusableItem>

          <FocusableItem
            id="multi-btn-fullscreen"
            dataNavDown="multi-tile-1"
            dataNavLeft="multi-btn-swap"
            onSelect={handleOpenCurrentFullScreen}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff7a1a] to-[#ea580c] text-white font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(255,122,26,0.6)]"
          >
            {() => (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>Full Screen</span>
              </>
            )}
          </FocusableItem>
        </div>
      </div>

      {/* Multiview Grid */}
      <div
        className={`flex-1 min-h-0 grid gap-5 ${
          layoutMode === '4' ? 'grid-cols-2 grid-rows-2' : 'grid-cols-2 grid-rows-1'
        }`}
      >
        {displayedGames.map((game, index) => {
          const hasSound = game.id === activeSoundGameId;
          const isLeft = index % 2 === 0;
          const isTop = index < 2;

          return (
            <FocusableItem
              key={game.id}
              id={`multi-tile-${index}`}
              dataNavUp={isTop ? 'multi-btn-4games' : `multi-tile-${index - 2}`}
              dataNavDown={isTop && layoutMode === '4' ? `multi-tile-${index + 2}` : undefined}
              dataNavLeft={isLeft ? 'rail-multiview' : `multi-tile-${index - 1}`}
              dataNavRight={isLeft ? `multi-tile-${index + 1}` : undefined}
              onSelect={() => handleTileEnter(game)}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#181822] to-[#0f0f15] border-2 p-5 flex flex-col justify-between group transition-all ${
                hasSound
                  ? 'border-[#a3e635] shadow-[0_0_25px_rgba(163,230,53,0.35)]'
                  : 'border-zinc-800'
              }`}
            >
              {(isFocused) => (
                <>
                  {/* Subtle simulated video canvas background */}
                  <div className="absolute inset-0 tv-scanlines opacity-20 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

                  {/* Top Bar on Tile: Sound Badge + Status */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-xs font-mono font-bold text-zinc-300 border border-zinc-700">
                        {game.channel}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-[11px] font-mono font-semibold text-zinc-400">
                        {game.clock}
                      </span>
                    </div>

                    {/* Sound Badge (Enter moves sound to this tile) */}
                    {hasSound ? (
                      <div className="px-3 py-1 rounded-full bg-[#a3e635] text-black font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.8)] animate-pulse">
                        <Volume2 className="w-4 h-4 stroke-[2.5]" />
                        <span>SOUND ON</span>
                        {/* Mini animated equalizer */}
                        <div className="flex items-end gap-0.5 h-3 ml-1">
                          <span className="w-0.5 h-3 bg-black rounded-full animate-bounce" />
                          <span className="w-0.5 h-2 bg-black rounded-full animate-pulse" />
                          <span className="w-0.5 h-3.5 bg-black rounded-full animate-bounce delay-100" />
                        </div>
                      </div>
                    ) : (
                      <div className="px-2.5 py-1 rounded-full bg-zinc-900/80 text-zinc-400 text-xs font-medium flex items-center gap-1.5 border border-zinc-700/60">
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Press Enter for Audio</span>
                      </div>
                    )}
                  </div>

                  {/* Center Matchup & Visualizer */}
                  <div className="relative z-10 my-auto py-2">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff7a1a] mb-1">
                      {game.league}
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">
                      {game.awayTeam.name} vs {game.homeTeam.name}
                    </h3>
                  </div>

                  {/* Bottom Score & Status on Tile */}
                  <div className="relative z-10 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-zinc-950/80 px-4 py-2 rounded-xl border border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-300">{game.awayTeam.shortName}</span>
                        <span className="font-teko text-2xl font-bold text-white">
                          {spoilerFree ? '–' : game.awayTeam.score}
                        </span>
                      </div>
                      <span className="text-zinc-600 font-bold">•</span>
                      <div className="flex items-center gap-2">
                        <span className="font-teko text-2xl font-bold text-[#ff7a1a]">
                          {spoilerFree ? '–' : game.homeTeam.score}
                        </span>
                        <span className="text-xs font-bold text-zinc-300">{game.homeTeam.shortName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGoToSquares(game.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-[#ff7a1a] hover:text-white text-xs font-bold text-zinc-300 transition-colors"
                      >
                        Squares
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPlayer(game);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#ff7a1a] text-white text-xs font-bold shadow-md hover:brightness-110"
                      >
                        Watch Full
                      </button>
                    </div>
                  </div>
                </>
              )}
            </FocusableItem>
          );
        })}
      </div>
    </div>
  );
};
