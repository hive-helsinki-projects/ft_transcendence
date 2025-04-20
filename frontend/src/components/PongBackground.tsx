import React, { useEffect, useRef } from 'react'
import '../css/PongBackground.css'

const PongBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match container size
    const resize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Redraw background after resize
      ctx.fillStyle = '#1E1E2E'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Initial resize
    resize()

    // Add resize observer for more reliable size updates
    const resizeObserver = new ResizeObserver(() => {
      resize()
    })
    resizeObserver.observe(container)

    // Game properties
    const paddleHeight = 80
    const paddleWidth = 10
    const ballRadius = 6

    // Ball properties
    let ballX = canvas.width / 2
    let ballY = canvas.height / 2
    let ballSpeedX = 4
    let ballSpeedY = 4

    // Paddle properties
    let leftPaddleY = canvas.height / 2 - paddleHeight / 2
    let rightPaddleY = canvas.height / 2 - paddleHeight / 2

    // Score properties
    let leftScore = 0
    let rightScore = 0

    // Center line properties
    const centerLineWidth = 2
    const centerLineDashLength = 10

    const drawCenterLine = () => {
      ctx.beginPath()
      ctx.setLineDash([centerLineDashLength])
      ctx.lineWidth = centerLineWidth
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])
    }

    const drawPaddle = (x: number, y: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.fillRect(x, y, paddleWidth, paddleHeight)
    }

    const drawBall = () => {
      ctx.beginPath()
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.shadowColor = '#fff'
      ctx.shadowBlur = 15
      ctx.fill()
      ctx.closePath()
      ctx.shadowBlur = 0
    }

    const drawScore = () => {
      ctx.font = '48px Arial'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.textAlign = 'center'
      ctx.fillText(leftScore.toString(), canvas.width / 4, 60)
      ctx.fillText(rightScore.toString(), (canvas.width * 3) / 4, 60)
    }

    const animate = () => {
      if (!ctx || !canvas) return

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(30, 30, 46, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw game elements
      drawCenterLine()
      drawPaddle(0, leftPaddleY)
      drawPaddle(canvas.width - paddleWidth, rightPaddleY)
      drawBall()
      drawScore()

      // Move paddles (AI simulation)
      leftPaddleY += (ballY - (leftPaddleY + paddleHeight / 2)) * 0.1
      rightPaddleY += (ballY - (rightPaddleY + paddleHeight / 2)) * 0.1

      // Keep paddles within bounds
      leftPaddleY = Math.max(
        0,
        Math.min(canvas.height - paddleHeight, leftPaddleY),
      )
      rightPaddleY = Math.max(
        0,
        Math.min(canvas.height - paddleHeight, rightPaddleY),
      )

      // Move ball
      ballX += ballSpeedX
      ballY += ballSpeedY

      // Ball collision with paddles
      if (
        (ballX - ballRadius < paddleWidth &&
          ballY > leftPaddleY &&
          ballY < leftPaddleY + paddleHeight) ||
        (ballX + ballRadius > canvas.width - paddleWidth &&
          ballY > rightPaddleY &&
          ballY < rightPaddleY + paddleHeight)
      ) {
        ballSpeedX = -ballSpeedX * 1.1 // Increase speed slightly on paddle hits
        const paddleCenter =
          ballX < canvas.width / 2
            ? leftPaddleY + paddleHeight / 2
            : rightPaddleY + paddleHeight / 2
        const hitPos = (ballY - paddleCenter) / (paddleHeight / 2)
        ballSpeedY = hitPos * 6 // Angle based on hit position
      }

      // Ball collision with walls
      if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY
      }

      // Ball out of bounds
      if (ballX < 0) {
        rightScore++
        ballX = canvas.width / 2
        ballY = canvas.height / 2
        ballSpeedX = 4
        ballSpeedY = (Math.random() - 0.5) * 8
      } else if (ballX > canvas.width) {
        leftScore++
        ballX = canvas.width / 2
        ballY = canvas.height / 2
        ballSpeedX = -4
        ballSpeedY = (Math.random() - 0.5) * 8
      }

      // Keep speed within bounds
      const maxSpeed = 8
      ballSpeedX = Math.max(Math.min(ballSpeedX, maxSpeed), -maxSpeed)
      ballSpeedY = Math.max(Math.min(ballSpeedY, maxSpeed), -maxSpeed)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className="pong-container">
      <canvas ref={canvasRef} className="pong-canvas" />
    </div>
  )
}

export default PongBackground
