import React , { useState, useEffect } from "react";
import './Ranking.css';
import { start } from "repl";

interface RankingResultProps{
    gameResult: GameResult[];
}

interface GameResult{
    nickName: string;
    avatar: string;
    score: number;
}

interface dummy1{
    leftbox: GameResult;
}
interface dummy2{
    rightbox: GameResult;
}

declare global {
    interface Window {
      StartConfetti: () => void;
      StopConfetti: () => void;
    }
  }


// const RankingResult = ({ gameResult }: RankingResultProps) => {
const RankingResult = () => {  // 프롭스 아직 안받는연습모드
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://tistory4.daumcdn.net/tistory/3134841/skin/images/confetti_v2.js'; // 'path/to'에는 confetti_v2.js 파일의 경로를 지정합니다.
        script.async = true;
        document.body.appendChild(script);
    

        const startButton = document.getElementById('startButton');
        if(startButton){
            startButton.click();
        }
        const timeout = setTimeout(() => {
            const stopButton = document.getElementById('stopButton');
            if (stopButton) {
              stopButton.click();
            }
          }, 10000);


        return () => {
            clearTimeout(timeout);
            document.body.removeChild(script);
            // StopConfetti();
        };
	}, []);
    const leftbox = {nickName:"junhyuki", avatar:"data:image/jpeg;base64,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", score:5} // 더미 데이터
    const rightbox = {nickName:"heeskim", avatar:"data:image/jpeg;base64,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", score:3} // 더미 데이터
    // const leftbox = gameResult[0];
    // const rightbox = gameResult[1];
    let resultWinner = "";
    let winnerLeftBox = "";
    let winnerRightBox = "";


    if(leftbox.score > rightbox.score)
        resultWinner = rightbox.nickName;
    else
        resultWinner = leftbox.nickName;

    if(leftbox.score > rightbox.score)
        winnerLeftBox = "_winner_LeftBox";
    else if (rightbox.score  > leftbox.score)
        winnerRightBox = "_winner_RightBox";

    // const winnerLeftBox = leftbox.score > rightbox.score ? "_winner_font" : "";
    // const winnerRightBox = leftbox.score < rightbox.score ? "_winner_font" : "";

    const gotoMain = () => {
        window.location.href = "http://localhost:3000/main";
      };
    const gotoRanking = () => {
        window.location.href = "http://localhost:3000/rank";
      };

    return(
        <div className="Ranking-Result">
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
            <div className="buttonContainer">
                <button className="canvasBtn" id="stopButton">Stop Confetti</button>
                <button className="canvasBtn" id="startButton">Drop Confetti</button>
            </div>
            <div className="Ranking-Result_upper">
                <div className="Ranking-Result_leftbox">
                    <img src={leftbox.avatar} alt ="leftbox 아바타"></img>
                    <div className="Ranking-Result_leftName">{leftbox.nickName}</div>
                </div>
                <div className="Ranking-Result_rightbox">
                    <img src={rightbox.avatar} alt ="rightbox 아바타"></img>
                    <div className="Ranking-Result_rightName">{rightbox.nickName}</div>
                </div>
            </div>
            <div className="Ranking-Result_middle_resultbox"> 
                    <div className="Ranking-Result_scorebox">
                        <div className={`Ranking-Result_score_left${winnerLeftBox}`}>{leftbox.score}</div>
                        <div className="Ranking-Result_VS">VS</div> {/*vs 연하게 css 효과주기*/}
                        <div className={`Ranking-Result_score_right${winnerRightBox}`}>{rightbox.score}</div>
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
