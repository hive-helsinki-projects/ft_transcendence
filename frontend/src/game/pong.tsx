import { useEffect, useRef } from 'react';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        ballX <= paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight ||
        ballX >= canvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight
      ) {
        ballSpeedX *= -1; // Reverse direction
      }

      // Ball out of bounds (reset position)
      if (ballX < 0 || ballX > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = 3 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
      }
    }

    function draw() {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw paddles
      ctx.fillStyle = 'white';
      ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
      ctx.fill();
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
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <canvas ref={canvasRef} width="800" height="400" className="border-2 border-white"></canvas>
      <a href="/" className="mt-4 text-blue-400">Back to Home</a>
    </div>
  );
}
