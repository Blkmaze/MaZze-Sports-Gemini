import React, { useState } from 'react';
import { 
  Tv, 
  Radio, 
  Volume2, 
  Play, 
  Clock, 
  Sparkles, 
  Film, 
  Check, 
  Flame,
  Maximize2
} from 'lucide-react';
import { ChannelItem, GameItem } from '../types';
import { FocusableItem } from './common/FocusableItem';
import { useToast } from '../context/ToastContext';

interface ChannelsScreenProps {
  channels: ChannelItem[];
  onOpenPlayerWithChannel: (channel: ChannelItem) => void;
}

export const ChannelsScreen: React.FC<ChannelsScreenProps> = ({
  channels,
  onOpenPlayerWithChannel,
}) => {
  const { showToast } = useToast();
  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id || 'ch-201');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const categories = ['ALL', 'FOOTBALL', 'HOOPS', 'SOCCER', 'COMBAT', 'HOCKEY', 'A-Z'];

  const filteredChannels = channels.filter((ch) => {
    if (activeFilter === 'ALL' || activeFilter === 'A-Z') return true;
    if (activeFilter === 'FOOTBALL') return ch.category === 'Football';
    if (activeFilter === 'HOOPS') return ch.category === 'Basketball';
    if (activeFilter === 'SOCCER') return ch.category === 'Soccer';
    if (activeFilter === 'COMBAT') return ch.category === 'Fights';
    if (activeFilter === 'HOCKEY') return ch.category === 'Hockey';
    return true;
  });

  const selectedChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];

  return (
    <div className="flex-1 h-full flex flex-col p-8 overflow-hidden select-none bg-[#0d0d10]">
      {/* Top Header & A-Z Strip */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#ff7a1a] flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5" />
            DIRECT SATELLITE & IP BROADCAST
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Sports Channels Guide
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#a3e635]/20 text-[#a3e635] border border-[#a3e635]/40">
              8 CHANNELS STREAMING
            </span>
          </h1>
        </div>

        {/* A-Z / Category Filter Strip */}
        <div className="flex items-center gap-2 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800">
          {categories.map((cat, index) => {
            const isSelected = activeFilter === cat;
            return (
              <FocusableItem
                key={cat}
                id={`cat-filter-${cat}`}
                dataNavDown="channel-row-0"
                dataNavLeft={index === 0 ? 'rail-channels' : `cat-filter-${categories[index - 1]}`}
                dataNavRight={index === categories.length - 1 ? undefined : `cat-filter-${categories[index + 1]}`}
                onSelect={() => {
                  setActiveFilter(cat);
                  showToast('Guide Filter', `Showing ${cat} channels`, 'info', 2000);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                  isSelected
                    ? 'bg-[#ff7a1a] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {() => <span>{cat}</span>}
              </FocusableItem>
            );
          })}
        </div>
      </div>

      {/* Main Split: 8 Channels on Left (Col 5) vs Channel Preview & Info on Right (Col 7) */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left List of Channels (Col 5) */}
        <div className="col-span-5 flex flex-col h-full bg-[#13131a] rounded-2xl border border-zinc-800 p-4 overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">
            <span>Channel & Number</span>
            <span>Current Broadcast</span>
          </div>

          <div className="flex-1 flex flex-col space-y-2 overflow-y-auto pr-1">
            {filteredChannels.map((ch, index) => {
              const isCurrent = ch.id === selectedChannel.id;
              const prevId = index === 0 ? 'cat-filter-ALL' : `channel-row-${index - 1}`;
              const nextId = index === filteredChannels.length - 1 ? undefined : `channel-row-${index + 1}`;

              return (
                <FocusableItem
                  key={ch.id}
                  id={`channel-row-${index}`}
                  dataNavLeft="rail-channels"
                  dataNavRight="channel-preview-play"
                  dataNavUp={prevId}
                  dataNavDown={nextId}
                  onSelect={() => {
                    setSelectedChannelId(ch.id);
                  }}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-zinc-800/90 border-[#ff7a1a]/60 shadow-md'
                      : 'bg-zinc-900/50 border-zinc-800/60 hover:bg-zinc-800/50'
                  }`}
                >
                  {(isFocused) => (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] font-mono text-zinc-500 font-bold leading-none">
                            CH
                          </span>
                          <span className="text-sm font-bold text-[#ff7a1a] leading-none mt-0.5">
                            {ch.number}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            {ch.name}
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                              {ch.logoBadge}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 truncate max-w-[200px] mt-0.5">
                            {ch.currentShow.title}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="w-2 h-2 rounded-full bg-[#a3e635] inline-block mb-1" />
                        <div className="text-[11px] font-mono text-zinc-400">
                          {ch.currentShow.startTime}
                        </div>
                      </div>
                    </div>
                  )}
                </FocusableItem>
              );
            })}
          </div>
        </div>

        {/* Right Preview and Info (Col 7) */}
        <div className="col-span-7 flex flex-col h-full bg-[#14141e] rounded-2xl border border-zinc-800 overflow-hidden p-6 justify-between">
          {/* Channel Video Preview Box */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-black border border-zinc-700/80 shadow-2xl flex flex-col justify-between p-5">
            <div className="absolute inset-0 tv-scanlines opacity-40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70 pointer-events-none" />

            {/* Top Preview Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded bg-[#ff7a1a] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,122,26,0.7)]">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  TUNED IN: CH {selectedChannel.number}
                </span>
                <span className="font-teko text-2xl font-bold text-white tracking-wide">
                  {selectedChannel.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-zinc-900/90 text-[#a3e635] text-xs font-mono font-bold border border-zinc-700">
                  {selectedChannel.resolution}
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-300 text-xs font-mono border border-zinc-700">
                  {selectedChannel.audio}
                </span>
              </div>
            </div>

            {/* Center Live Simulation */}
            <div className="relative z-10 my-auto text-center">
              <h2 className="text-2xl font-extrabold text-white">
                {selectedChannel.currentShow.title}
              </h2>
              <p className="text-zinc-300 text-xs mt-1 max-w-lg mx-auto">
                {selectedChannel.currentShow.description}
              </p>
            </div>

            {/* Bottom Preview Timeline Bar */}
            <div className="relative z-10">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1.5">
                <span>{selectedChannel.currentShow.startTime}</span>
                <span className="text-[#a3e635] font-bold">
                  {selectedChannel.currentShow.progressPercent}% Elapsed
                </span>
                <span>{selectedChannel.currentShow.endTime}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff7a1a] to-[#a3e635] rounded-full transition-all duration-500"
                  style={{ width: `${selectedChannel.currentShow.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Program Information & Schedule Details */}
          <div className="my-4 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#ff7a1a] mb-1">
              Next on {selectedChannel.callSign}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">
                  {selectedChannel.nextShow.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Scheduled for {selectedChannel.nextShow.startTime}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                  Auto-Record Set
                </span>
              </div>
            </div>
          </div>

          {/* Action Button: Tune into Full Screen */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-zinc-400">
              Press <span className="font-bold text-white font-mono bg-zinc-800 px-1.5 py-0.5 rounded">ENTER</span> to watch live in Full Screen
            </div>

            <FocusableItem
              id="channel-preview-play"
              dataNavLeft="channel-row-0"
              onSelect={() => onOpenPlayerWithChannel(selectedChannel)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff7a1a] to-[#ea580c] text-white font-bold text-sm shadow-[0_0_20px_rgba(255,122,26,0.6)] flex items-center gap-2"
            >
              {() => (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>Watch Full Broadcast</span>
                </>
              )}
            </FocusableItem>
          </div>
        </div>
      </div>
    </div>
  );
};
