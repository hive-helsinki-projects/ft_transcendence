import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingContainer from "../components/LoadingContainer";
import "../css/Tournament.css";

interface Match {
  player1: {
    name: string;
    avatar: string;
  };
  player2: {
    name: string;
    avatar: string;
  };
  winner: string | null;
  status: 'pending' | 'in_progress' | 'completed';
}

const Tournament: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize state from localStorage or default values
  const [semifinals, setSemifinals] = useState<Match[]>(() => {
    const saved = localStorage.getItem('tournamentSemifinals');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        player1: {
          name: "Player 1",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1"
        },
        player2: {
          name: "Player 2",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2"
        },
        winner: null,
        status: 'pending'
      },
      {
        player1: {
          name: "Player 3",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3"
        },
        player2: {
          name: "Player 4",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player4"
        },
        winner: null,
        status: 'pending'
      }
    ];
  });

  const [finalMatch, setFinalMatch] = useState<Match>(() => {
    const saved = localStorage.getItem('tournamentFinal');
    return saved ? JSON.parse(saved) : {
      player1: {
        name: "",
        avatar: ""
      },
      player2: {
        name: "",
        avatar: ""
      },
      winner: null,
      status: 'pending'
    };
  });

  const [champion, setChampion] = useState<{name: string; avatar: string} | null>(() => {
    const saved = localStorage.getItem('tournamentChampion');
    return saved ? JSON.parse(saved) : null;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tournamentSemifinals', JSON.stringify(semifinals));
  }, [semifinals]);

  useEffect(() => {
    localStorage.setItem('tournamentFinal', JSON.stringify(finalMatch));
  }, [finalMatch]);

  useEffect(() => {
    localStorage.setItem('tournamentChampion', JSON.stringify(champion));
  }, [champion]);

  // Handle game results when returning from a match
  useEffect(() => {
    const state = location.state as { matchType?: 'semifinal' | 'final', matchIndex?: number, winner?: string };
    if (state?.matchType && state?.winner) {
      handleMatchComplete(state.matchType, state.matchIndex || 0, state.winner);
      // Clear the location state to prevent re-processing
      navigate('/tournament', { replace: true });
    }
  }, [location.state]);

  const startMatch = (round: "semifinal" | "final", matchIndex: number) => {
    // Update match status to in_progress
    if (round === "semifinal") {
      const updatedSemifinals = [...semifinals];
      updatedSemifinals[matchIndex].status = 'in_progress';
      setSemifinals(updatedSemifinals);
    } else {
      setFinalMatch(prev => ({ ...prev, status: 'in_progress' }));
    }

    // Navigate to game with match information
    navigate('/game', {
      state: {
        matchType: round,
        matchIndex,
        player1: round === "semifinal" ? semifinals[matchIndex].player1 : finalMatch.player1,
        player2: round === "semifinal" ? semifinals[matchIndex].player2 : finalMatch.player2,
        returnTo: '/tournament'
      }
    });
  };

  const handleMatchComplete = (round: "semifinal" | "final", matchIndex: number, winner: string) => {
    if (round === "semifinal") {
      const updatedSemifinals = [...semifinals];
      const match = updatedSemifinals[matchIndex];
      match.winner = winner;
      match.status = 'completed';
      setSemifinals(updatedSemifinals);

      // If both semifinals have winners, set up the final match
      const otherMatchIndex = matchIndex === 0 ? 1 : 0;
      if (updatedSemifinals[otherMatchIndex].winner) {
        const finalist1 = {
          name: updatedSemifinals[0].winner === updatedSemifinals[0].player1.name
            ? updatedSemifinals[0].player1.name
            : updatedSemifinals[0].player2.name,
          avatar: updatedSemifinals[0].winner === updatedSemifinals[0].player1.name
            ? updatedSemifinals[0].player1.avatar
            : updatedSemifinals[0].player2.avatar
        };

        const finalist2 = {
          name: updatedSemifinals[1].winner === updatedSemifinals[1].player1.name
            ? updatedSemifinals[1].player1.name
            : updatedSemifinals[1].player2.name,
          avatar: updatedSemifinals[1].winner === updatedSemifinals[1].player1.name
            ? updatedSemifinals[1].player1.avatar
            : updatedSemifinals[1].player2.avatar
        };

        setFinalMatch({
          player1: finalist1,
          player2: finalist2,
          winner: null,
          status: 'pending'
        });
      }
    } else {
      setFinalMatch(prev => ({ ...prev, winner, status: 'completed' }));
      const winnerPlayer = winner === finalMatch.player1.name
        ? finalMatch.player1
        : finalMatch.player2;
      setChampion(winnerPlayer);
    }
  };

  // Add a reset tournament function
  const resetTournament = () => {
    localStorage.removeItem('tournamentSemifinals');
    localStorage.removeItem('tournamentFinal');
    localStorage.removeItem('tournamentChampion');
    window.location.reload();
  };

  return (
    <LoadingContainer>
      <div className="tournament-lobby">
        <div className="tournament-header">
          <h1>Tournament Lobby</h1>
          <button onClick={resetTournament} className="reset-tournament-button">
            Reset Tournament
          </button>
        </div>

        <div className="tournament-bracket">
          {/* Semifinals */}
          <div className="semifinals">
            {semifinals.map((match, index) => (
              <div key={index} className="match-card semifinal">
                <h3>SEMIFINAL {index + 1}</h3>
                <div className="match-players">
                  <div className="player">
                    <img src={match.player1.avatar} alt={match.player1.name} className="player-avatar" />
                    <span className="player-name">{match.player1.name}</span>
                  </div>
                  <span className="vs">VS</span>
                  <div className="player">
                    <img src={match.player2.avatar} alt={match.player2.name} className="player-avatar" />
                    <span className="player-name">{match.player2.name}</span>
                  </div>
                </div>
                {match.status === 'pending' && (
                  <div className="match-actions">
                    <button
                      onClick={() => startMatch("semifinal", index)}
                      className="start-match-button"
                    >
                      Start Match
                    </button>
                  </div>
                )}
                {match.status === 'in_progress' && (
                  <div className="match-status">
                    Match in Progress...
                  </div>
                )}
                {match.status === 'completed' && match.winner && (
                  <div className="match-result">
                    Winner: {match.winner}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Final Match */}
          {finalMatch.player1.name && finalMatch.player2.name && (
            <div className="match-card final">
              <h3>FINAL MATCH</h3>
              <div className="match-players">
                <div className="player">
                  <img src={finalMatch.player1.avatar} alt={finalMatch.player1.name} className="player-avatar" />
                  <span className="player-name">{finalMatch.player1.name}</span>
                </div>
                <span className="vs">VS</span>
                <div className="player">
                  <img src={finalMatch.player2.avatar} alt={finalMatch.player2.name} className="player-avatar" />
                  <span className="player-name">{finalMatch.player2.name}</span>
                </div>
              </div>
              {finalMatch.status === 'pending' && (
                <div className="match-actions">
                  <button
                    onClick={() => startMatch("final", 0)}
                    className="start-match-button"
                  >
                    Start Final Match
                  </button>
                </div>
              )}
              {finalMatch.status === 'in_progress' && (
                <div className="match-status">
                  Final Match in Progress...
                </div>
              )}
              {finalMatch.status === 'completed' && finalMatch.winner && (
                <div className="match-result">
                  Winner: {finalMatch.winner}
                </div>
              )}
            </div>
          )}

          {/* Champion */}
          {champion && (
            <div className="match-card champion">
              <h3>CHAMPION</h3>
              <div className="champion-display">
                <img src={champion.avatar} alt={champion.name} className="champion-avatar" />
                <span className="champion-name">{champion.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </LoadingContainer>
  );
};

export default Tournament;
