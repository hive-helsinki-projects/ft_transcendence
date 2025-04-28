import { GameStats, TopPlayer, MatchHistory } from '../types/dashboard'

export const mockGameStats: GameStats = {
  wins: 15,
  losses: 8,
  winRate: 65,
  totalGames: 23,
}

export const mockTopPlayers: TopPlayer[] = [
  {
    id: '1',
    name: 'Player1',
    points: 12565,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
  },
  {
    id: '2',
    name: 'Player2',
    points: 10558,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2',
  },
  {
    id: '3',
    name: 'Player3',
    points: 9856,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3',
  },
  {
    id: '4',
    name: 'Player4',
    points: 7415,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4',
  },
]

export const mockRecentMatches: MatchHistory[] = [
  {
    id: '1',
    player: {
      name: 'Player1',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
    },
    opponent: {
      name: 'Player4',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4',
    },
    result: 'win',
    score: '11-9',
    date: '2h ago',
    mode: '1v1',
  },
  {
    id: '2',
    player: {
      name: 'Player2',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2',
    },
    opponent: {
      name: 'Player5',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player5',
    },
    result: 'loss',
    score: '9-11',
    date: '3h ago',
    mode: 'tournament',
  },
  {
    id: '3',
    player: {
      name: 'Player3',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3',
    },
    opponent: {
      name: 'Player6',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player6',
    },
    result: 'win',
    score: '11-7',
    date: '5h ago',
    mode: '1v1',
  },
] 