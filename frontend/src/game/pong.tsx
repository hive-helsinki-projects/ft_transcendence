import { useEffect, useRef, useState } from 'react';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const maxScore = 5; // Set the score limit to end the game

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const paddleWidth = 10, paddleHeight = 60;
    let ballX = canvas.width / 2, ballY = canvas.height / 2;
    let ballSpeedX = 3, ballSpeedY = 3;

    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;
    const paddleSpeed = 6;

    let upPressed = false, downPressed = false;
    let wPressed = false, sPressed = false;

    // Keyboard event listeners
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') upPressed = true;
      if (e.key === 'ArrowDown') downPressed = true;
      if (e.key === 'w') wPressed = true;
      if (e.key === 's') sPressed = true;
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') upPressed = false;
      if (e.key === 'ArrowDown') downPressed = false;
      if (e.key === 'w') wPressed = false;
      if (e.key === 's') sPressed = false;
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    function update() {
      if (gameOver) return; // Stop updating if the game is over

      // Move paddles
      if (wPressed && paddle1Y > 0) paddle1Y -= paddleSpeed;
      if (sPressed && paddle1Y < canvas.height - paddleHeight) paddle1Y += paddleSpeed;
      if (upPressed && paddle2Y > 0) paddle2Y -= paddleSpeed;
      if (downPressed && paddle2Y < canvas.height - paddleHeight) paddle2Y += paddleSpeed;

      // Move ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Ball collision with top & bottom
      if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

      // Ball collision with paddles
      if (
        (ballX <= paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) ||
        (ballX >= canvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight)
      ) {
        ballSpeedX *= -1; // Reverse direction
      }

      // Ball out of bounds (reset position and update score)
      if (ballX < 0) {
        if (!gameOver) {
          setScore((prev) => {
            const newScore = { ...prev, player2: prev.player2 + 1 };
            if (newScore.player2 >= maxScore) setGameOver(true);
            return newScore;
          });
          resetBall();
        }
      } else if (ballX > canvas.width) {
        if (!gameOver) {
          setScore((prev) => {
            const newScore = { ...prev, player1: prev.player1 + 1 };
            if (newScore.player1 >= maxScore) setGameOver(true);
            return newScore;
          });
          resetBall();
        }
      }
    }

    function resetBall() {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = 3 * (Math.random() > 0.5 ? 1 : -1);
      ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
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

      // Draw large scores
      ctx.fillStyle = 'white';
      ctx.font = '50px Arial';
      ctx.textAlign = 'center';

      // Player 1 score on the left
      ctx.fillText(score.player1.toString(), canvas.width / 4, 50);

      // Player 2 score on the right
      ctx.fillText(score.player2.toString(), (canvas.width / 4) * 3, 50);

      // Game Over message
      if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        const winner = score.player1 >= maxScore ? 'Player 1' : 'Player 2';
        ctx.fillText(`Game Over! ${winner} Wins!`, canvas.width / 2, canvas.height / 2);
      }
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [score, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <canvas ref={canvasRef} width="800" height="400" className="border-2 border-white"></canvas>
    </div>
  );
}