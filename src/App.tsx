/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SpatialNavProvider, useSpatialNav } from './context/SpatialNavContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { LeftRail } from './components/LeftRail';
import { HomeScreen } from './components/HomeScreen';
import { MultiviewScreen } from './components/MultiviewScreen';
import { ChannelsScreen } from './components/ChannelsScreen';
import { SquaresScreen } from './components/SquaresScreen';
import { PlayerOverlay } from './components/PlayerOverlay';
import { ToastContainer } from './components/ToastContainer';
import { TVRemoteWidget } from './components/TVRemoteWidget';
import { 
  FEATURED_GAME, 
  LIVE_GAMES, 
  YOUR_TEAMS, 
  CHANNELS_DATA, 
  SQUARES_GAMES 
} from './data/mockData';
import { NavScreen, SportCategory, GameItem, ChannelItem } from './types';
import { Maximize, Minimize } from 'lucide-react';

const TVAppContent: React.FC = () => {
  const { setFocusedId } = useSpatialNav();
  const { showToast } = useToast();

  const [currentScreen, setCurrentScreen] = useState<NavScreen>('home');
  const [selectedSportFilter, setSelectedSportFilter] = useState<SportCategory | null>(null);
  const [activePlayerGame, setActivePlayerGame] = useState<GameItem | null>(null);
  const [spoilerFree, setSpoilerFree] = useState<boolean>(false);
  const [squaresSelectedGameId, setSquaresSelectedGameId] = useState<string>(SQUARES_GAMES[0].id);

  // Viewport 1920x1080 auto-scaling for TV display fidelity
  const [scale, setScale] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const targetWidth = 1920;
      const targetHeight = 1080;
      const availableWidth = window.innerWidth;
      const availableHeight = window.innerHeight;

      const scaleX = availableWidth / targetWidth;
      const scaleY = availableHeight / targetHeight;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle navigation
  const handleNavigate = useCallback(
    (screen: NavScreen, sport?: SportCategory) => {
      setCurrentScreen(screen);
      if (sport) {
        setSelectedSportFilter(sport);
        showToast('Sport Filter', `Filtered to ${sport}`, 'info', 2000);
      } else {
        setSelectedSportFilter(null);
      }

      // Restore intelligent focus when switching screens
      if (screen === 'home') {
        setTimeout(() => setFocusedId('home-preview'), 50);
      } else if (screen === 'multiview') {
        setTimeout(() => setFocusedId('multi-tile-0'), 50);
      } else if (screen === 'channels') {
        setTimeout(() => setFocusedId('channel-row-0'), 50);
      } else if (screen === 'squares') {
        setTimeout(() => setFocusedId('game-pick-0'), 50);
      }
    },
    [setFocusedId, showToast]
  );

  // Jump to Squares from any game (e.g. key 5 or button)
  const handleGoToSquares = useCallback(
    (gameId?: string) => {
      if (gameId) {
        setSquaresSelectedGameId(gameId);
      }
      setActivePlayerGame(null);
      setCurrentScreen('squares');
      setTimeout(() => setFocusedId('game-pick-0'), 50);
      showToast('Squares Loaded', '10x10 Board ready. Use arrow keys to select your squares.', 'success', 3000);
    },
    [setFocusedId, showToast]
  );

  // Open Full Screen Player
  const handleOpenPlayer = useCallback((game: GameItem) => {
    setActivePlayerGame(game);
  }, []);

  // Open Player from Channels guide
  const handleOpenPlayerWithChannel = useCallback((channel: ChannelItem) => {
    // Find or simulate corresponding live game
    const matchingGame = LIVE_GAMES.find((g) => g.channel.includes(channel.name.slice(0, 4))) || FEATURED_GAME;
    setActivePlayerGame({
      ...matchingGame,
      channel: `${channel.name} (CH ${channel.number})`,
      headline: channel.currentShow.title,
    });
  }, []);

  // Back button handler (Escape or Backspace or TV remote back)
  useEffect(() => {
    const handleBackAction = () => {
      if (activePlayerGame) {
        setActivePlayerGame(null);
        showToast('Player Closed', 'Returned to TV guide', 'info', 1500);
      } else if (currentScreen !== 'home' || selectedSportFilter !== null) {
        setCurrentScreen('home');
        setSelectedSportFilter(null);
        setFocusedId('rail-home');
        showToast('Home', 'Navigated back to Home', 'info', 1500);
      }
    };

    const handleKey5Action = () => {
      handleGoToSquares(activePlayerGame?.id || FEATURED_GAME.id);
    };

    window.addEventListener('tv-remote-back', handleBackAction);
    window.addEventListener('tv-remote-key5', handleKey5Action);
    return () => {
      window.removeEventListener('tv-remote-back', handleBackAction);
      window.removeEventListener('tv-remote-key5', handleKey5Action);
    };
  }, [activePlayerGame, currentScreen, selectedSportFilter, handleGoToSquares, setFocusedId, showToast]);

  const toggleFullScreenBrowser = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullScreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullScreen(false)).catch(() => {});
    }
  };

  return (
    <div className="w-screen h-screen bg-[#060608] flex items-center justify-center overflow-hidden">
      {/* 1920x1080 Native TV Canvas Container */}
      <div
        id="tv-viewport"
        className="relative bg-[#0d0d10] text-zinc-100 flex overflow-hidden shadow-2xl border border-zinc-800"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
        }}
      >
        {/* Left Rail Menu */}
        <LeftRail
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          selectedSportFilter={selectedSportFilter}
        />

        {/* Main TV Screens */}
        <main className="flex-1 h-full relative overflow-hidden flex flex-col">
          {currentScreen === 'home' && (
            <HomeScreen
              featuredGame={FEATURED_GAME}
              liveGames={LIVE_GAMES}
              yourTeams={YOUR_TEAMS}
              spoilerFree={spoilerFree}
              onToggleSpoilerFree={() => {
                const next = !spoilerFree;
                setSpoilerFree(next);
                showToast(
                  'Spoiler-Free Mode',
                  next ? 'Scores hidden! Tension ratings active.' : 'Scores revealed.',
                  'info',
                  2500
                );
              }}
              onOpenPlayer={handleOpenPlayer}
              onGoToSquares={handleGoToSquares}
              sportFilter={selectedSportFilter}
            />
          )}

          {currentScreen === 'multiview' && (
            <MultiviewScreen
              games={LIVE_GAMES}
              spoilerFree={spoilerFree}
              onOpenPlayer={handleOpenPlayer}
              onGoToSquares={handleGoToSquares}
            />
          )}

          {currentScreen === 'channels' && (
            <ChannelsScreen
              channels={CHANNELS_DATA}
              onOpenPlayerWithChannel={handleOpenPlayerWithChannel}
            />
          )}

          {currentScreen === 'squares' && (
            <SquaresScreen initialGameId={squaresSelectedGameId} />
          )}

          {/* Full-Screen Player Overlay (Opens on Enter on Preview, Esc closes, 5 jumps to Squares) */}
          {activePlayerGame && (
            <PlayerOverlay
              game={activePlayerGame}
              spoilerFree={spoilerFree}
              onClose={() => setActivePlayerGame(null)}
              onGoToSquares={handleGoToSquares}
            />
          )}
        </main>

        {/* TV Status Pill & Fullscreen Toggle in Top Right */}
        <div className="absolute top-4 right-6 z-30 flex items-center gap-3">
          <button
            onClick={toggleFullScreenBrowser}
            className="px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Toggle Browser Fullscreen"
          >
            {isFullScreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5 text-[#ff7a1a]" />}
            <span>{isFullScreen ? 'Exit 1080p' : '1080p TV View'}</span>
          </button>
        </div>

        {/* Global Toast Notifications */}
        <ToastContainer />

        {/* Interactive Virtual TV Remote Overlay */}
        <TVRemoteWidget />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SpatialNavProvider>
      <ToastProvider>
        <TVAppContent />
      </ToastProvider>
    </SpatialNavProvider>
  );
}
