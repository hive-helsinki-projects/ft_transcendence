import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingContainer from '../components/LoadingContainer';
import '../css/Pong.css';

interface GameState {
  matchType?: 'semifinal' | 'final' | '1v1';
  matchIndex?: number;
  player1?: {
    name: string;
    avatar: string;
  };
  player2?: {
    name: string;
    avatar: string;
  };
  returnTo?: string;
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const gameState = location.state as GameState;
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [matchStatus, setMatchStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [matchResult, setMatchResult] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 800;
    canvas.height = 600;

    // Game variables
    let paddle1Y = canvas.height / 2 - 50;
    let paddle2Y = canvas.height / 2 - 50;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;
    const paddleWidth = 10;
    const paddleHeight = 100;
    let paddle1Up = false;
    let paddle1Down = false;
    let paddle2Up = false;
    let paddle2Down = false;
    const paddleSpeed = 8;
    const maxScore = 11;

    function keyDownHandler(e: KeyboardEvent) {
      if (e.key === 'w' || e.key === 'W') paddle1Up = true;
      if (e.key === 's' || e.key === 'S') paddle1Down = true;
      if (e.key === 'ArrowUp') paddle2Up = true;
      if (e.key === 'ArrowDown') paddle2Down = true;
    }

    function keyUpHandler(e: KeyboardEvent) {
      if (e.key === 'w' || e.key === 'W') paddle1Up = false;
      if (e.key === 's' || e.key === 'S') paddle1Down = false;
      if (e.key === 'ArrowUp') paddle2Up = false;
      if (e.key === 'ArrowDown') paddle2Down = false;
    }

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    function resetBall() {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      // Randomize initial direction
      ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5;
      // Ensure minimum vertical movement
      ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 2);
    }

    function update() {
      if (gameOver) return;

      // Move paddles
      if (paddle1Up && paddle1Y > 0) paddle1Y -= paddleSpeed;
      if (paddle1Down && paddle1Y < canvas.height - paddleHeight) paddle1Y += paddleSpeed;
      if (paddle2Up && paddle2Y > 0) paddle2Y -= paddleSpeed;
      if (paddle2Down && paddle2Y < canvas.height - paddleHeight) paddle2Y += paddleSpeed;

      // Move ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Ball collision with top and bottom
      if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
      }

      // Ball collision with paddles
      if (
        ballX < paddleWidth &&
        ballY > paddle1Y &&
        ballY < paddle1Y + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX * 1.1; // Increase speed slightly
        ballSpeedY += (ballY - (paddle1Y + paddleHeight / 2)) * 0.1; // Add angle based on hit position
      }

      if (
        ballX > canvas.width - paddleWidth &&
        ballY > paddle2Y &&
        ballY < paddle2Y + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX * 1.1; // Increase speed slightly
        ballSpeedY += (ballY - (paddle2Y + paddleHeight / 2)) * 0.1; // Add angle based on hit position
      }

      // Score points
      if (ballX < 0) {
        setScores(prev => {
          const newScores = { ...prev, player2: prev.player2 + 1 };
          checkWinCondition(newScores);
          return newScores;
        });
        resetBall();
      }
      if (ballX > canvas.width) {
        setScores(prev => {
          const newScores = { ...prev, player1: prev.player1 + 1 };
          checkWinCondition(newScores);
          return newScores;
        });
        resetBall();
      }
    }

    function checkWinCondition(currentScores: { player1: number; player2: number }) {
      if (currentScores.player1 >= maxScore || currentScores.player2 >= maxScore) {
        if (Math.abs(currentScores.player1 - currentScores.player2) >= 2) {
          setGameOver(true);
          setMatchStatus('completed');
          const winner = currentScores.player1 > currentScores.player2 
            ? gameState?.player1?.name 
            : gameState?.player2?.name;
          setMatchResult(`Winner: ${winner}`);
          
          // Wait a moment before navigating back
          setTimeout(() => {
            if (gameState?.returnTo) {
              navigate(gameState.returnTo, {
                state: {
                  matchType: gameState.matchType,
                  matchIndex: gameState.matchIndex,
                  winner
                }
              });
            }
          }, 3000);
        }
      }
    }

    function draw() {
      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw middle line
      ctx.strokeStyle = 'white';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Draw paddles
      ctx.fillStyle = 'white';
      ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw scores
      ctx.font = '32px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(scores.player1.toString(), canvas.width / 4, 50);
      ctx.fillText(scores.player2.toString(), (canvas.width / 4) * 3, 50);

      // Draw player names
      ctx.font = '16px Arial';
      ctx.fillText(gameState?.player1?.name || 'Player 1', canvas.width / 4, 80);
      ctx.fillText(gameState?.player2?.name || 'Player 2', (canvas.width / 4) * 3, 80);

      // Draw match status
      if (matchStatus === 'in_progress') {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('Match in Progress...', canvas.width / 2, 30);
      }

      // Draw match result
      if (matchResult) {
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(matchResult, canvas.width / 2, canvas.height / 2);
        ctx.font = '16px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('Returning to lobby...', canvas.width / 2, canvas.height / 2 + 30);
      }
    }

    // Start the game when component mounts
    setMatchStatus('in_progress');
    const gameLoop = setInterval(() => {
      update();
      draw();
    }, 1000 / 60);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      clearInterval(gameLoop);
    };
  }, [scores, gameOver, matchStatus, matchResult, navigate, gameState]);

  return (
    <LoadingContainer>
      <div className="game-container">
        {gameState?.player1 && gameState?.player2 && (
          <div className="game-header">
            <div className="player-info">
              <img src={gameState.player1.avatar} alt={gameState.player1.name} className="player-avatar" />
              <span className="player-name">{gameState.player1.name}</span>
              <span className="player-score">{scores.player1}</span>
              <span className="player-controls">W/S keys</span>
            </div>
            <div className="match-info">
              <div className="match-type">
                {gameState.matchType === 'final' ? 'FINAL MATCH' : gameState.matchType === '1v1' ? '1v1 MATCH' : `SEMIFINAL ${gameState.matchIndex! + 1}`}
              </div>
              <div className="win-condition">
                First to 11 points (win by 2)
              </div>
            </div>
            <div className="player-info">
              <img src={gameState.player2.avatar} alt={gameState.player2.name} className="player-avatar" />
              <span className="player-name">{gameState.player2.name}</span>
              <span className="player-score">{scores.player2}</span>
              <span className="player-controls">↑/↓ keys</span>
            </div>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          width="800" 
          height="600" 
          className="game-canvas"
        />
      </div>
    </LoadingContainer>
  );
}