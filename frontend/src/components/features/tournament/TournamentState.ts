import { useState, useEffect } from 'react'

export interface Player {
  name: string
  avatar: string
}

export type MatchStatus = 'pending' | 'in_progress' | 'completed'
export type TournamentRound = 'semifinal' | 'final'

export interface Match {
  player1: Player
  player2: Player
  winner: string | null
  status: MatchStatus
}

export interface TournamentState {
  semifinals: Match[]
  finalMatch: Match
  champion: Player | null
  isLoading: boolean
  error: string | null
}

export const DEFAULT_SEMIFINALS: Match[] = [
  {
    player1: {
      name: 'Player 1',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
    },
    player2: {
      name: 'Player 2',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2',
    },
    winner: null,
    status: 'pending',
  },
  {
    player1: {
      name: 'Player 3',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3',
    },
    player2: {
      name: 'Player 4',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4',
    },
    winner: null,
    status: 'pending',
  },
]

export const DEFAULT_FINAL_MATCH: Match = {
  player1: { name: '', avatar: '' },
  player2: { name: '', avatar: '' },
  winner: null,
  status: 'pending',
}

export const useTournamentState = () => {
  const [state, setState] = useState<TournamentState>(() => {
    try {
      const savedSemifinals = localStorage.getItem('tournamentSemifinals')
      const savedFinal = localStorage.getItem('tournamentFinal')
      const savedChampion = localStorage.getItem('tournamentChampion')

      return {
        semifinals: savedSemifinals ? JSON.parse(savedSemifinals) : DEFAULT_SEMIFINALS,
        finalMatch: savedFinal ? JSON.parse(savedFinal) : DEFAULT_FINAL_MATCH,
        champion: savedChampion ? JSON.parse(savedChampion) : null,
        isLoading: false,
        error: null,
      }
    } catch (error) {
      console.error('Error loading tournament state:', error)
      return {
        semifinals: DEFAULT_SEMIFINALS,
        finalMatch: DEFAULT_FINAL_MATCH,
        champion: null,
        isLoading: false,
        error: 'Failed to load tournament state',
      }
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('tournamentSemifinals', JSON.stringify(state.semifinals))
      localStorage.setItem('tournamentFinal', JSON.stringify(state.finalMatch))
      localStorage.setItem('tournamentChampion', JSON.stringify(state.champion))
    } catch (error) {
      console.error('Error saving tournament state:', error)
      setState(prev => ({ ...prev, error: 'Failed to save tournament state' }))
    }
  }, [state.semifinals, state.finalMatch, state.champion])

  const updateState = (newState: Partial<TournamentState>) => {
    setState(prev => ({ ...prev, ...newState }))
  }

  const resetTournament = () => {
    try {
      localStorage.removeItem('tournamentSemifinals')
      localStorage.removeItem('tournamentFinal')
      localStorage.removeItem('tournamentChampion')
      window.location.reload()
    } catch (error) {
      console.error('Error resetting tournament:', error)
      setState(prev => ({ ...prev, error: 'Failed to reset tournament' }))
    }
  }

  return { state, updateState, resetTournament }
} 