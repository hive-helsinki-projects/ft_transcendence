import { LoadingContainer } from '@components/index'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '@assets/styles/Pong.css'
import { useTranslate } from '@hooks/index'
import { BaseService } from '@services/baseService'

// Constants
const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 600
const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 100
const BALL_RADIUS = 8
const PADDLE_SPEED = 7
const MAX_SCORE = 2
const PADDLE_ROUNDING = 4

let trailLength = 20
let rightPaddleHit = 0
let leftPaddleHit = 0

let trailT = 0
let trailInv = 0
let trailR = 0
let trailG = 0
let trailB = 0
let trailAlpha = 0
let trailX = 0
let trailY = 0
let trailRad = 0

interface GameState {
  matchType: 'semifinal' | 'final' | '1v1'
  matchId: number
  player1: { name: string; avatar: string; id: number }
  player2: { name: string; avatar: string; id: number }
  returnTo?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}
let particles: Particle[] = []
let isPaused = false

export const Game: React.FC = () => {
  // track if we’re in portrait
  const [isPortrait, setIsPortrait] = useState(false)

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

  const t = useTranslate()

  useEffect(() => {
    const so = screen.orientation as any
    if (so && typeof so.lock === 'function') {
      so.lock('landscape').catch(() => {})
    }

    const check = () => setIsPortrait(window.innerHeight > window.innerWidth)
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    check()

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
    let ballDirectionX = 0
    let ballDirectionY = 0

    function keyDownHandler(e: KeyboardEvent) {
      if (['ArrowUp', 'ArrowDown', ' ', 'Spacebar'].includes(e.key))
        e.preventDefault()
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

    function onGoal(x: number, y: number) {
      // generate ~30 particles bursting out
      let angle = 0
      for (let i = 0; i < 40; i++) {
        if (ballX > CANVAS_WIDTH / 2) {
          angle = Math.random() * Math.PI + Math.PI / 2
        } else {
          angle = Math.random() * Math.PI - Math.PI / 2
        }
        const speed = Math.random() * 4 + 2
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60, // frames until they vanish
        })
      }
      isPaused = true
      setTimeout(() => {
        particles = []
        isPaused = false
        resetBall()
      }, 1000) // 1s delay
    }

    function update() {
      if (gameOver || !matchStarted || isPaused) return

      // Move paddles
      if (paddle1Up && paddle1Y > 0) paddle1Y -= PADDLE_SPEED
      if (paddle1Down && paddle1Y < CANVAS_HEIGHT - PADDLE_HEIGHT)
        paddle1Y += PADDLE_SPEED
      if (paddle2Up && paddle2Y > 0) paddle2Y -= PADDLE_SPEED
      if (paddle2Down && paddle2Y < CANVAS_HEIGHT - PADDLE_HEIGHT)
        paddle2Y += PADDLE_SPEED

      // update ball direction from previous frame for trail effect
      ballDirectionX = ballSpeedX.current
      ballDirectionY = ballSpeedY.current

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
        leftPaddleHit++
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
        rightPaddleHit++
      }

      // Clamp ball speed
      ballSpeedX.current = Math.max(Math.min(ballSpeedX.current, 10), -10)
      ballSpeedY.current = Math.max(Math.min(ballSpeedY.current, 10), -10)

      trailLength =
        Math.max(Math.abs(ballSpeedX.current), Math.abs(ballSpeedY.current)) *
        1.4
      if (trailLength < 10) trailLength = 10

      // Score points
      if (ballX - BALL_RADIUS < 0) {
        setScores((prev) => {
          const newScores = { ...prev, player2: prev.player2 + 1 }
          checkWinCondition(newScores)
          return newScores
        })
        onGoal(ballX, ballY)
      }

      if (ballX + BALL_RADIUS > CANVAS_WIDTH) {
        setScores((prev) => {
          const newScores = { ...prev, player1: prev.player1 + 1 }
          checkWinCondition(newScores)
          return newScores
        })
        onGoal(ballX, ballY)
      }
    }

    async function checkWinCondition(currentScores: {
      player1: number
      player2: number
    }) {
      if (
        currentScores.player1 >= MAX_SCORE ||
        currentScores.player2 >= MAX_SCORE
      ) {
        if (
          currentScores.player1 > 20 ||
          currentScores.player2 > 20 ||
          Math.abs(currentScores.player1 - currentScores.player2) >= 2
        ) {
          setGameOver(true)
          setMatchStatus('completed')
          if (!gameState) {
            setMatchResult(
              `Winner: ${currentScores.player1 > currentScores.player2 ? 'player 1' : 'player2'}`,
            )
            setTimeout(() => {
              navigate('/dashboard')
            }, 3000)
            return
          }
          const winner =
            currentScores.player1 > currentScores.player2
              ? gameState.player1
              : gameState.player2
          setMatchResult(`Winner: ${winner.name}`)

          await sendMatchResult(
            gameState.matchId,
            winner.id,
            currentScores.player1,
            currentScores.player2,
          )

          async function sendMatchResult(
            matchId: number,
            winnerId: number,
            score1: number,
            score2: number,
          ) {
            try {
              await BaseService.put(`/match-histories/${matchId}`, {
                winner_id: winnerId,
                players: [
                  {
                    player_id: gameState.player1.id,
                    score: score1,
                  },
                  {
                    player_id: gameState.player2.id,
                    score: score2,
                  },
                ],
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
      const bg = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0)
      bg.addColorStop(0, ' #3c86ff')
      bg.addColorStop(0.5, 'black')
      bg.addColorStop(1, ' #ff5c5c')

      // paint the background
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.strokeStyle = 'white'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(CANVAS_WIDTH / 2, 0)
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
      ctx.stroke()

      ctx.fillStyle = ' #ff5c5c'
      ctx.beginPath()
      ctx.roundRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_ROUNDING)
      ctx.fill()

      ctx.fillStyle = ' #3c86ff'
      ctx.beginPath()
      ctx.roundRect(
        CANVAS_WIDTH - PADDLE_WIDTH,
        paddle2Y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        PADDLE_ROUNDING,
      )
      ctx.fill()

      particles.forEach((p) => {
        p.life--
        p.x += p.vx
        p.y += p.vy
        ctx.globalAlpha = p.life / 60
        ctx.fillStyle = 'gold'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      particles = particles.filter((p) => p.life > 0)
      if (isPaused) return

      // paddle bounce effect
      if (rightPaddleHit > 0) {
        ctx.fillStyle = ' #3c86ff'
        ctx.beginPath()
        ctx.roundRect(
          CANVAS_WIDTH - PADDLE_WIDTH - rightPaddleHit,
          paddle2Y,
          PADDLE_WIDTH + rightPaddleHit,
          PADDLE_HEIGHT,
          PADDLE_ROUNDING,
        )
        ctx.fill()
        rightPaddleHit++
        if (rightPaddleHit > 8) {
          rightPaddleHit = 0
        }
      }

      if (leftPaddleHit > 0) {
        ctx.fillStyle = ' #ff5c5c'
        ctx.beginPath()
        ctx.roundRect(
          0,
          paddle1Y,
          PADDLE_WIDTH + leftPaddleHit,
          PADDLE_HEIGHT,
          PADDLE_ROUNDING,
        )
        ctx.fill()
        leftPaddleHit++
        if (leftPaddleHit > 8) {
          leftPaddleHit = 0
        }
      }

      // ball trail effect
      const endColor =
        ballDirectionX > 0 ? { r: 0, g: 0, b: 255 } : { r: 255, g: 0, b: 0 }
      for (let i = 0; i < trailLength; i++) {
        trailT = i / trailLength
        trailInv = 1 - trailT
        trailR = Math.round(255 * trailInv + endColor.r * trailT)
        trailG = Math.round(255 * trailInv + endColor.g * trailT)
        trailB = Math.round(255 * trailInv + endColor.b * trailT)
        trailAlpha = trailInv

        ctx.fillStyle = `rgba(${trailR},${trailG},${trailB},${trailAlpha})`

        trailX = ballX - ballDirectionX * i
        trailY = ballY - ballDirectionY * i
        trailRad = BALL_RADIUS * trailInv

        ctx.beginPath()
        ctx.arc(trailX, trailY, trailRad, 0, Math.PI * 2)
        ctx.fill()
      }

      // head:
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2)
      ctx.fill()

      const tX = ballX / CANVAS_WIDTH
      let r, g, b
      if (tX < 0.5) {
        const t = tX / 0.5
        r = 0xff * (1 - t) + 0xff * t
        g = 0x5c * (1 - t) + 0xff * t
        b = 0x5c * (1 - t) + 0x00 * t
      } else {
        const t = (tX - 0.5) / 0.5
        r = 0xff * (1 - t) + 0x3c * t
        g = 0xff * (1 - t) + 0x86 * t
        b = 0xff * (1 - t) + 0xff * t
      }

      ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
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
        ctx.fillText(
          `${matchStarted ? t('Match in Progress...') : t('Press spacebar to start game...')}`,
          CANVAS_WIDTH / 2,
          30,
        )
      }

      if (matchResult) {
        ctx.font = '24px Arial'
        ctx.fillStyle = 'white'
        ctx.fillText(matchResult, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
        ctx.font = '16px Arial'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.fillText(
          t('Returning to lobby...'),
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
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)

      document.removeEventListener('keydown', keyDownHandler)
      document.removeEventListener('keyup', keyUpHandler)
      cancelAnimationFrame(animationFrameId)
    }
  }, [
    scores,
    gameOver,
    matchStatus,
    matchResult,
    navigate,
    gameState,
    matchStarted,
  ])

  return (
    <>
      {isPortrait && (
        <div className="rotate-overlay">
          {t('Please rotate your device to landscape')}
        </div>
      )}
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
                <span className="player-controls">{t('W/S keys')}</span>
              </div>
              <div className="match-info">
                <div className="match-type">
                  {gameState.matchType === 'final'
                    ? t('matchType.final')
                    : gameState.matchType === '1v1'
                      ? 'matchType.1v1'
                      : t('matchType.semifinal')}
                </div>
                <div className="win-condition">
                  {t('First to 11 points (win by 2)')}
                </div>
              </div>
              <div className="player-info">
                <img
                  src={gameState.player2.avatar}
                  alt={gameState.player2.name}
                  className="player-avatar"
                />
                <span className="player-name">{gameState.player2.name}</span>
                <span className="player-score">{scores.player2}</span>
                <span className="player-controls">{t('↑/↓ keys')}</span>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="game-canvas" />
        </div>
      </LoadingContainer>
    </>
  )
}
