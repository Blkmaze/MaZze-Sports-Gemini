import React, { useState, useMemo, useEffect } from 'react';
import { 
  Grid3X3, 
  CreditCard, 
  DollarSign, 
  Trash2, 
  Sparkles, 
  ShieldAlert, 
  ExternalLink, 
  HelpCircle,
  CheckCircle,
  RefreshCw,
  Trophy,
  Info
} from 'lucide-react';
import { SquaresBoardState, GameItem } from '../types';
import { generateSquaresForESPNGame } from '../services/espnService';
import { FocusableItem } from './common/FocusableItem';
import { useToast } from '../context/ToastContext';

interface SquaresScreenProps {
  initialGameId?: string;
  games?: GameItem[];
}

export const SquaresScreen: React.FC<SquaresScreenProps> = ({
  initialGameId,
  games = [],
}) => {
  const { showToast } = useToast();

  // Pick top 10 real games from ESPN
  const pickerGames = useMemo(() => {
    return games.slice(0, 10);
  }, [games]);

  // Active game selection
  const [selectedGameId, setSelectedGameId] = useState<string>(() => {
    return initialGameId || (pickerGames[0]?.id ?? 'default-game');
  });

  // When initialGameId changes from outside navigation
  useEffect(() => {
    if (initialGameId) {
      setSelectedGameId(initialGameId);
    }
  }, [initialGameId]);

  // Active game object
  const activeGame = useMemo(() => {
    return (
      pickerGames.find((g) => g.id === selectedGameId) ||
      games.find((g) => g.id === selectedGameId) ||
      pickerGames[0] || {
        id: 'default-game',
        sport: 'Football',
        league: 'NFL',
        awayTeam: { name: 'San Francisco 49ers', shortName: 'SF', logoColor: '#AA0000', score: 21 },
        homeTeam: { name: 'Kansas City Chiefs', shortName: 'KC', logoColor: '#E31837', score: 24 },
        gameState: 'in',
        shortDetail: '3rd - 8:42',
        startTime: new Date().toISOString(),
        quarterOrPeriod: '3rd Qtr',
        clock: '8:42',
        isLive: true,
        headline: 'Super Bowl LIX Rematch',
        channel: 'MaZze RedZone',
        excitementScore: 98,
        venue: 'Caesars Superdome',
        label: 'SF @ KC',
      }
    );
  }, [selectedGameId, pickerGames, games]);

  // Price tier per square ($5, $10, $20)
  const [pricePerSquare, setPricePerSquare] = useState<number>(10);

  // Board state storage per game (preserved in-place across refreshes)
  const [boards, setBoards] = useState<Record<string, SquaresBoardState>>({});

  // Ensure active game has a board initialized
  const currentBoard = useMemo(() => {
    if (boards[activeGame.id]) {
      return boards[activeGame.id];
    }
    return generateSquaresForESPNGame(activeGame);
  }, [boards, activeGame]);

  // Calculate statistics
  const { userSquaresCount, totalClaimed, isSold75 } = useMemo(() => {
    let userCount = 0;
    let claimed = 0;
    Object.values(currentBoard.squares).forEach((sq) => {
      if (sq.isUser) userCount++;
      if (sq.taken) claimed++;
    });
    const sold75 = claimed >= 75 || currentBoard.numbersDrawn;
    return { userSquaresCount: userCount, totalClaimed: claimed, isSold75: sold75 };
  }, [currentBoard]);

  const totalCost = userSquaresCount * pricePerSquare;

  // Toggle a square on/off for user
  const handleToggleSquare = (r: number, c: number) => {
    const key = `${r}-${c}`;
    const cell = currentBoard.squares[key];

    if (cell?.taken && !cell.isUser) {
      showToast('Square Unavailable', `Already taken by player "${cell.owner}". Pick an open square.`, 'warning');
      return;
    }

    setBoards((prev) => {
      const baseBoard = prev[activeGame.id] || generateSquaresForESPNGame(activeGame);
      const updatedSquares = { ...baseBoard.squares };

      if (cell?.isUser) {
        updatedSquares[key] = { taken: false };
        showToast('Square Removed', `Deselected Row ${r}, Col ${c}`, 'info', 2000);
      } else {
        updatedSquares[key] = {
          taken: true,
          owner: 'YOU',
          isUser: true,
        };
        showToast('Square Picked!', `Selected Row ${r}, Col ${c} for YOU`, 'success', 2000);
      }

      const newTotal = Object.values(updatedSquares).filter((s) => s.taken).length;
      const newly75 = newTotal >= 75;

      return {
        ...prev,
        [activeGame.id]: {
          ...baseBoard,
          numbersDrawn: newly75 || baseBoard.numbersDrawn,
          squares: updatedSquares,
        },
      };
    });
  };

  // Clear user picks
  const handleClearPicks = () => {
    if (userSquaresCount === 0) {
      showToast('Notice', 'You have no picked squares to clear.', 'info');
      return;
    }

    setBoards((prev) => {
      const baseBoard = prev[activeGame.id] || generateSquaresForESPNGame(activeGame);
      const updatedSquares = { ...baseBoard.squares };

      Object.keys(updatedSquares).forEach((key) => {
        if (updatedSquares[key].isUser) {
          updatedSquares[key] = { taken: false };
        }
      });

      return {
        ...prev,
        [activeGame.id]: {
          ...baseBoard,
          squares: updatedSquares,
        },
      };
    });

    showToast('Picks Cleared', 'All your selected squares have been cleared.', 'info');
  };

  // Payment checkout notice
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<{
    open: boolean;
    provider: string;
  }>({ open: false, provider: '' });

  const handlePaymentClick = (provider: string) => {
    if (userSquaresCount === 0) {
      showToast('Select Squares First', 'Please pick at least one square before proceeding to checkout.', 'warning');
      return;
    }

    setCheckoutModalOpen({ open: true, provider });
    showToast(
      'Checkout Notice',
      'Checkout opens on parlaypro-squares.netlify.app (no payments in the app).',
      'info',
      6000
    );
  };

  // Toggle simulate 75% draw
  const handleToggleDrawNumbers = () => {
    setBoards((prev) => {
      const baseBoard = prev[activeGame.id] || generateSquaresForESPNGame(activeGame);
      const newDrawn = !baseBoard.numbersDrawn;
      return {
        ...prev,
        [activeGame.id]: {
          ...baseBoard,
          numbersDrawn: newDrawn,
        },
      };
    });

    if (!currentBoard.numbersDrawn) {
      showToast('Numbers Drawn!', 'Board reached 75% capacity! Numbers 0-9 randomized.', 'success');
    } else {
      showToast('Board Reset', 'Headers reset to ? hidden until 75% capacity is met.', 'info');
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col p-6 overflow-hidden select-none bg-[#0d0d10]">
      {/* Top 10 Game Picker Across Top (labeled AWAY@HOME) */}
      <div className="mb-3 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#ff7a1a] flex items-center gap-1.5">
              <Grid3X3 className="w-3.5 h-3.5" />
              10x10 MAZZE SQUARES POOL (TOP 10 ESPN GAMES)
            </span>
          </div>

          {/* 75% threshold badge & reveal button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 bg-zinc-900/90 px-3 py-1 rounded-lg border border-zinc-800">
              <span className="text-zinc-400">Board Sold:</span>
              <span className="text-white font-bold">{totalClaimed}/100</span>
              <span className="text-zinc-500">({totalClaimed}%)</span>
              <span className="text-zinc-600">|</span>
              <span className={isSold75 ? 'text-[#a3e635] font-bold' : 'text-[#ff7a1a]'}>
                {isSold75 ? '✓ Numbers Drawn' : 'Headers: ? (Draws at 75%)'}
              </span>
            </div>

            <FocusableItem
              id="squares-toggle-draw"
              dataNavDown="sq-cell-0-0"
              onSelect={handleToggleDrawNumbers}
              className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 flex items-center gap-1.5 border border-zinc-700"
            >
              {() => (
                <>
                  <RefreshCw className="w-3 h-3 text-[#ff7a1a]" />
                  <span>{currentBoard.numbersDrawn ? 'Hide Numbers' : 'Simulate 75% Draw'}</span>
                </>
              )}
            </FocusableItem>
          </div>
        </div>

        {/* 10 Games Picker Row (2 rows of 5 for optimal 1080p layout and visibility) */}
        <div className="grid grid-cols-5 gap-2">
          {pickerGames.map((game, index) => {
            const isSelected = game.id === activeGame.id;
            const prevId = index === 0 ? 'rail-squares' : `game-pick-${index - 1}`;
            const nextId = index === pickerGames.length - 1 ? 'squares-price-5' : `game-pick-${index + 1}`;
            const downId = index < 5 && pickerGames.length > 5 ? `game-pick-${index + 5}` : 'sq-cell-0-0';
            const upId = index >= 5 ? `game-pick-${index - 5}` : undefined;

            return (
              <FocusableItem
                key={`game-pick-${index}`}
                id={`game-pick-${index}`}
                dataNavLeft={prevId}
                dataNavRight={nextId}
                dataNavUp={upId}
                dataNavDown={downId}
                onSelect={() => {
                  setSelectedGameId(game.id);
                  showToast('Game Selected', `Loaded 10x10 Squares for ${game.label}`, 'info', 2000);
                }}
                className={`px-3 py-2 rounded-xl border-2 transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-zinc-800 border-[#ff7a1a] shadow-[0_0_15px_rgba(255,122,26,0.4)]'
                    : 'bg-[#14141d] border-zinc-800/80 hover:bg-zinc-800/50'
                }`}
              >
                {(isFocused) => (
                  <div className="flex items-center justify-between w-full">
                    <div>
                      {/* Labeled AWAY@HOME prominently as requested */}
                      <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <span className="font-mono-num text-sm text-[#ff7a1a]">{game.label}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                          {game.league}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 truncate max-w-[150px]">
                        {game.shortDetail}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`w-2 h-2 rounded-full inline-block ${
                        game.gameState === 'in' ? 'bg-[#a3e635] animate-pulse' : 'bg-zinc-600'
                      }`} />
                    </div>
                  </div>
                )}
              </FocusableItem>
            );
          })}
        </div>
      </div>

      {/* Main Split: 10x10 Grid (Left 70%) vs Side Panel (Right 30%) */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* 10x10 Squares Grid Container (Col 8) */}
        <div className="col-span-8 flex flex-col h-full bg-[#121219] rounded-2xl border border-zinc-800/80 p-3.5 justify-between">
          {/* Header indicator: Home Team across top */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#a3e635]">
              COLUMN TEAM (HOME): {currentBoard.homeTeam}
            </span>
            <span className="text-zinc-600 text-xs">•</span>
            <span className="text-[11px] font-mono text-zinc-400">
              {currentBoard.numbersDrawn ? 'Numbers locked & visible' : 'Numbers hidden (?) until 75% claimed'}
            </span>
          </div>

          <div className="flex flex-1 min-h-0 items-center justify-center">
            {/* Left label for Away team */}
            <div className="writing-mode-vertical rotate-180 text-center mr-2 text-[11px] font-extrabold uppercase tracking-widest text-[#ff7a1a] whitespace-nowrap">
              ROW TEAM (AWAY): {currentBoard.awayTeam}
            </div>

            {/* 10x10 Table */}
            <div className="flex flex-col flex-1 max-w-[550px] max-h-[440px] h-full">
              {/* Column numbers header (Home Team 0-9 or ?) */}
              <div className="grid grid-cols-11 gap-1 mb-1 shrink-0">
                {/* Top-left corner */}
                <div className="h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-500">
                  AWAY \ HOME
                </div>
                {Array.from({ length: 10 }).map((_, c) => (
                  <div
                    key={`col-hdr-${c}`}
                    className={`h-7 rounded border flex items-center justify-center font-mono-num text-xs font-bold transition-all ${
                      currentBoard.numbersDrawn
                        ? 'bg-zinc-800 border-[#a3e635]/60 text-[#a3e635]'
                        : 'bg-zinc-900/90 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {currentBoard.numbersDrawn ? currentBoard.homeNumbers[c] : '?'}
                  </div>
                ))}
              </div>

              {/* 10 Rows */}
              <div className="grid grid-rows-10 gap-1 flex-1 min-h-0">
                {Array.from({ length: 10 }).map((_, r) => (
                  <div key={`row-${r}`} className="grid grid-cols-11 gap-1 h-full">
                    {/* Row header (Away Team 0-9 or ?) */}
                    <div
                      className={`h-full rounded border flex items-center justify-center font-mono-num text-xs font-bold transition-all ${
                        currentBoard.numbersDrawn
                          ? 'bg-zinc-800 border-[#ff7a1a]/60 text-[#ff7a1a]'
                          : 'bg-zinc-900/90 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      {currentBoard.numbersDrawn ? currentBoard.awayNumbers[r] : '?'}
                    </div>

                    {/* 10 Square Cells in this row */}
                    {Array.from({ length: 10 }).map((_, c) => {
                      const key = `${r}-${c}`;
                      const cell = currentBoard.squares[key];
                      const isUser = !!cell?.isUser;
                      const isTaken = !!cell?.taken && !isUser;

                      const prevCell = c === 0 ? undefined : `sq-cell-${r}-${c - 1}`;
                      const nextCell = c === 9 ? 'squares-price-5' : `sq-cell-${r}-${c + 1}`;
                      const upCell = r === 0 ? 'game-pick-0' : `sq-cell-${r - 1}-${c}`;
                      const downCell = r === 9 ? undefined : `sq-cell-${r + 1}-${c}`;

                      return (
                        <FocusableItem
                          key={key}
                          id={`sq-cell-${r}-${c}`}
                          dataNavLeft={prevCell}
                          dataNavRight={nextCell}
                          dataNavUp={upCell}
                          dataNavDown={downCell}
                          onSelect={() => handleToggleSquare(r, c)}
                          className={`h-full rounded border flex flex-col items-center justify-center transition-all ${
                            isUser
                              ? 'bg-[#ff7a1a] text-black font-extrabold border-amber-300 shadow-[0_0_12px_rgba(255,122,26,0.8)]'
                              : isTaken
                              ? 'bg-zinc-800/70 border-zinc-800 text-zinc-400 font-bold'
                              : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-800/60 text-zinc-500'
                          }`}
                        >
                          {(isFocused) => (
                            <span className="text-[10px] tracking-tight font-mono-num leading-none">
                              {isUser ? (
                                <span className="font-extrabold text-[10px] text-white bg-black/40 px-1 py-0.2 rounded">
                                  YOU
                                </span>
                              ) : isTaken ? (
                                cell.owner
                              ) : (
                                ''
                              )}
                            </span>
                          )}
                        </FocusableItem>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Footer Hint */}
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1.5 border-t border-zinc-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#ff7a1a]" />
                <span className="text-zinc-200 font-bold">Orange = YOU</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-zinc-800 border border-zinc-700" />
                <span>Grey = Other Player</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-zinc-900 border border-zinc-800" />
                <span>Empty = Available</span>
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">
              Use remote arrows to navigate • Press [Enter] to toggle
            </div>
          </div>
        </div>

        {/* Side Panel (Col 4) */}
        <div className="col-span-4 flex flex-col h-full bg-[#14141e] rounded-2xl border border-zinc-800 p-4 justify-between">
          <div>
            {/* Game Name & Header */}
            <div className="border-b border-zinc-800 pb-2.5 mb-3">
              <div className="text-xs font-bold text-[#ff7a1a] uppercase tracking-wider flex items-center justify-between">
                <span>Selected Board</span>
                <span className="font-mono text-xs text-[#a3e635]">{activeGame.league}</span>
              </div>
              <h3 className="text-lg font-extrabold text-white mt-0.5">
                {activeGame.awayTeam.name} @ {activeGame.homeTeam.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {activeGame.shortDetail} • {activeGame.venue}
              </p>
            </div>

            {/* Price Per Square Selector ($5 / $10 / $20) */}
            <div className="mb-3">
              <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Price Per Square
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 20].map((tier, idx) => {
                  const isSelected = pricePerSquare === tier;
                  const prevPrice = idx === 0 ? 'sq-cell-0-9' : `squares-price-${[5, 10, 20][idx - 1]}`;
                  const nextPrice = idx === 2 ? 'pay-cashapp' : `squares-price-${[5, 10, 20][idx + 1]}`;

                  return (
                    <FocusableItem
                      key={tier}
                      id={`squares-price-${tier}`}
                      dataNavLeft={prevPrice}
                      dataNavRight={nextPrice}
                      dataNavDown="pay-cashapp"
                      onSelect={() => {
                        setPricePerSquare(tier);
                        showToast('Price Tier Selected', `$${tier} per square applied`, 'info', 2000);
                      }}
                      className={`py-1.5 rounded-xl text-center font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-[#ff7a1a] text-white shadow-md'
                          : 'bg-zinc-800 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {() => <span>${tier}</span>}
                    </FocusableItem>
                  );
                })}
              </div>
            </div>

            {/* Selected Count & Total Dollars */}
            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 mb-3">
              <div className="flex items-center justify-between py-1 border-b border-zinc-800 text-xs">
                <span className="text-zinc-400">Selected Squares</span>
                <span className="font-bold text-white font-mono-num text-sm">
                  {userSquaresCount} squares
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800 text-xs">
                <span className="text-zinc-400">Price per Square</span>
                <span className="font-bold text-white font-mono-num">
                  ${pricePerSquare}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1.5">
                <span className="text-sm font-extrabold text-zinc-200 uppercase tracking-wide">
                  Total Dollars
                </span>
                <span className="font-teko text-3xl font-bold text-[#a3e635] font-mono-num">
                  ${totalCost}
                </span>
              </div>
            </div>

            {/* Prize pool estimate summary */}
            <div className="text-[11px] text-zinc-400 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/80 mb-3 flex items-center justify-between font-mono-num">
              <span>Q1: ${Math.round(totalCost * 2.5) || 250}</span>
              <span>Half: ${Math.round(totalCost * 5) || 500}</span>
              <span>Q3: ${Math.round(totalCost * 2.5) || 250}</span>
              <span className="font-bold text-[#ff7a1a]">Final: ${Math.round(totalCost * 10) || 1000}</span>
            </div>
          </div>

          {/* Payment Buttons & Refund Notice */}
          <div className="flex flex-col space-y-2 pt-1 border-t border-zinc-800">
            {/* Pay with Cash App */}
            <FocusableItem
              id="pay-cashapp"
              dataNavUp="squares-price-10"
              dataNavDown="pay-paypal"
              dataNavLeft="sq-cell-3-9"
              onSelect={() => handlePaymentClick('Cash App')}
              className="w-full py-2.5 rounded-xl bg-[#00D632] hover:bg-[#00c02c] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              {() => (
                <>
                  <DollarSign className="w-4 h-4 stroke-[3]" />
                  <span>Pay with Cash App</span>
                </>
              )}
            </FocusableItem>

            {/* Pay with PayPal */}
            <FocusableItem
              id="pay-paypal"
              dataNavUp="pay-cashapp"
              dataNavDown="pay-card"
              dataNavLeft="sq-cell-5-9"
              onSelect={() => handlePaymentClick('PayPal')}
              className="w-full py-2.5 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              {() => (
                <>
                  <DollarSign className="w-4 h-4 stroke-[3]" />
                  <span>Pay with PayPal</span>
                </>
              )}
            </FocusableItem>

            {/* Pay with Card */}
            <FocusableItem
              id="pay-card"
              dataNavUp="pay-paypal"
              dataNavDown="btn-clear-picks"
              dataNavLeft="sq-cell-7-9"
              onSelect={() => handlePaymentClick('Credit / Debit Card')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff7a1a] to-[#ea580c] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,122,26,0.5)]"
            >
              {() => (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay with Card</span>
                </>
              )}
            </FocusableItem>

            {/* Clear My Picks Button */}
            <FocusableItem
              id="btn-clear-picks"
              dataNavUp="pay-card"
              dataNavLeft="sq-cell-9-9"
              onSelect={handleClearPicks}
              className="w-full py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {() => (
                <>
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Clear my picks ({userSquaresCount})</span>
                </>
              )}
            </FocusableItem>

            {/* Refund Note */}
            <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-300 flex items-start gap-2 leading-tight">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Refund Note:</strong> 100% refundable if the board does not fill before kickoff.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Notice TV Modal Dialog */}
      {checkoutModalOpen.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#161622] border-2 border-[#ff7a1a] rounded-2xl max-w-lg w-full p-7 shadow-2xl relative text-center">
            <div className="w-16 h-16 rounded-full bg-[#ff7a1a]/20 border border-[#ff7a1a] flex items-center justify-center mx-auto mb-4 text-[#ff7a1a]">
              <ExternalLink className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-white">
              Checkout Redirection Notice
            </h3>

            <p className="text-zinc-300 text-sm mt-3 leading-relaxed">
              Payments are handled securely on the companion web portal:
            </p>

            <div className="my-4 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-sm text-[#a3e635] font-bold break-all flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#ff7a1a]" />
              <span>parlaypro-squares.netlify.app</span>
            </div>

            <div className="text-xs text-zinc-400 bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 mb-6 text-left space-y-1">
              <div>• Provider selected: <span className="text-white font-bold">{checkoutModalOpen.provider}</span></div>
              <div>• Squares to reserve: <span className="text-white font-bold">{userSquaresCount}</span> (${totalCost})</div>
              <div>• Board: <span className="text-white font-bold">{activeGame.label}</span></div>
              <div>• No payments are processed directly within the TV applet.</div>
              <div>• Board Refund Policy: 100% refundable if board does not fill.</div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <FocusableItem
                id="modal-btn-close"
                onSelect={() => setCheckoutModalOpen({ open: false, provider: '' })}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff7a1a] to-[#ea580c] text-white font-bold text-sm shadow-[0_0_15px_rgba(255,122,26,0.6)]"
              >
                {() => <span>Got It (Press Enter or Esc)</span>}
              </FocusableItem>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
