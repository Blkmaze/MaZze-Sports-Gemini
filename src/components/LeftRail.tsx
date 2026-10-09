import React, { useState } from 'react';
import { 
  Home, 
  LayoutGrid, 
  Tv, 
  Grid3X3, 
  Trophy, 
  ChevronDown, 
  ChevronRight,
  Flame,
  Radio,
  Clock
} from 'lucide-react';
import { FocusableItem } from './common/FocusableItem';
import { NavScreen, SportCategory } from '../types';

interface LeftRailProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen, sportFilter?: SportCategory) => void;
  selectedSportFilter?: SportCategory | null;
  liveCount?: number;
  sportCounts?: Record<string, number>;
}

export const LeftRail: React.FC<LeftRailProps> = ({
  currentScreen,
  onNavigate,
  selectedSportFilter,
  liveCount = 0,
  sportCounts = {},
}) => {
  const [mySportsOpen, setMySportsOpen] = useState(true);

  const sportsList: { name: SportCategory; icon: string }[] = [
    { name: 'Football', icon: '🏈' },
    { name: 'Basketball', icon: '🏀' },
    { name: 'Soccer', icon: '⚽' },
    { name: 'Hockey', icon: '🏒' },
    { name: 'Baseball', icon: '⚾' },
  ];

  return (
    <aside className="w-80 h-full bg-[#121217]/95 border-r border-zinc-800/80 flex flex-col justify-between shrink-0 z-30 select-none p-6">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3.5 mb-8 px-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff7a1a] via-[#ea580c] to-[#9a3412] flex items-center justify-center shadow-[0_0_20px_rgba(255,122,26,0.5)]">
            <Flame className="w-7 h-7 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-teko text-3xl font-bold tracking-wider text-white uppercase leading-none">
                MaZze
              </span>
              <span className="font-teko text-3xl font-bold tracking-wider text-[#ff7a1a] uppercase leading-none">
                Sports
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse"></span>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
                1080p TV Edition
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col space-y-2.5">
          {/* Home */}
          <FocusableItem
            id="rail-home"
            dataNavRight="home-preview"
            dataNavDown="rail-multiview"
            onSelect={() => onNavigate('home')}
            className={`w-full rounded-xl px-4 py-3.5 flex items-center justify-between transition-all ${
              currentScreen === 'home' && !selectedSportFilter
                ? 'bg-zinc-800/90 text-white'
                : 'bg-zinc-900/40 text-zinc-300 hover:text-white'
            }`}
          >
            {(isFocused) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3.5">
                  <Home className={`w-5 h-5 ${isFocused || currentScreen === 'home' ? 'text-[#ff7a1a]' : 'text-zinc-400'}`} />
                  <span className="text-lg font-bold tracking-wide">Home</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#a3e635]/15 text-[#a3e635] text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-ping" />
                  Live
                </div>
              </div>
            )}
          </FocusableItem>

          {/* Multiview */}
          <FocusableItem
            id="rail-multiview"
            dataNavRight="home-preview"
            dataNavUp="rail-home"
            dataNavDown="rail-channels"
            onSelect={() => onNavigate('multiview')}
            className={`w-full rounded-xl px-4 py-3.5 flex items-center justify-between transition-all ${
              currentScreen === 'multiview'
                ? 'bg-zinc-800/90 text-white'
                : 'bg-zinc-900/40 text-zinc-300 hover:text-white'
            }`}
          >
            {(isFocused) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3.5">
                  <LayoutGrid className={`w-5 h-5 ${isFocused || currentScreen === 'multiview' ? 'text-[#ff7a1a]' : 'text-zinc-400'}`} />
                  <span className="text-lg font-bold tracking-wide">Multiview</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-bold">
                  2x2 Quad
                </span>
              </div>
            )}
          </FocusableItem>

          {/* Channels */}
          <FocusableItem
            id="rail-channels"
            dataNavRight="home-preview"
            dataNavUp="rail-multiview"
            dataNavDown="rail-squares"
            onSelect={() => onNavigate('channels')}
            className={`w-full rounded-xl px-4 py-3.5 flex items-center justify-between transition-all ${
              currentScreen === 'channels'
                ? 'bg-zinc-800/90 text-white'
                : 'bg-zinc-900/40 text-zinc-300 hover:text-white'
            }`}
          >
            {(isFocused) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3.5">
                  <Tv className={`w-5 h-5 ${isFocused || currentScreen === 'channels' ? 'text-[#ff7a1a]' : 'text-zinc-400'}`} />
                  <span className="text-lg font-bold tracking-wide">Channels</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-bold">
                  8 Live
                </span>
              </div>
            )}
          </FocusableItem>

          {/* Squares */}
          <FocusableItem
            id="rail-squares"
            dataNavRight="home-preview"
            dataNavUp="rail-channels"
            dataNavDown="rail-mysports-toggle"
            onSelect={() => onNavigate('squares')}
            className={`w-full rounded-xl px-4 py-3.5 flex items-center justify-between transition-all ${
              currentScreen === 'squares'
                ? 'bg-zinc-800/90 text-white'
                : 'bg-zinc-900/40 text-zinc-300 hover:text-white'
            }`}
          >
            {(isFocused) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3.5">
                  <Grid3X3 className={`w-5 h-5 ${isFocused || currentScreen === 'squares' ? 'text-[#ff7a1a]' : 'text-zinc-400'}`} />
                  <span className="text-lg font-bold tracking-wide">Squares</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#ff7a1a]/20 text-[#ff7a1a] text-xs font-extrabold uppercase">
                  10x10 Pool
                </span>
              </div>
            )}
          </FocusableItem>

          {/* My Sports Accordion Header */}
          <FocusableItem
            id="rail-mysports-toggle"
            dataNavRight="home-preview"
            dataNavUp="rail-squares"
            dataNavDown={mySportsOpen ? 'rail-sport-Football' : 'rail-home'}
            onSelect={() => setMySportsOpen(!mySportsOpen)}
            className="w-full rounded-xl px-4 py-3 flex items-center justify-between bg-zinc-900/30 text-zinc-300 hover:text-white mt-2"
          >
            {(isFocused) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3.5">
                  <Trophy className={`w-5 h-5 ${isFocused ? 'text-[#ff7a1a]' : 'text-[#a3e635]'}`} />
                  <span className="text-base font-bold tracking-wide">My Sports</span>
                </div>
                {mySportsOpen ? (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            )}
          </FocusableItem>

          {/* Subitems for My Sports */}
          {mySportsOpen && (
            <div className="pl-3 flex flex-col space-y-1.5 border-l-2 border-zinc-800 ml-5 my-1">
              {sportsList.map((sport, index) => {
                const prevId = index === 0 ? 'rail-mysports-toggle' : `rail-sport-${sportsList[index - 1].name}`;
                const nextId = index === sportsList.length - 1 ? undefined : `rail-sport-${sportsList[index + 1].name}`;
                const isSelected = selectedSportFilter === sport.name;

                return (
                  <FocusableItem
                    key={sport.name}
                    id={`rail-sport-${sport.name}`}
                    dataNavRight="home-preview"
                    dataNavUp={prevId}
                    dataNavDown={nextId}
                    onSelect={() => onNavigate('mysports', sport.name)}
                    className={`w-full rounded-lg px-3 py-2 text-sm flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#ff7a1a]/20 text-[#ff7a1a] font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {() => (
                      <div className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2.5">
                          <span>{sport.icon}</span>
                          <span className="font-semibold">{sport.name}</span>
                        </span>
                        <span className="text-[11px] font-mono-num text-zinc-500">
                          {sportCounts[sport.name] || 0} games
                        </span>
                      </div>
                    )}
                  </FocusableItem>
                );
              })}
            </div>
          )}
        </nav>
      </div>

      {/* TV Remote Helper / Status Footer */}
      <div className="pt-4 border-t border-zinc-800/80">
        <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Remote Guide</span>
            <span className="text-[#a3e635] font-mono-num">CONNECTED</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono-num font-bold">▲▼◄►</span>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-[#ff7a1a]/30 text-[#ff7a1a] font-mono-num font-bold">ENTER</span>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono-num font-bold">ESC</span>
              <span>Back</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-[#a3e635]/20 text-[#a3e635] font-mono-num font-bold">5</span>
              <span>Squares</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
