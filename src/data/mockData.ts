import { GameItem, UserTeam, ChannelItem, SquaresBoardState } from '../types';

export const FEATURED_GAME: GameItem = {
  id: 'game-kc-sf',
  sport: 'Football',
  league: 'NFL CHAMPIONSHIP',
  awayTeam: {
    name: 'San Francisco 49ers',
    shortName: 'SF',
    logoColor: '#AA0000',
    score: 21,
    record: '14-5'
  },
  homeTeam: {
    name: 'Kansas City Chiefs',
    shortName: 'KC',
    logoColor: '#E31837',
    score: 24,
    record: '15-4'
  },
  quarterOrPeriod: '3rd Quarter',
  clock: '8:42',
  isLive: true,
  possession: 'home',
  headline: 'SUPER BOWL LIX REMATCH • LIVE FROM NEW ORLEANS',
  channel: 'MaZze RedZone 4K (CH 201)',
  excitementScore: 98,
  venue: 'Caesars Superdome'
};

export const LIVE_GAMES: GameItem[] = [
  FEATURED_GAME,
  {
    id: 'game-bos-lal',
    sport: 'Basketball',
    league: 'NBA FINALS',
    awayTeam: {
      name: 'Boston Celtics',
      shortName: 'BOS',
      logoColor: '#007A33',
      score: 108,
      record: '58-24'
    },
    homeTeam: {
      name: 'Los Angeles Lakers',
      shortName: 'LAL',
      logoColor: '#552583',
      score: 112,
      record: '52-30'
    },
    quarterOrPeriod: '4th Quarter',
    clock: '2:15',
    isLive: true,
    possession: 'away',
    headline: 'CLUTCH TIME: 4-POINT MARGIN WITH 2 MINS LEFT',
    channel: 'ESPN HD (CH 206)',
    excitementScore: 95,
    venue: 'Crypto.com Arena'
  },
  {
    id: 'game-rma-bar',
    sport: 'Soccer',
    league: 'LA LIGA EL CLÁSICO',
    awayTeam: {
      name: 'FC Barcelona',
      shortName: 'BAR',
      logoColor: '#A50044',
      score: 1,
      record: '1st in Table'
    },
    homeTeam: {
      name: 'Real Madrid',
      shortName: 'RMA',
      logoColor: '#00529F',
      score: 2,
      record: '2nd in Table'
    },
    quarterOrPeriod: '2nd Half',
    clock: '82:14',
    isLive: true,
    possession: 'home',
    headline: 'VINÍCIUS JR 76’ STRIKE SHATTERS DEADLOCK',
    channel: 'Sky Sports Premier (CH 228)',
    excitementScore: 92,
    venue: 'Santiago Bernabéu'
  },
  {
    id: 'game-edm-fla',
    sport: 'Hockey',
    league: 'NHL STANLEY CUP',
    awayTeam: {
      name: 'Edmonton Oilers',
      shortName: 'EDM',
      logoColor: '#041E42',
      score: 3,
      record: '48-28'
    },
    homeTeam: {
      name: 'Florida Panthers',
      shortName: 'FLA',
      logoColor: '#C8102E',
      score: 3,
      record: '50-24'
    },
    quarterOrPeriod: '3rd Period',
    clock: '4:50',
    isLive: true,
    possession: 'home',
    headline: 'POWER PLAY FOR PANTHERS TIED IN 3RD',
    channel: 'TNT Sports 1 (CH 210)',
    excitementScore: 89,
    venue: 'Amerant Bank Arena'
  },
  {
    id: 'game-ufc-315',
    sport: 'Fights',
    league: 'UFC 315 MAIN EVENT',
    awayTeam: {
      name: 'Arman Tsarukyan',
      shortName: 'TSA',
      logoColor: '#D97706',
      score: 28,
      record: '22-3-0'
    },
    homeTeam: {
      name: 'Islam Makhachev',
      shortName: 'MAK',
      logoColor: '#DC2626',
      score: 29,
      record: '26-1-0'
    },
    quarterOrPeriod: 'Round 3 of 5',
    clock: '1:45',
    isLive: true,
    possession: 'home',
    headline: 'LIGHTWEIGHT WORLD TITLE BOUT • TAKEDOWN BATTLE',
    channel: 'Fight Network (CH 235)',
    excitementScore: 97,
    venue: 'T-Mobile Arena'
  }
];

export const YOUR_TEAMS: UserTeam[] = [
  {
    id: 'team-kc',
    teamName: 'Kansas City Chiefs',
    sport: 'Football',
    league: 'NFL',
    status: 'LIVE',
    statusDetails: 'Q3 8:42 • 24 - 21 vs 49ers',
    matchup: 'vs San Francisco 49ers',
    color: '#E31837'
  },
  {
    id: 'team-bos',
    teamName: 'Boston Celtics',
    sport: 'Basketball',
    league: 'NBA',
    status: 'LIVE',
    statusDetails: 'Q4 2:15 • 108 - 112 @ Lakers',
    matchup: '@ Los Angeles Lakers',
    color: '#007A33'
  },
  {
    id: 'team-rma',
    teamName: 'Real Madrid',
    sport: 'Soccer',
    league: 'La Liga',
    status: 'LIVE',
    statusDetails: '82’ • 2 - 1 vs Barcelona',
    matchup: 'vs FC Barcelona',
    color: '#00529F'
  },
  {
    id: 'team-edm',
    teamName: 'Edmonton Oilers',
    sport: 'Hockey',
    league: 'NHL',
    status: 'LIVE',
    statusDetails: 'P3 4:50 • 3 - 3 @ Panthers',
    matchup: '@ Florida Panthers',
    color: '#041E42'
  },
  {
    id: 'team-mak',
    teamName: 'Islam Makhachev',
    sport: 'Fights',
    league: 'UFC',
    status: 'LIVE',
    statusDetails: 'R3 1:45 • Title Defense',
    matchup: 'vs Arman Tsarukyan',
    color: '#DC2626'
  }
];

export const CHANNELS_DATA: ChannelItem[] = [
  {
    id: 'ch-201',
    number: '201',
    name: 'MaZze RedZone 4K',
    callSign: 'MZ-RED',
    logoBadge: '4K LIVE',
    category: 'Football',
    currentShow: {
      title: 'Super Bowl LIX: Chiefs vs 49ers Live',
      description: 'Full immersive commercial-free coverage with coach cams and all-22 angles.',
      startTime: '6:30 PM',
      endTime: '10:00 PM',
      progressPercent: 68
    },
    nextShow: {
      title: 'Post-Game Trophy Presentation & Locker Room',
      startTime: '10:00 PM'
    },
    resolution: '4K HDR • 60 FPS',
    audio: 'Dolby Atmos 5.1'
  },
  {
    id: 'ch-206',
    number: '206',
    name: 'ESPN HD',
    callSign: 'ESPN',
    logoBadge: 'HD',
    category: 'Basketball',
    currentShow: {
      title: 'NBA Finals Game 6: Celtics vs Lakers',
      description: 'Mike Breen and Doris Burke on the call live from Los Angeles.',
      startTime: '7:00 PM',
      endTime: '9:45 PM',
      progressPercent: 82
    },
    nextShow: {
      title: 'SportsCenter Postgame Live',
      startTime: '9:45 PM'
    },
    resolution: '1080p60 HDR',
    audio: 'Dolby Digital 5.1'
  },
  {
    id: 'ch-210',
    number: '210',
    name: 'TNT Sports 1',
    callSign: 'TNT-1',
    logoBadge: 'HD',
    category: 'Hockey',
    currentShow: {
      title: 'Stanley Cup Final Game 7: Oilers at Panthers',
      description: 'Game 7 for all the marbles. Sudden death intensity.',
      startTime: '8:00 PM',
      endTime: '10:30 PM',
      progressPercent: 74
    },
    nextShow: {
      title: 'Inside The NHL on TNT',
      startTime: '10:30 PM'
    },
    resolution: '1080p60',
    audio: 'Stereo Hi-Fi'
  },
  {
    id: 'ch-214',
    number: '214',
    name: 'NBC Sports Prime',
    callSign: 'NBCS',
    logoBadge: '4K',
    category: 'Football',
    currentShow: {
      title: 'Sunday Night Football Primetime Analysis',
      description: 'Breakdowns, telestrator analysis, and next week matchups preview.',
      startTime: '7:30 PM',
      endTime: '9:30 PM',
      progressPercent: 55
    },
    nextShow: {
      title: 'Pro Football Talk Live',
      startTime: '9:30 PM'
    },
    resolution: '4K HDR • 60 FPS',
    audio: 'Dolby Atmos'
  },
  {
    id: 'ch-219',
    number: '219',
    name: 'Fox Sports 1 (FS1)',
    callSign: 'FS1',
    logoBadge: 'HD',
    category: 'Football',
    currentShow: {
      title: 'College Football Final & Top 25 Highlights',
      description: 'Top plays, bowl game projections, and Heisman watch table.',
      startTime: '8:00 PM',
      endTime: '10:00 PM',
      progressPercent: 45
    },
    nextShow: {
      title: 'The Herd Late Edition',
      startTime: '10:00 PM'
    },
    resolution: '1080p60',
    audio: 'Stereo Hi-Fi'
  },
  {
    id: 'ch-223',
    number: '223',
    name: 'CBS Sports HQ',
    callSign: 'CBSHQ',
    logoBadge: 'LIVE',
    category: 'All Sports',
    currentShow: {
      title: 'Live Scoreboard & In-Game Fantasy Tracker',
      description: 'Real-time statistical tracking across all 5 North American sports leagues.',
      startTime: '7:00 PM',
      endTime: '11:00 PM',
      progressPercent: 62
    },
    nextShow: {
      title: 'Late Night Betting Syndicate',
      startTime: '11:00 PM'
    },
    resolution: '1080p60',
    audio: 'Dolby 5.1'
  },
  {
    id: 'ch-228',
    number: '228',
    name: 'Sky Sports Premier',
    callSign: 'SKY-PL',
    logoBadge: '4K HDR',
    category: 'Soccer',
    currentShow: {
      title: 'El Clásico: Real Madrid vs FC Barcelona',
      description: 'Peter Drury on commentary live from Estadio Santiago Bernabéu.',
      startTime: '7:15 PM',
      endTime: '9:30 PM',
      progressPercent: 88
    },
    nextShow: {
      title: 'Super Sunday Debrief & Highlights',
      startTime: '9:30 PM'
    },
    resolution: '4K HDR • 60 FPS',
    audio: 'Dolby Atmos'
  },
  {
    id: 'ch-235',
    number: '235',
    name: 'Fight Network Live',
    callSign: 'FIGHT',
    logoBadge: 'PPV',
    category: 'Fights',
    currentShow: {
      title: 'UFC 315: Makhachev vs Tsarukyan 2',
      description: 'Main event title clash plus post-fight octagon interviews with Joe Rogan.',
      startTime: '8:00 PM',
      endTime: '11:30 PM',
      progressPercent: 71
    },
    nextShow: {
      title: 'Post-Fight Press Conference Live',
      startTime: '11:30 PM'
    },
    resolution: '4K HDR • 60 FPS',
    audio: 'Dolby Atmos'
  }
];

export const SQUARES_GAMES = [
  {
    id: 'game-kc-sf',
    title: 'Super Bowl LIX: Chiefs vs 49ers',
    shortName: 'Chiefs vs 49ers',
    awayTeam: '49ers (SF)',
    homeTeam: 'Chiefs (KC)',
    date: 'Super Bowl Sunday • 6:30 PM',
    defaultPrice: 10,
    prizes: {
      q1: '$500',
      half: '$1,000',
      q3: '$500',
      final: '$2,000'
    }
  },
  {
    id: 'game-bos-lal',
    title: 'NBA Finals Game 6: Celtics vs Lakers',
    shortName: 'Celtics vs Lakers',
    awayTeam: 'Celtics (BOS)',
    homeTeam: 'Lakers (LAL)',
    date: 'Tonight • 7:00 PM EST',
    defaultPrice: 10,
    prizes: {
      q1: '$400',
      half: '$800',
      q3: '$400',
      final: '$1,600'
    }
  },
  {
    id: 'game-rma-bar',
    title: 'El Clásico: Real Madrid vs FC Barcelona',
    shortName: 'Real Madrid vs Barca',
    awayTeam: 'Barcelona (BAR)',
    homeTeam: 'Real Madrid (RMA)',
    date: 'Live Now • 82’',
    defaultPrice: 5,
    prizes: {
      q1: '$300 (15m)',
      half: '$600 (45m)',
      q3: '$300 (75m)',
      final: '$1,200 (FT)'
    }
  },
  {
    id: 'game-ufc-315',
    title: 'UFC 315: Makhachev vs Tsarukyan',
    shortName: 'UFC 315 Main Event',
    awayTeam: 'Tsarukyan (TSA)',
    homeTeam: 'Makhachev (MAK)',
    date: 'Main Card Tonight • 10:00 PM',
    defaultPrice: 20,
    prizes: {
      q1: '$800 (R1)',
      half: '$1,200 (R3)',
      q3: '$800 (R4)',
      final: '$2,500 (End)'
    }
  }
];

// Helper to generate deterministic sample taken squares for demo
export function generateInitialSquares(gameId: string): SquaresBoardState {
  const game = SQUARES_GAMES.find((g) => g.id === gameId) || SQUARES_GAMES[0];
  const squares: SquaresBoardState['squares'] = {};
  
  // Seeded initials list of other community participants
  const otherPlayers = ['MK', 'AL', 'JD', 'TC', 'BL', 'RW', 'SM', 'DP', 'KB', 'NH', 'EF', 'GH', 'JJ', 'TK', 'RP', 'QZ', 'WS', 'VT', 'LM', 'CP'];

  // Seeded pseudorandom placement to pre-fill ~71 squares (so 71% is sold, near the 75% threshold!)
  let count = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const key = `${r}-${c}`;
      // Specific seed logic to make it look realistic
      const hash = (r * 13 + c * 29 + gameId.length * 7) % 100;
      if (hash > 28) {
        // Taken by other player
        const player = otherPlayers[(r * 5 + c * 3) % otherPlayers.length];
        squares[key] = {
          taken: true,
          owner: player,
          isUser: false
        };
        count++;
      } else if (r === 2 && c === 4) {
        // User starts with 2 demo picks on default board
        squares[key] = {
          taken: true,
          owner: 'YOU',
          isUser: true
        };
      } else if (r === 7 && c === 8) {
        squares[key] = {
          taken: true,
          owner: 'YOU',
          isUser: true
        };
      } else {
        squares[key] = {
          taken: false
        };
      }
    }
  }

  // Initial random digits for when revealed
  const awayNumbers = [0, 7, 3, 4, 1, 9, 2, 8, 5, 6];
  const homeNumbers = [3, 0, 7, 1, 4, 8, 2, 6, 9, 5];

  // Count total taken
  const totalTaken = Object.values(squares).filter((s) => s.taken).length;
  const numbersDrawn = totalTaken >= 75;

  return {
    gameId: game.id,
    gameTitle: game.title,
    awayTeam: game.awayTeam,
    homeTeam: game.homeTeam,
    awayNumbers,
    homeNumbers,
    numbersDrawn,
    squares
  };
}
