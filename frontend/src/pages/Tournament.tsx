import React, { useState } from "react";

interface Match {
  player1: string;
  player2: string;
  winner: string | null;
}

const Tournament: React.FC = () => {
  const [semifinals, setSemifinals] = useState<Match[]>([
    { player1: "Player 1", player2: "Player 2", winner: null },
    { player1: "Player 3", player2: "Player 4", winner: null },
  ]);

  const [finalMatch, setFinalMatch] = useState<Match>({
    player1: "",
    player2: "",
    winner: null,
  });

  const [tournamentWinner, setTournamentWinner] = useState<string | null>(null);

  const handleWinnerSelection = (round: "semifinal" | "final", matchIndex: number, winner: string) => {
    if (round === "semifinal") {
      const updatedSemifinals = [...semifinals];
      updatedSemifinals[matchIndex].winner = winner;
      setSemifinals(updatedSemifinals);

      // If both semifinals have winners, set up the final match
      if (updatedSemifinals[0].winner && updatedSemifinals[1].winner) {
        setFinalMatch({
          player1: updatedSemifinals[0].winner,
          player2: updatedSemifinals[1].winner,
          winner: null,
        });
      }
    } else if (round === "final") {
      setFinalMatch((prevFinal) => ({ ...prevFinal, winner }));
      setTournamentWinner(winner);
    }
  };

  return (
    <div>
      <h1>Tournament Lobby</h1>

      {/* Semifinals */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Semifinals</h2>
        {semifinals.map((match, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <p>
              {match.player1} vs {match.player2}
            </p>
            <button onClick={() => handleWinnerSelection("semifinal", index, match.player1)}>
              {match.player1} Wins
            </button>
            <button onClick={() => handleWinnerSelection("semifinal", index, match.player2)}>
              {match.player2} Wins
            </button>
            {match.winner && <p>Winner: {match.winner}</p>}
          </div>
        ))}
      </div>

      {/* Final Match */}
      {finalMatch.player1 && finalMatch.player2 && (
        <div style={{ marginBottom: "20px" }}>
          <h2>Final Match</h2>
          <p>
            {finalMatch.player1} vs {finalMatch.player2}
          </p>
          <button onClick={() => handleWinnerSelection("final", 0, finalMatch.player1)}>
            {finalMatch.player1} Wins
          </button>
          <button onClick={() => handleWinnerSelection("final", 0, finalMatch.player2)}>
            {finalMatch.player2} Wins
          </button>
          {finalMatch.winner && <p>Winner: {finalMatch.winner}</p>}
        </div>
      )}

      {/* Tournament Winner */}
      {tournamentWinner && (
        <div>
          <h2>Tournament Winner</h2>
          <p>{tournamentWinner}</p>
        </div>
      )}
    </div>
  );
};

export default Tournament;