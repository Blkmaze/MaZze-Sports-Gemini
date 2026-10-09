export type NavScreen = 'home' | 'multiview' | 'channels' | 'squares' | 'mysports';
export type SportCategory = 'Football' | 'Basketball' | 'Soccer' | 'Hockey' | 'Baseball' | 'Fights';

export type GameState = 'in' | 'pre' | 'post';

export interface GameItem {
  id: string;
  sport: SportCategory;
  league: string;
  awayTeam: {
    name: string;
    shortName: string;
    logoColor: string;
    score: number;
    record?: string;
    logo?: string;
  };
  homeTeam: {
    name: string;
    shortName: string;
    logoColor: string;
    score: number;
    record?: string;
    logo?: string;
  };
  gameState: GameState; // 'in' = live, 'pre' = upcoming, 'post' = final
  shortDetail: string; // from status.type.shortDetail
  startTime: string; // ISO date
  quarterOrPeriod: string;
  clock: string;
  isLive: boolean;
  possession?: 'away' | 'home';
  headline: string;
  channel: string;
  excitementScore: number;
  venue: string;
  label: string; // AWAY @ HOME
}

export interface UserTeam {
  id: string;
  teamName: string;
  sport: SportCategory;
  league: string;
  status: 'LIVE' | 'UPCOMING' | 'FINAL';
  statusDetails: string;
  matchup: string;
  color: string;
}

export interface ChannelItem {
  id: string;
  number: string;
  name: string;
  callSign: string;
  logoBadge: string;
  category: string;
  currentShow: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    progressPercent: number;
  };
  nextShow: {
    title: string;
    startTime: string;
  };
  resolution: string;
  audio: string;
}

export interface SquaresBoardState {
  gameId: string;
  gameTitle: string;
  awayTeam: string;
  homeTeam: string;
  awayNumbers: number[]; // 10 digits
  homeNumbers: number[]; // 10 digits
  numbersDrawn: boolean;
  squares: {
    [key: string]: { // format: "row-col" (0-0 to 9-9)
      taken: boolean;
      owner?: string; // "YOU" or initials like "JD", "MR"
      isUser?: boolean;
    };
  };
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning';
  duration?: number;
}
