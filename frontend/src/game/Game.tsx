import React, { useRef, useEffect, useState } from "react";
import { socket } from "../socket";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../refreshToken";
import "./Game.css";

interface HeaderProps {
    player1: string;
    player1Avatar: string;
    player2: string;
    player2Avatar: string;
    p1Score: number;
    p2Score: number;
    exitGame: () => void;
}
interface ScoreProps {
  p1Score: number;
  p2Score: number;
}

type Player = "player1" | "player2";

interface GameProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    bx: number;
    by: number;
}

function gameRender(
    { x1, y1, x2, y2, bx, by }: GameProps,
    canvas: HTMLCanvasElement
) {
    let context: CanvasRenderingContext2D | null = null;
    context = canvas.getContext("2d");
    context?.clearRect(0, 0, 1280, 720);
    if (context) {
        context.moveTo(x1, y1 - 100);
        context.lineTo(x1, y1 + 100);
        context.moveTo(x2, y2 - 100);
        context.lineTo(x2, y2 + 100);
        context.lineWidth = 10;
        context.stroke();

        context.beginPath();
        context.arc(bx, by, 15, 0, 2 * Math.PI);
        context.fillStyle = "#000000";
        context.fill();

        context.stroke();
    }
}

function Game() {
    const width = 1280;
    const height = 600;
    const { state } = useLocation();
    const { player1, player2, roomName, mode } = state || {
        player1: "player1",
        player2: "player2",
    };
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let context: CanvasRenderingContext2D | null = null;
    const [currentPlayer, setCurrentPlayer] = useState<Player>("player1");
    const [p1Score, setP1Score] = useState(0);
    const [p2Score, setP2Score] = useState(0);
    const [player1Avatar, setPlayer1Avatar] = useState("");
    const [player2Avatar, setPlayer2Avatar] = useState("");
    const navigate = useNavigate();

    const exitGame = () => {
      socket.emit("exit-game", {roomName:roomName});
      navigate('/main');
    }

    useEffect(() => {
      instance
      .get(`http://localhost:5001/member/search/${player1}`)
      .then((response) => {
          const player1Avatar = response.data.avatar;
          setPlayer1Avatar(player1Avatar);
      })
      .catch((error) => {
          console.log(error);
      });
    instance
      .get(`http://localhost:5001/member/search/${player2}`)
      .then((response) => {
          const player2Avatar = response.data.avatar;
          setPlayer2Avatar(player2Avatar);
      })
      .catch((error) => {
          console.log(error);
      });
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = width;
            canvas.height = height;
            canvas.focus();

            gameRender(
                { x1: 10, y1: 300, x2: 1270, y2: 300, bx: 640, by: 300 },
                canvas
            );
            socket.on("game-render", (payload: GameProps) => {
                gameRender(payload, canvas);
          });
        }
    

      socket.on("game-score", (payload:ScoreProps) => {
        setP1Score(payload.p1Score);
        setP2Score(payload.p2Score);
      });

      socket.on("game-end", (payload:ScoreProps) => {
        console.log("정상적으로 종료됨")
        navigate("/result", { state: { player1, player2, player1Avatar, player2Avatar, p1Score:payload.p1Score, p2Score:payload.p2Score} })
      });

      socket.on("game-sudden-end", (payload:ScoreProps) => {
        console.log("상대가 나갔음")
        navigate("/result", { state: { player1, player2, player1Avatar, player2Avatar, p1Score:payload.p1Score, p2Score:payload.p2Score} })
      });


        instance
            .get("http://localhost:5001/auth/me")
            .then((response) => {
                setCurrentPlayer(
                    player1 === response.data.nickName ? "player1" : "player2"
                );
                socket.emit("game-start", {
                    roomName,
                    mode,
                });
                //game-start할때 mode를 보내주기
            })
            .catch((error) => {
                console.log(error);
            });
            return(() => {
              socket.off("game-score");
              socket.off("game-render");
              socket.off("game-end");
              socket.off("sudden-end");
              if(p1Score < 5 && p2Score < 5)
                socket.emit("exit-game", {roomName:roomName});
            })
    }, []);

    const move = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
        if (event.key === "w") {
            socket.emit("player-w", { roomName });
            if (context) {
                context.closePath();
            }
        }
        if (event.key === "s") {
            socket.emit("player-s", { roomName });
            if (context) {
                context.closePath();
            }
        }
    };
    const getMode = () => {
        if (mode === 2)
        return "ghost-canvas";
        else 
        return "game-canvas"
    }
    return (
        <div className="game">
            <GameHeader player1={player1} p1Score={p1Score} player2={player2} p2Score={p2Score} player1Avatar={player1Avatar} player2Avatar={player2Avatar} exitGame={exitGame}/>
            <canvas
                className={getMode()}
                ref={canvasRef}
                onKeyDown={move}
                tabIndex={0}
            ></canvas>
        </div>
    );
}

function GameHeader({ player1, player2, p1Score, p2Score, player1Avatar, player2Avatar, exitGame }: HeaderProps) {


    return (
        <div className="game-header">
            <div className="game-header-p1">
                {player1}{p1Score}
                <img className="game-player1-avatar" src={player1Avatar}></img>
            </div>
            <div className="game-vs">VS</div>
            <div className="game-header-p2">
              {p2Score}{player2}
                <img className="game-player2-avatar" src={player2Avatar}></img>
            </div>
            <div>
              <button onClick={exitGame}>도망가기</button>
            </div>
        </div>
    );
}

export default Game;
