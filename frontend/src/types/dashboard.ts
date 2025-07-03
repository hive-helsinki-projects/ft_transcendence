export interface UserPlayer {
  id: number
  display_name: string
  avatar: string
  isActive: boolean
  points: number
  wins?: number
  losses?: number
}

export interface TopPlayer {
  id: string
  name: string
  points: number
  avatar: string
  wins: number
  losses: number
}

export interface MatchHistory {
  id: string
  player: {
    name: string
    avatar: string
  }
  opponent: {
    name: string
    avatar: string
  }
  result: 'win' | 'loss'
  score: string
  date: string
  mode: '1v1' | 'tournament'
}

export interface GameStats {
  wins: number
  losses: number
  winRate: number
  totalGames: number
}

interface TournamentPlayer {
  player_id: number
  score: number
}

export interface TournamentMatch {
  match_id: number
  date: string
  round: number
  players: TournamentPlayer[]
  winner: {
    player_id: number
  }
}

export interface Tournament {
  id: number
  name: string
  status: string
  current_round: number
  winner_id: number
  created_at: string
  matches: TournamentMatch[]
}