import { GameItem, GameState, SportCategory, UserTeam, SquaresBoardState } from '../types';

export interface ScoreboardEndpoint {
  sport: string;
  league: string;
  leagueLabel: string;
  category: SportCategory;
}

export const ESPN_ENDPOINTS: ScoreboardEndpoint[] = [
  { sport: 'football', league: 'nfl', leagueLabel: 'NFL', category: 'Football' },
  { sport: 'basketball', league: 'nba', leagueLabel: 'NBA', category: 'Basketball' },
  { sport: 'hockey', league: 'nhl', leagueLabel: 'NHL', category: 'Hockey' },
  { sport: 'soccer', league: 'usa.1', leagueLabel: 'MLS', category: 'Soccer' },
  { sport: 'baseball', league: 'mlb', leagueLabel: 'MLB', category: 'Baseball' },
  { sport: 'football', league: 'college-football', leagueLabel: 'NCAAF', category: 'Football' },
  { sport: 'basketball', league: 'mens-college-basketball', leagueLabel: 'NCAAM', category: 'Basketball' },
  { sport: 'soccer', league: 'eng.1', leagueLabel: 'Premier League', category: 'Soccer' },
];

function sanitizeColor(hex?: string, fallback = '#ff7a1a'): string {
  if (!hex) return fallback;
  const clean = hex.replace('#', '').trim();
  if (clean.length === 6 || clean.length === 3) {
    return `#${clean}`;
  }
  return fallback;
}

export function parseESPNEvent(event: any, endpoint: ScoreboardEndpoint): GameItem | null {
  try {
    const comp = event.competitions?.[0];
    if (!comp || !comp.competitors || comp.competitors.length < 2) return null;

    const competitors = comp.competitors;
    const homeComp = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
    const awayComp = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];

    const state = (event.status?.type?.state || 'pre') as GameState;
    const shortDetail = event.status?.type?.shortDetail || (state === 'in' ? 'LIVE' : state === 'post' ? 'Final' : 'Scheduled');
    const displayClock = event.status?.displayClock || '';
    const period = event.status?.period || 1;

    const homeScore = parseInt(homeComp.score || '0', 10);
    const awayScore = parseInt(awayComp.score || '0', 10);

    const homeName = homeComp.team?.displayName || homeComp.team?.name || 'Home';
    const awayName = awayComp.team?.displayName || awayComp.team?.name || 'Away';

    const homeAbbr = homeComp.team?.abbreviation || homeName.substring(0, 3).toUpperCase();
    const awayAbbr = awayComp.team?.abbreviation || awayName.substring(0, 3).toUpperCase();

    const homeColor = sanitizeColor(homeComp.team?.color, '#2563eb');
    const awayColor = sanitizeColor(awayComp.team?.color, '#dc2626');

    const homeRecord = homeComp.records?.[0]?.summary || '';
    const awayRecord = awayComp.records?.[0]?.summary || '';

    const isLive = state === 'in';
    const venueName = comp.venue?.fullName || 'Stadium Arena';

    // Broadcast channel or default
    const broadcast = comp.broadcasts?.[0]?.names?.[0] || `${endpoint.leagueLabel} TV`;

    // Construct AWAY @ HOME label
    const label = `${awayAbbr} @ ${homeAbbr}`;

    // Period formatting
    let quarterOrPeriod = shortDetail;
    if (state === 'in') {
      quarterOrPeriod = displayClock ? `${displayClock} • P${period}` : shortDetail;
    }

    return {
      id: String(event.id || `${endpoint.league}-${awayAbbr}-${homeAbbr}`),
      sport: endpoint.category,
      league: endpoint.leagueLabel,
      awayTeam: {
        name: awayName,
        shortName: awayAbbr,
        logoColor: awayColor,
        score: awayScore,
        record: awayRecord,
        logo: awayComp.team?.logo,
      },
      homeTeam: {
        name: homeName,
        shortName: homeAbbr,
        logoColor: homeColor,
        score: homeScore,
        record: homeRecord,
        logo: homeComp.team?.logo,
      },
      gameState: state,
      shortDetail,
      startTime: event.date || new Date().toISOString(),
      quarterOrPeriod,
      clock: displayClock || shortDetail,
      isLive,
      possession: isLive ? (Math.random() > 0.5 ? 'home' : 'away') : undefined,
      headline: event.name ? `${endpoint.leagueLabel}: ${event.name}` : `${awayName} at ${homeName}`,
      channel: broadcast,
      excitementScore: isLive ? Math.min(99, 85 + Math.abs(homeScore - awayScore === 0 ? 14 : 9)) : 80,
      venue: venueName,
      label,
    };
  } catch (err) {
    console.error('Error parsing ESPN event:', err);
    return null;
  }
}

/**
 * Sort games: live first ('in'), then upcoming ('pre') by start time, then finals ('post').
 */
export function sortESPNScoreboardGames(games: GameItem[]): GameItem[] {
  return [...games].sort((a, b) => {
    // 1. Live games come first
    if (a.gameState === 'in' && b.gameState !== 'in') return -1;
    if (a.gameState !== 'in' && b.gameState === 'in') return 1;

    // 2. Both live: sort by closer score or excitement
    if (a.gameState === 'in' && b.gameState === 'in') {
      const diffA = Math.abs(a.homeTeam.score - a.awayTeam.score);
      const diffB = Math.abs(b.homeTeam.score - b.awayTeam.score);
      return diffA - diffB;
    }

    // 3. Upcoming games come before finals
    if (a.gameState === 'pre' && b.gameState === 'post') return -1;
    if (a.gameState === 'post' && b.gameState === 'pre') return 1;

    // 4. Both upcoming: sort by start time ascending (earliest upcoming first)
    if (a.gameState === 'pre' && b.gameState === 'pre') {
      const timeA = new Date(a.startTime).getTime() || 0;
      const timeB = new Date(b.startTime).getTime() || 0;
      return timeA - timeB;
    }

    // 5. Both finals: sort by most recently started/finished descending
    if (a.gameState === 'post' && b.gameState === 'post') {
      const timeA = new Date(a.startTime).getTime() || 0;
      const timeB = new Date(b.startTime).getTime() || 0;
      return timeB - timeA;
    }

    return 0;
  });
}

/**
 * Fetches all 8 ESPN scoreboards concurrently.
 */
export async function fetchAllESPNScoreboards(): Promise<{ games: GameItem[]; error: boolean }> {
  const allParsedGames: GameItem[] = [];
  let hadAnyFailure = false;

  const fetchPromises = ESPN_ENDPOINTS.map(async (ep) => {
    const url = `https://site.api.espn.com/apis/site/v2/sports/${ep.sport}/${ep.league}/scoreboard`;
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const events = data.events || [];
      const parsed: GameItem[] = [];
      for (const ev of events) {
        const item = parseESPNEvent(ev, ep);
        if (item) parsed.push(item);
      }
      return parsed;
    } catch (e) {
      console.warn(`Failed fetching ${ep.leagueLabel}:`, e);
      hadAnyFailure = true;
      return [];
    }
  });

  const results = await Promise.allSettled(fetchPromises);
  results.forEach((res) => {
    if (res.status === 'fulfilled') {
      allParsedGames.push(...res.value);
    } else {
      hadAnyFailure = true;
    }
  });

  if (allParsedGames.length === 0) {
    return { games: [], error: true };
  }

  const sorted = sortESPNScoreboardGames(allParsedGames);
  return { games: sorted, error: hadAnyFailure && allParsedGames.length === 0 };
}

/**
 * Converts top upcoming games into Up Next / Your Teams items for Home screen.
 */
export function deriveUpNextTeams(games: GameItem[]): UserTeam[] {
  // Take up to 5 games that are either live or upcoming
  const selected = games.slice(0, 5);
  return selected.map((g) => {
    const isLive = g.gameState === 'in';
    const isFinal = g.gameState === 'post';
    const status: 'LIVE' | 'UPCOMING' | 'FINAL' = isLive ? 'LIVE' : isFinal ? 'FINAL' : 'UPCOMING';

    let statusDetails = g.shortDetail;
    try {
      if (!isLive && !isFinal) {
        const d = new Date(g.startTime);
        const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        statusDetails = `${timeStr} • ${g.league}`;
      }
    } catch (_) {}

    return {
      id: `team-entry-${g.id}`,
      teamName: g.homeTeam.name,
      sport: g.sport,
      league: g.league,
      status,
      statusDetails,
      matchup: `vs ${g.awayTeam.name}`,
      color: g.homeTeam.logoColor,
    };
  });
}

/**
 * Generates or initializes a 10x10 squares board for any real ESPN game.
 */
export function generateSquaresForESPNGame(game: GameItem, existingBoard?: SquaresBoardState): SquaresBoardState {
  if (existingBoard) {
    // Preserve existing picks and board state, just update game title / teams if needed
    return {
      ...existingBoard,
      gameId: game.id,
      gameTitle: `${game.awayTeam.shortName} @ ${game.homeTeam.shortName}`,
      awayTeam: `${game.awayTeam.name} (${game.awayTeam.shortName})`,
      homeTeam: `${game.homeTeam.name} (${game.homeTeam.shortName})`,
    };
  }

  const squares: SquaresBoardState['squares'] = {};
  const otherPlayers = ['MK', 'AL', 'JD', 'TC', 'BL', 'RW', 'SM', 'DP', 'KB', 'NH', 'EF', 'GH', 'JJ', 'TK', 'RP', 'QZ', 'WS', 'VT', 'LM', 'CP'];

  // Seeded deterministic generation per game id
  const gameSeed = game.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let count = 0;

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const key = `${r}-${c}`;
      const hash = (r * 17 + c * 31 + gameSeed * 7) % 100;
      if (hash > 28) {
        const player = otherPlayers[(r * 5 + c * 3 + (gameSeed % 5)) % otherPlayers.length];
        squares[key] = {
          taken: true,
          owner: player,
          isUser: false,
        };
        count++;
      } else if (r === 2 && c === 4) {
        squares[key] = {
          taken: true,
          owner: 'YOU',
          isUser: true,
        };
      } else {
        squares[key] = {
          taken: false,
        };
      }
    }
  }

  const awayNumbers = [0, 7, 3, 4, 1, 9, 2, 8, 5, 6];
  const homeNumbers = [3, 0, 7, 1, 4, 8, 2, 6, 9, 5];
  const totalTaken = Object.values(squares).filter((s) => s.taken).length;
  const numbersDrawn = totalTaken >= 75;

  return {
    gameId: game.id,
    gameTitle: `${game.awayTeam.shortName} @ ${game.homeTeam.shortName}`,
    awayTeam: `${game.awayTeam.name} (${game.awayTeam.shortName})`,
    homeTeam: `${game.homeTeam.name} (${game.homeTeam.shortName})`,
    awayNumbers,
    homeNumbers,
    numbersDrawn,
    squares,
  };
}
