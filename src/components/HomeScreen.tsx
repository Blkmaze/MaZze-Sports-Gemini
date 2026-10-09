import React from 'react';
import { 
  Play, 
  Grid3X3, 
  Eye, 
  EyeOff, 
  Volume2, 
  Flame, 
  Maximize2,
  Clock,
  Sparkles,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { FocusableItem } from './common/FocusableItem';
import { GameItem, UserTeam, SportCategory } from '../types';

interface HomeScreenProps {
  featuredGame: GameItem;
  liveGames: GameItem[];
  yourTeams: UserTeam[];
  spoilerFree: boolean;
  onToggleSpoilerFree: () => void;
  onOpenPlayer: (game: GameItem) => void;
  onGoToSquares: (gameId?: string) => void;
  sportFilter?: SportCategory | null;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  featuredGame,
  liveGames,
  yourTeams,
  spoilerFree,
  onToggleSpoilerFree,
  onOpenPlayer,
  onGoToSquares,
  sportFilter,
}) => {
  const filteredGames = sportFilter
    ? liveGames.filter((g) => g.sport === sportFilter)
    : liveGames;

  return (
    <div className="flex-1 h-full flex flex-col p-8 overflow-hidden select-none bg-[#0d0d10]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#ff7a1a] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              {sportFilter ? `${sportFilter.toUpperCase()} HUB` : 'MAZZE ARENA PRIMETIME'}
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Live Sports Central
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#a3e635]/20 text-[#a3e635] border border-[#a3e635]/40 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-ping" />
                5 LIVE NOW
              </span>
            </h1>
          </div>
        </div>

        {/* Spoiler-Free Toggle Button */}
        <div className="flex items-center gap-3">
          <FocusableItem
            id="home-spoiler-toggle"
            dataNavLeft="rail-home"
            dataNavDown="home-preview"
            dataNavRight="home-preview-squares"
            onSelect={onToggleSpoilerFree}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
              spoilerFree
                ? 'bg-[#a3e635]/15 border-[#a3e635] text-[#a3e635]'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            {(isFocused) => (
              <div className="flex items-center gap-2.5">
                {spoilerFree ? (
                  <EyeOff className="w-4 h-4 text-[#a3e635]" />
                ) : (
                  <Eye className="w-4 h-4 text-zinc-400" />
                )}
                <span className="text-sm font-bold uppercase tracking-wider">
                  Spoiler-Free: {spoilerFree ? 'ON' : 'OFF'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    spoilerFree ? 'bg-[#a3e635]' : 'bg-zinc-600'
                  }`}
                />
              </div>
            )}
          </FocusableItem>
        </div>
      </div>

      {/* Main Grid: Live Preview (Left) + Your Teams (Right) */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 mb-6">
        {/* Large Live Preview Window (Col 8) */}
        <div className="col-span-8 flex flex-col h-full">
          <FocusableItem
            id="home-preview"
            dataNavLeft="rail-home"
            dataNavUp="home-spoiler-toggle"
            dataNavRight="home-preview-squares"
            dataNavDown="home-score-0"
            onSelect={() => onOpenPlayer(featuredGame)}
            className="relative flex-1 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#181822] to-[#101016] border-zinc-800 flex flex-col justify-between group p-6 shadow-2xl"
          >
            {(isFocused) => (
              <>
                {/* Stadium background simulation / field canvas overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-zinc-950/70 to-[#0d0d10] pointer-events-none" />
                
                {/* Simulated stadium field graphics / visualizer */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="w-full h-full border border-zinc-700/30 flex items-center justify-around">
                    <div className="w-px h-full bg-zinc-600/30"></div>
                    <div className="w-28 h-28 rounded-full border border-zinc-600/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white/40"></div>
                    </div>
                    <div className="w-px h-full bg-zinc-600/30"></div>
                  </div>
                </div>

                {/* Top Overlay: Live Tag + Channel + Resolution */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-md bg-[#ff7a1a] text-white font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(255,122,26,0.8)]">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      LIVE BROADCAST
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-700/80 text-xs font-mono text-zinc-300">
                      {featuredGame.channel}
                    </div>
                    <div className="px-2 py-1 rounded-md bg-[#a3e635]/20 text-[#a3e635] text-xs font-mono font-bold">
                      4K HDR 60FPS
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-zinc-700 text-xs text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-[#ff7a1a]" />
                    <span className="font-mono-num font-bold">{featuredGame.quarterOrPeriod} • {featuredGame.clock}</span>
                  </div>
                </div>

                {/* Center Broadcast Title & Matchup Spotlight */}
                <div className="relative z-10 my-auto py-2">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-[#a3e635] mb-1">
                    {featuredGame.headline}
                  </div>
                  <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {featuredGame.awayTeam.name} <span className="text-zinc-500 font-light">vs</span> {featuredGame.homeTeam.name}
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1 flex items-center gap-2">
                    <span>{featuredGame.venue}</span>
                    <span>•</span>
                    <span className="text-[#ff7a1a] font-semibold">Ball on SF 32 • 3rd & 4</span>
                  </p>
                </div>

                {/* Score Bar & Action Buttons */}
                <div className="relative z-10 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  {/* Score Bar */}
                  <div className="flex items-center gap-6 bg-zinc-950/70 backdrop-blur-md px-5 py-3 rounded-xl border border-zinc-800">
                    {/* Away Team */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-white text-xs shadow-md"
                        style={{ backgroundColor: featuredGame.awayTeam.logoColor }}
                      >
                        {featuredGame.awayTeam.shortName}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white leading-none">
                          {featuredGame.awayTeam.shortName}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {featuredGame.awayTeam.record}
                        </div>
                      </div>
                      <div className="font-teko text-3xl font-bold text-white px-2">
                        {spoilerFree ? (
                          <span className="text-xs font-sans text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                            HIDDEN
                          </span>
                        ) : (
                          featuredGame.awayTeam.score
                        )}
                      </div>
                    </div>

                    <div className="text-zinc-600 font-bold text-sm">vs</div>

                    {/* Home Team */}
                    <div className="flex items-center gap-3">
                      <div className="font-teko text-3xl font-bold text-[#ff7a1a] px-2">
                        {spoilerFree ? (
                          <span className="text-xs font-sans text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                            HIDDEN
                          </span>
                        ) : (
                          featuredGame.homeTeam.score
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white leading-none">
                          {featuredGame.homeTeam.shortName}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {featuredGame.homeTeam.record}
                        </div>
                      </div>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-white text-xs shadow-md"
                        style={{ backgroundColor: featuredGame.homeTeam.logoColor }}
                      >
                        {featuredGame.homeTeam.shortName}
                      </div>
                    </div>
                  </div>

                  {/* Preview Action Buttons */}
                  <div className="flex items-center gap-3">
                    {/* Dedicated Play Squares Button right on preview */}
                    <FocusableItem
                      id="home-preview-squares"
                      dataNavLeft="home-preview"
                      dataNavUp="home-spoiler-toggle"
                      dataNavRight="home-team-0"
                      dataNavDown="home-score-0"
                      onSelect={() => onGoToSquares(featuredGame.id)}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#ff7a1a] to-[#ea580c] text-white font-bold text-sm shadow-[0_0_20px_rgba(255,122,26,0.6)] flex items-center gap-2 hover:brightness-110"
                    >
                      {() => (
                        <>
                          <Grid3X3 className="w-4 h-4 text-white" />
                          <span>Play Squares</span>
                          <span className="px-1.5 py-0.2 rounded bg-black/30 text-[10px] font-mono-num ml-1 font-bold">
                            KEY 5
                          </span>
                        </>
                      )}
                    </FocusableItem>

                    {/* Watch Full Screen Button */}
                    <div className="px-4 py-3 rounded-xl bg-zinc-800/90 text-zinc-200 text-xs font-semibold flex items-center gap-2 border border-zinc-700">
                      <Maximize2 className="w-3.5 h-3.5 text-[#ff7a1a]" />
                      <span>Press [Enter] for Full Screen</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </FocusableItem>
        </div>

        {/* Your Teams Column (Col 4) */}
        <div className="col-span-4 flex flex-col h-full bg-[#13131a] rounded-2xl border border-zinc-800/80 p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <h3 className="font-extrabold text-lg text-white">Your Teams</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {yourTeams.length} Followed
            </span>
          </div>

          <div className="flex-1 flex flex-col space-y-2.5 overflow-hidden">
            {yourTeams.map((team, index) => {
              const prevTeamId = index === 0 ? 'home-spoiler-toggle' : `home-team-${index - 1}`;
              const nextTeamId = index === yourTeams.length - 1 ? undefined : `home-team-${index + 1}`;

              return (
                <FocusableItem
                  key={team.id}
                  id={`home-team-${index}`}
                  dataNavLeft="home-preview"
                  dataNavUp={prevTeamId}
                  dataNavDown={nextTeamId}
                  onSelect={() => {
                    // Match corresponding game if live
                    const matchGame = liveGames.find((g) => g.homeTeam.name.includes(team.teamName) || g.awayTeam.name.includes(team.teamName));
                    if (matchGame) onOpenPlayer(matchGame);
                  }}
                  className="p-3.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800/70 transition-all flex items-center justify-between"
                >
                  {(isFocused) => (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0"
                          style={{ backgroundColor: team.color }}
                        >
                          {team.teamName.substring(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">
                            {team.teamName}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                            {team.matchup}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse" />
                          <span className="text-xs font-bold text-[#a3e635]">
                            {team.status}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono-num text-zinc-400 mt-0.5">
                          {spoilerFree ? 'Game in Progress' : team.statusDetails}
                        </div>
                      </div>
                    </div>
                  )}
                </FocusableItem>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row of Live Score Cards */}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-300">
              Live Scores & Matchups
            </h3>
            <span className="text-xs text-zinc-500 font-mono-num">• Arrow Right to scroll cards</span>
          </div>
          {spoilerFree && (
            <div className="text-xs text-[#a3e635] flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Spoiler-Free Active (Scores Masked)
            </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-4">
          {filteredGames.map((game, index) => {
            const prevCardId = index === 0 ? 'rail-home' : `home-score-${index - 1}`;
            const nextCardId = index === filteredGames.length - 1 ? undefined : `home-score-${index + 1}`;

            return (
              <FocusableItem
                key={game.id}
                id={`home-score-${index}`}
                dataNavLeft={prevCardId}
                dataNavRight={nextCardId}
                dataNavUp="home-preview"
                onSelect={() => onOpenPlayer(game)}
                className="p-3.5 rounded-xl bg-[#14141d] border-zinc-800/80 flex flex-col justify-between hover:bg-zinc-800/60 transition-all shadow-md group"
              >
                {(isFocused) => (
                  <>
                    {/* League & Live Status */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-[#ff7a1a]">
                        {game.league}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono font-semibold text-zinc-300">
                        {game.clock}
                      </span>
                    </div>

                    {/* Away Team Row */}
                    <div className="flex items-center justify-between py-1 border-b border-zinc-800/40">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: game.awayTeam.logoColor }}
                        />
                        <span className="text-xs font-bold text-zinc-200">
                          {game.awayTeam.shortName}
                        </span>
                      </div>
                      <span className="font-teko text-xl font-bold text-white">
                        {spoilerFree ? '–' : game.awayTeam.score}
                      </span>
                    </div>

                    {/* Home Team Row */}
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: game.homeTeam.logoColor }}
                        />
                        <span className="text-xs font-bold text-zinc-200">
                          {game.homeTeam.shortName}
                        </span>
                      </div>
                      <span className="font-teko text-xl font-bold text-white">
                        {spoilerFree ? '–' : game.homeTeam.score}
                      </span>
                    </div>

                    {/* Footer: Excitement / Squares hint */}
                    <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                      {spoilerFree ? (
                        <span className="text-[#a3e635] font-semibold flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          Thrilling ({game.excitementScore}%)
                        </span>
                      ) : (
                        <span className="text-zinc-400 font-mono">
                          {game.quarterOrPeriod}
                        </span>
                      )}
                      <span className="text-[#ff7a1a] font-bold text-[10px] group-hover:underline">
                        Squares Pool →
                      </span>
                    </div>
                  </>
                )}
              </FocusableItem>
            );
          })}
        </div>
      </div>
    </div>
  );
};
