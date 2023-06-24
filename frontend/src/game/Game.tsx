import React, { useRef, useEffect, useState } from "react";
import { socket } from "../socket";

interface CanvasProps {
  width: number;
  height: number;
}

interface GameProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    bx: number;
    by: number;
}

function gameRender({x1, y1, x2, y2, bx, by} : GameProps,canvas:HTMLCanvasElement)
{
    let context: CanvasRenderingContext2D | null = null;
    context = canvas.getContext("2d");
      if (context)
      {
        context.moveTo(x1, y1);
        context.lineTo(x1, y1 + 200);
        context.moveTo(x2, y2);
        context.lineTo(x2, y2 + 200);
        context.stroke();

        context.beginPath();
        context.arc(bx, by, 20, 0, 2*Math.PI);
        context.fillStyle="#0095DD";
        context.fill();
        context.stroke();
      }
}

function Game(){
    const width = 1280;
    const height = 720;

    const [offsetX1, setOffSetX1] = useState(100);
    const [offsetX2, setOffSetX2] = useState(1180);

    const [ballX, setBallX] = useState(640);
    const [ballY, setBallY] = useState(360);

    const [offsetY1, setOffSetY1] = useState(260);
    const [offsetY2, setOffSetY2] = useState(260);


    const canvasRef = useRef<HTMLCanvasElement>(null);
    let context: CanvasRenderingContext2D | null = null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;

      socket.emit("game-start",);
      socket.on("game-render", (payload : any) => {
        const {x1, y1, x2, y2, bx, by}= payload;
        gameRender(payload, canvas);
      })

    //   const gameProps = {
    //     x1: offsetX1,
    //     y1: offsetY1,
    //     x2: offsetX2,
    //     y2: offsetY2,
    //     bx: ballX,
    //     by: ballY
    //   };
    //   gameRender(gameProps, canvas);
    }
  }, []);


  const move = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (event.key === "w" ) {
        setOffSetY1(offsetY1 - 15);
        setOffSetY2(offsetY2 - 15);
        console.log(`[${offsetY1}, ${offsetY2}]`)
        
      if (context) {
        context.closePath();
      }
    }
    if (event.key === "s" ) {
        setOffSetY1(offsetY1 + 15);
        setOffSetY2(offsetY2 + 15);
        console.log(`[${offsetY1}, ${offsetY2}]`)
        if (context) {
          context.closePath();
        }
      }
  };

  return (
    <canvas
      ref={canvasRef}
      onKeyDown={move}
      tabIndex={0}
    ></canvas>
  );
};

export default Game;