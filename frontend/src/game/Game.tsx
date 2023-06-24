import React, { useRef, useEffect, useState, createRef } from "react";
import { socket } from "../socket";
import Contents from "../Contents";
import Sidebar from "../sidebar/Sidebar";
import Menu from "../menu/Menu";

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
        context.moveTo(x1, y1 - 100);
        context.lineTo(x1, y1 + 100);
        context.moveTo(x2, y2 - 100);
        context.lineTo(x2, y2 + 100);
        context.lineWidth = 10;
        context.stroke();

        context.beginPath();
        context.arc(bx, by, 20, 0, 2*Math.PI);
        context.fillStyle="#000000";
        context.fill();

        context.stroke();
      }
}

function Game(){
  return <div>
    <Contents headerComponent={<Menu showBackButton={true}/>} mainComponent={<GameComponent/>}/>
         <Sidebar />
  </div>
}

function GameComponent(){
    const width = 1280;
    const height = 720;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let context: CanvasRenderingContext2D | null = null;

  useEffect(() => {
    socket.connect();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;

      console.log(socket.emit("game-start",));
      socket.on("game-render", (payload : any) => {
        const {x1, y1, x2, y2, bx, by}= payload;
        gameRender(payload, canvas);
      })
    }
  }, []);


  const move = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (event.key === "w" ) {
        console.log(`w`)
      if (context) {
        context.closePath();
      }
    }
    if (event.key === "s" ) {
        console.log(`s`)
        if (context) {
          context.closePath();
        }
      }
  };

  return (
    <canvas className="game-canvas"
      ref={canvasRef}
      onKeyDown={move}
      tabIndex={0}
    ></canvas>
  );
};

export default Game;
