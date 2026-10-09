/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  CHANNELS_DATA 
} from './data/mockData';
import { NavScreen, SportCategory, GameItem, ChannelItem, UserTeam } from './types';
import { fetchAllESPNScoreboards, deriveUpNextTeams } from './services/espnService';
import { Maximize, Minimize } from 'lucide-react';

const TVAppContent: React.FC = () => {
  const { setFocusedId } = useSpatialNav();
  const { showToast } = useToast();

  const [currentScreen, setCurrentScreen] = useState<NavScreen>('home');
  const [selectedSportFilter, setSelectedSportFilter] = useState<SportCategory | null>(null);
  const [activePlayerGame, setActivePlayerGame] = useState<GameItem | null>(null);
  const [spoilerFree, setSpoilerFree] = useState<boolean>(false);
  const [squaresSelectedGameId, setSquaresSelectedGameId] = useState<string>('');

  // Real-time ESPN Scoreboard Data State
  const [games, setGames] = useState<GameItem[]>(LIVE_GAMES);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const isFirstFetchRef = useRef<boolean>(true);

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

  // Format current time as hh:mm:ss
  const formatCurrentTimestamp = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };

  // Real-time ESPN Fetcher: Runs immediately and every 20 seconds
  const fetchLiveScoreboardData = useCallback(async () => {
    try {
      const result = await fetchAllESPNScoreboards();
      if (result.games && result.games.length > 0) {
        // Update in place without losing focus or resetting navigation
        setGames(result.games);
        setLastUpdatedTime(formatCurrentTimestamp());
        setIsOffline(false);
        if (isFirstFetchRef.current) {
          isFirstFetchRef.current = false;
        }
      } else {
        // If fetch returns empty or fails, keep the last data and mark offline
        setIsOffline(true);
        if (!lastUpdatedTime) {
          setLastUpdatedTime(formatCurrentTimestamp());
        }
      }
    } catch (err) {
      console.error('ESPN fetch failed:', err);
      // Keep last data, show offline note
      setIsOffline(true);
    }
  }, [lastUpdatedTime]);

  // Initial load and 20s interval timer
  useEffect(() => {
    fetchLiveScoreboardData();
    const interval = setInterval(fetchLiveScoreboardData, 20000);
    return () => clearInterval(interval);
  }, [fetchLiveScoreboardData]);

  // Derived datasets from real ESPN data
  const featuredGame = useMemo(() => {
    return games[0] || FEATURED_GAME;
  }, [games]);

  const upNextTeams = useMemo(() => {
    const derived = deriveUpNextTeams(games);
    return derived.length > 0 ? derived : YOUR_TEAMS;
  }, [games]);

  const liveCount = useMemo(() => {
    return games.filter((g) => g.gameState === 'in').length;
  }, [games]);

  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    games.forEach((g) => {
      counts[g.sport] = (counts[g.sport] || 0) + 1;
    });
    return counts;
  }, [games]);

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
      } else if (games[0]) {
        setSquaresSelectedGameId(games[0].id);
      }
      setActivePlayerGame(null);
      setCurrentScreen('squares');
      setTimeout(() => setFocusedId('game-pick-0'), 50);
      showToast('Squares Loaded', '10x10 Board ready. Top 10 ESPN games available.', 'success', 3000);
    },
    [games, setFocusedId, showToast]
  );

  // Open Full Screen Player
  const handleOpenPlayer = useCallback((game: GameItem) => {
    setActivePlayerGame(game);
  }, []);

  // Open Player from Channels guide
  const handleOpenPlayerWithChannel = useCallback((channel: ChannelItem) => {
    const matchingGame = games.find((g) => g.channel.toLowerCase().includes(channel.name.slice(0, 4).toLowerCase())) || games[0] || FEATURED_GAME;
    setActivePlayerGame({
      ...matchingGame,
      channel: `${channel.name} (CH ${channel.number})`,
      headline: channel.currentShow.title,
    });
  }, [games]);

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
      handleGoToSquares(activePlayerGame?.id || featuredGame.id);
    };

    window.addEventListener('tv-remote-back', handleBackAction);
    window.addEventListener('tv-remote-key5', handleKey5Action);
    return () => {
      window.removeEventListener('tv-remote-back', handleBackAction);
      window.removeEventListener('tv-remote-key5', handleKey5Action);
    };
  }, [activePlayerGame, currentScreen, selectedSportFilter, handleGoToSquares, featuredGame, setFocusedId, showToast]);

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
          liveCount={liveCount}
          sportCounts={sportCounts}
        />

        {/* Main TV Screens */}
        <main className="flex-1 h-full relative overflow-hidden flex flex-col">
          {currentScreen === 'home' && (
            <HomeScreen
              featuredGame={featuredGame}
              liveGames={games}
              yourTeams={upNextTeams}
              spoilerFree={spoilerFree}
              onToggleSpoilerFree={() => {
                const next = !spoilerFree;
                setSpoilerFree(next);
                showToast(
                  'Spoiler-Free Mode',
                  next ? 'Real scores hidden! Tension ratings active.' : 'Scores revealed.',
                  'info',
                  2500
                );
              }}
              onOpenPlayer={handleOpenPlayer}
              onGoToSquares={handleGoToSquares}
              sportFilter={selectedSportFilter}
              updatedTime={lastUpdatedTime}
              isOffline={isOffline}
            />
          )}

          {currentScreen === 'multiview' && (
            <MultiviewScreen
              games={games}
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
            <SquaresScreen
              initialGameId={squaresSelectedGameId || games[0]?.id}
              games={games}
            />
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
