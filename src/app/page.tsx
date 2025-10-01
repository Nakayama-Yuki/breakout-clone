"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ゲーム設定
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // パドル設定
    const paddleWidth = 100;
    const paddleHeight = 15;
    let paddleX = (CANVAS_WIDTH - paddleWidth) / 2;
    const paddleSpeed = 7;

    // ボール設定
    let ballX = CANVAS_WIDTH / 2;
    let ballY = CANVAS_HEIGHT - 100;
    const ballRadius = 8;
    let ballDX = 4;
    let ballDY = -4;

    // ブロック設定
    const brickRowCount = 5;
    const brickColumnCount = 8;
    const brickWidth = 90;
    const brickHeight = 25;
    const brickPadding = 10;
    const brickOffsetTop = 50;
    const brickOffsetLeft = 35;

    const bricks: { x: number; y: number; status: number; color: string }[][] =
      [];
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

    // ブロックの初期化
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          status: 1,
          color: colors[r % colors.length],
        };
      }
    }

    // キーボード操作
    let rightPressed = false;
    let leftPressed = false;

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
      }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
      }
    };

    // マウス操作
    const mouseMoveHandler = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("mousemove", mouseMoveHandler);

    // 描画関数
    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(
        paddleX,
        CANVAS_HEIGHT - paddleHeight - 10,
        paddleWidth,
        paddleHeight
      );
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brick = bricks[c][r];
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
            ctx.fillStyle = brick.color;
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const drawScore = () => {
      ctx.font = "20px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`スコア: ${score}`, 20, 30);
    };

    // 衝突判定
    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const brick = bricks[c][r];
          if (brick.status === 1) {
            if (
              ballX > brick.x &&
              ballX < brick.x + brickWidth &&
              ballY > brick.y &&
              ballY < brick.y + brickHeight
            ) {
              ballDY = -ballDY;
              brick.status = 0;
              setScore((prev) => prev + 10);

              // すべてのブロックが壊れたかチェック
              let allBricksDestroyed = true;
              for (let cc = 0; cc < brickColumnCount; cc++) {
                for (let rr = 0; rr < brickRowCount; rr++) {
                  if (bricks[cc][rr].status === 1) {
                    allBricksDestroyed = false;
                    break;
                  }
                }
                if (!allBricksDestroyed) break;
              }
              if (allBricksDestroyed) {
                setGameWon(true);
                cancelAnimationFrame(animationId);
              }
            }
          }
        }
      }
    };

    // ゲームループ
    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      collisionDetection();

      // ボールの移動
      ballX += ballDX;
      ballY += ballDY;

      // 壁との衝突
      if (
        ballX + ballDX > CANVAS_WIDTH - ballRadius ||
        ballX + ballDX < ballRadius
      ) {
        ballDX = -ballDX;
      }
      if (ballY + ballDY < ballRadius) {
        ballDY = -ballDY;
      } else if (ballY + ballDY > CANVAS_HEIGHT - ballRadius) {
        // パドルとの衝突判定
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
          ballDY = -ballDY;
        } else {
          setGameOver(true);
          cancelAnimationFrame(animationId);
          return;
        }
      }

      // パドルの移動
      if (rightPressed && paddleX < CANVAS_WIDTH - paddleWidth) {
        paddleX += paddleSpeed;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleRestart = () => {
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    window.location.reload();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-8">ブロック崩し</h1>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-blue-500 rounded-lg shadow-2xl"
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 rounded-lg">
            <h2 className="text-5xl font-bold text-red-500 mb-4">GAME OVER</h2>
            <p className="text-2xl text-white mb-6">スコア: {score}</p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xl font-semibold">
              もう一度プレイ
            </button>
          </div>
        )}

        {gameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 rounded-lg">
            <h2 className="text-5xl font-bold text-green-500 mb-4">クリア！</h2>
            <p className="text-2xl text-white mb-6">スコア: {score}</p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xl font-semibold">
              もう一度プレイ
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-white text-center">
        <p className="text-lg">操作方法:</p>
        <p className="mt-2">← → キーまたはマウスでパドルを移動</p>
      </div>
    </main>
  );
}
