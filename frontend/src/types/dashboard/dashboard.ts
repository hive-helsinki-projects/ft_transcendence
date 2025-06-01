export interface UserPlayer {
  id: string
  name: string
  avatar: string
  isActive: boolean
  points: number
}

export interface TopPlayer {
  id: string
  name: string
  points: number
  avatar: string
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