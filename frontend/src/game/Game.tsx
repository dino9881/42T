import React, { useRef, useEffect, useState } from "react";
import { socket } from "../socket";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../refreshToken";
import "./Game.css";
import { history } from "../history";
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


function Game() {
    const width = 1280;
    const height = 600;
    const { state } = useLocation();
    const { player1, player2, roomName, mode } = state || {
        player1: "player1",
        player2: "player2",
    };
    var isNormal = 0;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let context: CanvasRenderingContext2D | null = null;
    const [currentPlayer, setCurrentPlayer] = useState<Player>("player1");
    const [p1Score, setP1Score] = useState(0);
    const [p2Score, setP2Score] = useState(0);
    const [player1Avatar, setPlayer1Avatar] = useState("");
    const [player2Avatar, setPlayer2Avatar] = useState("");
    const navigate = useNavigate();

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        exitGame();
      };

      function gameRender(
        { x1, y1, x2, y2, bx, by }: GameProps
    ) {
        if (context) {
            context.fillStyle = "#ffffff"
            context.fillRect(0, 0, 1280, 720);
            context.moveTo(x1, y1 - 100);
            context.lineTo(x1, y1 + 100);
            context.moveTo(x2, y2 - 100);
            context.lineTo(x2, y2 + 100);
            context.lineWidth = 10;
            context.stroke();
            context.beginPath();
            context.arc(bx, by, 5, 0, 2 * Math.PI, false);
            context.fillStyle = "#000000";
        }
    }
    
    const exitGame = () => {
      socket.emit("exit-game", {roomName:roomName});
      navigate('/main');
    }

    useEffect(() => {
      instance
      .get(`${process.env.REACT_APP_BACK_URL}/member/search/${player1}`)
      .then((response) => {
          const player1Avatar = response.data.avatar;
          setPlayer1Avatar(player1Avatar);
          instance
          .get(`${process.env.REACT_APP_BACK_URL}/member/search/${player2}`)
          .then((response) => {
              const player2Avatar = response.data.avatar;
              setPlayer2Avatar(player2Avatar);
              socket.on("game-end", (payload:ScoreProps) => {
                navigate("/result", { state: { player1, player2, player1Avatar, player2Avatar, p1Score:payload.p1Score, p2Score:payload.p2Score} })
                });
            
                socket.on("game-sudden-end", (payload:ScoreProps) => {
                navigate("/result", { state: { player1, player2, player1Avatar, player2Avatar, p1Score:payload.p1Score, p2Score:payload.p2Score} })
                });
          })
          .catch((error) => {
              console.log(error);
          });
      })
      .catch((error) => {
          console.log(error);
      });
   

    const canvas = canvasRef.current;
    if (canvas) {
        canvas.width = width;
        canvas.height = height;
        canvas.focus();
        context = canvas.getContext("2d");

        gameRender(
            { x1: 10, y1: 300, x2: 1270, y2: 300, bx: 640, by: 300 }
        );
        socket.on("game-render", (payload: GameProps) => {
            gameRender(payload);
        });
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    const unlistenHistoryEvent = history.listen(({ action }) => {
        if (action === "POP") {
            exitGame();
            }
    })
    
    socket.on("game-score", (payload:ScoreProps) => {
    setP1Score(payload.p1Score);
    setP2Score(payload.p2Score);
    });

    socket.on("game-exception" ,() => {
    alert("error!")
    navigate("/main");
    } )



        instance
            .get(`${process.env.REACT_APP_BACK_URL}/auth/me`)
            .then((response) => {
                setCurrentPlayer(
                    player1 === response.data.nickName ? "player1" : "player2"
                );
                socket.emit("game-start", {
                    roomName,
                    mode,
                });
                // console.log(roomName);
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
            socket.off("game-exception");
            unlistenHistoryEvent;
            window.removeEventListener('beforeunload', handleBeforeUnload);
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
                <img className="game-player1-avatar" src={player1Avatar}></img>
                <div className="game-header-p1name">
                    {player1}
                </div>
                <div className="game-header-p1score">
                    {p1Score}
                </div>
            </div>
            <div className="game-vs">VS</div>
            <div className="game-header-p2">
            <div className="game-header-p2score">
                    {p2Score}
            </div>
            <div className="game-header-p2name">
                    {player2}
            </div>
                <img className="game-player2-avatar" src={player2Avatar}></img>
            </div>
            <div>
              <button onClick={exitGame}>도망가기</button>
            </div>
        </div>
    );
}

export default Game;