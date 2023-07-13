import React, { useRef, useEffect, useState, createRef } from "react";
import { socket } from "../socket";
import { useLocation } from "react-router-dom";
import instance from "../refreshToken";
import "./Game.css"

interface CanvasProps {
  width: number;
  height: number;
}

interface HeaderProps {
  player1 : string;
  player2 : string;
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
    const height = 600;
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

      gameRender({x1: 10,y1: 300,x2: 1270,y2: 300,bx: 640,by: 300}, canvas);
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
    <div className="game">
      <GameHeader player1={player1} player2={player2}/>
    <canvas className="game-canvas"
    ref={canvasRef}
    onKeyDown={move}
    tabIndex={0}
    ></canvas>
    </div>
  );
};

function GameHeader({player1, player2} : HeaderProps) {

  const [player1Avatar, setPlayer1Avatar] = useState("");
  const [player2Avatar, setPlayer2Avatar] = useState("");


  instance.get(`http://localhost:5001/member/search/${player1}`)
			.then((response) => {
        const player1Avatar = response.data.avatar;
        setPlayer1Avatar(player1Avatar);
			})
			.catch((error) => {
				console.log(error);
			});
      instance.get(`http://localhost:5001/member/search/${player2}`)
			.then((response) => {
        const player2Avatar = response.data.avatar;
        setPlayer2Avatar(player2Avatar);
			})
			.catch((error) => {
				console.log(error);
			});

  return (
  <div className="game-header">
    <div className="game-header-p1"> 
      {player1}
      <img className="game-player1-avatar" src={player1Avatar}></img>
    </div>
    <div className="game-vs">VS</div>
    <div className="game-header-p2">
      {player2}
      <img className="game-player2-avatar" src={player2Avatar}></img>
    </div>
</div>
)


}

export default Game;
