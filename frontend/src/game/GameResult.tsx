import React , { useState, useEffect } from "react";
import './Game.css';
import { useLocation } from "react-router-dom";
import Fireworks from "./GameConfetti";

interface GameResult{
    player1: string,
    player2: string,
    player1Avatar: string,
    player2Avatar: string,
    p1Score: number,
    p2Score: number
}

declare global {
    interface Window {
      StartConfetti: () => void;
      StopConfetti: () => void;
    }
  }

const RankingResult = ({ }) => {
    
    const location = useLocation();

    const gameResult: GameResult = {
        player1: location.state.player1,
        player2: location.state.player2,
        player1Avatar: location.state.player1Avatar,
        player2Avatar: location.state.player2Avatar,
        p1Score: location.state.p1Score,
        p2Score: location.state.p2Score
    }

    let resultWinner = "";
    let winnerLeftBox = "";
    let winnerRightBox = "";


    if(gameResult.p1Score > gameResult.p2Score)
        resultWinner = gameResult.player1;
    else
        resultWinner = gameResult.player2;

    if(gameResult.p1Score > gameResult.p2Score)
        winnerLeftBox = "_winner_LeftBox";
    else if(gameResult.p1Score < gameResult.p2Score)
        winnerRightBox = "_winner_RightBox";


    const gotoMain = () => {
        window.location.href = `${process.env.REACT_APP_FRONT_URL}/main`;
      };
    const gotoRanking = () => {
        window.location.href = `${process.env.REACT_APP_FRONT_URL}/rank`;
      };

    return(
        <div className="Ranking-Result">
            <div className="Ranking-Result_VS">VS</div>
            <canvas id="canvas"></canvas>
            <style>
                {`
                canvas {
                    z-index: 10;
                    pointer-events: none;
                    position: fixed;
                    top: 0;
                    transform: scale(1.1);
                }
                `}
            </style>
            <Fireworks></Fireworks>
            <div className="Ranking-Result_upper">
                <div className="Ranking-Result_leftbox">
                    <img src={gameResult.player1Avatar} alt ="leftbox 아바타"></img>
                    <div className="Ranking-Result_Name">{gameResult.player1}</div>
                </div>
                <div className="Ranking-Result_rightbox">
                    <img src={gameResult.player2Avatar} alt ="rightbox 아바타"></img>
                    <div className="Ranking-Result_Name">{gameResult.player2}</div>
                </div>
            </div>
            <div className="Ranking-Result_middle_resultbox"> 
                    <div className="Ranking-Result_scorebox">
                        <div className={`Ranking-Result_score_left${winnerLeftBox}`}>{gameResult.p1Score}</div>
                        <div className={`Ranking-Result_score_right${winnerRightBox}`}>{gameResult.p2Score}</div>
                    </div>
                    <div className="Ranking-Result_text" > {resultWinner} 님 승리 !</div>
                </div>
            <div className="Ranking-Result_under">
                <button className="Ranking-Result_under_gotoMain" onClick={gotoMain}>메인가기</button>
                <button className="Ranking-Result_under_gotoRanking" onClick={gotoRanking}>랭킹페이지 가기</button>
            </div>
        </div>
    );
};

export default RankingResult;