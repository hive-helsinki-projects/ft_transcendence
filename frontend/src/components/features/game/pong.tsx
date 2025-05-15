import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoadingContainer from '../../LoadingContainer'
import '../../../assets/styles/Pong.css'

// Constants
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 100
const BALL_RADIUS = 8
const PADDLE_SPEED = 7
const MAX_SCORE = 11

interface GameState {
  matchType: 'semifinal' | 'final' | '1v1'
  matchId: number
  player1: { name: string; avatar: string; id: number}
  player2: { name: string; avatar: string; id: number }
  returnTo?: string
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ballSpeedX = useRef(4)
  const ballSpeedY = useRef(4)

  const location = useLocation()
  const navigate = useNavigate()
  const gameState = location.state as GameState

  const [scores, setScores] = useState({ player1: 0, player2: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [matchStatus, setMatchStatus] = useState<
    'pending' | 'in_progress' | 'completed'
  >('pending')
  const [matchResult, setMatchResult] = useState<string | null>(null)
  const [matchStarted, setMatchStarted] = useState(false)


  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    // Game variables
    let paddle1Y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2
    let paddle2Y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2
    let ballX = CANVAS_WIDTH / 2
    let ballY = CANVAS_HEIGHT / 2
    let paddle1Up = false
    let paddle1Down = false
    let paddle2Up = false
    let paddle2Down = false

    function keyDownHandler(e: KeyboardEvent) {
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault()
      if (e.key === 'w' || e.key === 'W') paddle1Up = true
      if (e.key === 's' || e.key === 'S') paddle1Down = true
      if (e.key === 'ArrowUp') paddle2Up = true
      if (e.key === 'ArrowDown') paddle2Down = true

      if (e.key === 'Spacebar' || e.key === ' ') setMatchStarted(true)
    }

    function keyUpHandler(e: KeyboardEvent) {
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault()
      if (e.key === 'w' || e.key === 'W') paddle1Up = false
      if (e.key === 's' || e.key === 'S') paddle1Down = false
      if (e.key === 'ArrowUp') paddle2Up = false
      if (e.key === 'ArrowDown') paddle2Down = false
    }

    function resetBall() {
      ballX = CANVAS_WIDTH / 2
      ballY = CANVAS_HEIGHT / 2
      ballSpeedX.current = (Math.random() > 0.5 ? 1 : -1) * 3
      ballSpeedY.current =
        (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4 + 2)
    }

    function update() {
      if (gameOver || !matchStarted) return

      // Move paddles
      if (paddle1Up && paddle1Y > 0) paddle1Y -= PADDLE_SPEED
      if (paddle1Down && paddle1Y < CANVAS_HEIGHT - PADDLE_HEIGHT)
        paddle1Y += PADDLE_SPEED
      if (paddle2Up && paddle2Y > 0) paddle2Y -= PADDLE_SPEED
      if (paddle2Down && paddle2Y < CANVAS_HEIGHT - PADDLE_HEIGHT)
        paddle2Y += PADDLE_SPEED

      // Move ball
      ballX += ballSpeedX.current
      ballY += ballSpeedY.current

      // Ball collision with top and bottom
      if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > CANVAS_HEIGHT) {
        ballSpeedY.current = -ballSpeedY.current
      }

      // Ball collision with left paddle
      if (
        ballX - BALL_RADIUS <= PADDLE_WIDTH &&
        ballY + BALL_RADIUS >= paddle1Y &&
        ballY - BALL_RADIUS <= paddle1Y + PADDLE_HEIGHT
      ) {
        ballX = PADDLE_WIDTH + BALL_RADIUS
        ballSpeedX.current = -ballSpeedX.current * 1.1
        ballSpeedY.current += (ballY - (paddle1Y + PADDLE_HEIGHT / 2)) * 0.1
      }

      // Ball collision with right paddle
      if (
        ballX + BALL_RADIUS >= CANVAS_WIDTH - PADDLE_WIDTH &&
        ballY + BALL_RADIUS >= paddle2Y &&
        ballY - BALL_RADIUS <= paddle2Y + PADDLE_HEIGHT
      ) {
        ballX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_RADIUS
        ballSpeedX.current = -ballSpeedX.current * 1.1
        ballSpeedY.current += (ballY - (paddle2Y + PADDLE_HEIGHT / 2)) * 0.1
      }

      // Clamp ball speed
      ballSpeedX.current = Math.max(Math.min(ballSpeedX.current, 10), -10)
      ballSpeedY.current = Math.max(Math.min(ballSpeedY.current, 10), -10)

      // Score points
      if (ballX - BALL_RADIUS < 0) {
        setScores((prev) => {
          const newScores = { ...prev, player2: prev.player2 + 1 }
          checkWinCondition(newScores)
          return newScores
        })
        resetBall()
      }

      if (ballX + BALL_RADIUS > CANVAS_WIDTH) {
        setScores((prev) => {
          const newScores = { ...prev, player1: prev.player1 + 1 }
          checkWinCondition(newScores)
          return newScores
        })
        resetBall()
      }
    }

    async function checkWinCondition(currentScores: { player1: number; player2: number }) {
      if (currentScores.player1 >= MAX_SCORE || currentScores.player2 >= MAX_SCORE) {
        if ((currentScores.player1 > 20 || currentScores.player2 > 20) || Math.abs(currentScores.player1 - currentScores.player2) >= 2) {
          setGameOver(true);
          setMatchStatus('completed');
          const winner = currentScores.player1 > currentScores.player2
            ? gameState.player1
            : gameState.player2;
          setMatchResult(`Winner: ${winner.name}`);

          await sendMatchResult(gameState.matchId, winner.id, scores.player1, scores.player2)

          async function sendMatchResult(matchId: number, winnerId: number, score1: number, score2: number) {
            try {
              await fetch(`/match-histories/${matchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                  type: '1v1',
                  winner_id: winnerId,
                  players: [
                    {
                      player_id: gameState.player1.id,
                      score: score1,
                      round: 0
                    },
                    {
                      player_id: gameState.player2.id,
                      score: score2,
                      round: 0
                    }
                  ]
                })
              })
            } catch (error) {
              console.log('Failed to update match result', error)
            }
          }

          setTimeout(() => {
            if (gameState?.returnTo) {
              navigate(gameState.returnTo, {
                state: {
                  matchType: gameState.matchType,
                  matchIndex: gameState.matchId,
                  winner,
                },
              })
            }
          }, 3000)
        }
      }
    }

    function draw() {
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.strokeStyle = 'white'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(CANVAS_WIDTH / 2, 0)
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
      ctx.stroke()

      ctx.fillStyle = 'white'
      ctx.fillRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT)
      ctx.fillRect(
        CANVAS_WIDTH - PADDLE_WIDTH,
        paddle2Y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
      )

      ctx.beginPath()
      ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2)
      ctx.fill()

      ctx.font = '32px Arial'
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.fillText(scores.player1.toString(), CANVAS_WIDTH / 4, 50)
      ctx.fillText(scores.player2.toString(), (CANVAS_WIDTH / 4) * 3, 50)

      ctx.font = '16px Arial'
      ctx.fillText(gameState?.player1?.name || 'Player 1', CANVAS_WIDTH / 4, 80)
      ctx.fillText(
        gameState?.player2?.name || 'Player 2',
        (CANVAS_WIDTH / 4) * 3,
        80,
      )

      if (matchStatus === 'in_progress') {
        ctx.font = '20px Arial'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.fillText(`${matchStarted ? 'Match in Progress...' : 'Press spacebar to start game...'}`, CANVAS_WIDTH / 2, 30)
      }

      if (matchResult) {
        ctx.font = '24px Arial'
        ctx.fillStyle = 'white'
        ctx.fillText(matchResult, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
        ctx.font = '16px Arial'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.fillText(
          'Returning to lobby...',
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 30,
        )
      }
    }

    setMatchStatus('in_progress')
    let animationFrameId: number

    const loop = () => {
      update()
      draw()
      animationFrameId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
      document.removeEventListener('keyup', keyUpHandler)
      cancelAnimationFrame(animationFrameId)
    }
  }, [scores, gameOver, matchStatus, matchResult, navigate, gameState, matchStarted])

  return (
    <LoadingContainer>
      <div className="game-container">
        {gameState?.player1 && gameState?.player2 && (
          <div className="game-header">
            <div className="player-info">
              <img
                src={gameState.player1.avatar}
                alt={gameState.player1.name}
                className="player-avatar"
              />
              <span className="player-name">{gameState.player1.name}</span>
              <span className="player-score">{scores.player1}</span>
              <span className="player-controls">W/S keys</span>
            </div>
            <div className="match-info">
              <div className="match-type">
                {gameState.matchType === 'final'
                  ? 'FINAL MATCH'
                  : gameState.matchType === '1v1'
                    ? '1v1 MATCH'
                    : `SEMIFINAL ${gameState.matchIndex! + 1}`}
              </div>
              <div className="win-condition">First to 11 points (win by 2)</div>
            </div>
            <div className="player-info">
              <img
                src={gameState.player2.avatar}
                alt={gameState.player2.name}
                className="player-avatar"
              />
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
  )
}
