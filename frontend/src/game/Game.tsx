import React, { useRef, useEffect, useState, createRef } from "react";
import { socket } from "../socket";
import { useLocation } from "react-router-dom";
import instance from "../refreshToken";
import "./Game.css"

interface CanvasProps {
  width: number;
  height: number;
}

type Player = 'player1' | 'player2';

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
    context?.clearRect(0,0, 1280, 720);
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
    const width = 1280;
    const height = 720;
    const { state } = useLocation();
    const {player1, player2} = state || {player1 :"player1", player2 :"player2"};
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let context: CanvasRenderingContext2D | null = null;
    const [currentPlayer, setCurrentPlayer] = useState<Player>('player1');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;

      socket.on("game-render", (payload : any) => {
        const {x1, y1, x2, y2, bx, by}= payload;
        gameRender(payload, canvas);
      })
    }

    instance.get("http://localhost:5001/auth/me")
			.then((response) => {
        setCurrentPlayer(player1 === response.data.nickName ? 'player1' : 'player2');
        socket.emit("game-start", {intraId:response.data.intraId, nickName:response.data.nickName});
			})
			.catch((error) => {
				console.log(error);
			});
  }, []);


  const move = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (event.key === "w" ) {
      if (currentPlayer === "player1")
      {
        console.log("w");
        socket.emit("player1-w",)
      }
      else
        socket.emit("player2-w",)
      if (context) {
        context.closePath();
      }
    }
    if (event.key === "s" ) {
      if (currentPlayer === "player1")
      {
          console.log("w");
            socket.emit("player1-s",)
      }
      else
        socket.emit("player2-s",)
      if (context) {
          context.closePath();
        }
      }
  };

  return (
    <div>
      <div> {player1}</div>
      <div> {player2}</div>
    <canvas className="game-canvas"
    ref={canvasRef}
    onKeyDown={move}
    tabIndex={0}
    ></canvas>
    </div>
  );
};

export default Game;
