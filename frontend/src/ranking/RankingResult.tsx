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
    const leftbox = {nickName:"junhyuki", avatar:"", score:5} // 더미 데이터
    const rightbox = {nickName:"heeskim", avatar:"", score:3} // 더미 데이터
    // const leftbox = gameResult[0];
    // const rightbox = gameResult[1];
    let resultWinner = "";
    

    if(leftbox.score > rightbox.score)
        resultWinner = rightbox.nickName;
    else
        resultWinner = leftbox.nickName;

    const winnerLeftBox = leftbox.score > rightbox.score ? "_winner_font" : "";
    const winnerRightBox = leftbox.score < rightbox.score ? "_winner_font" : "";

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
                    {/* <div className='image-wrapper'>
                        <img className='image-thumbnail' src='../../result/goodjob.png' alt='이미지' />
                    </div> */}
                    <div>{leftbox.nickName}</div>
                </div>
                <div className="Ranking-Result_resultbox"> 
                    <div className="Ranking-Result_text" > {resultWinner} 님 승리! </div>
                    {/* if문걸어서 이긴사람 스코어 폰트사이즈 크고 노란색?으로 눈에띄게 하기 */}
                        <div className="Ranking-Result_scorebox">
                            <div className={`Ranking-Result_score${winnerLeftBox}`}>{leftbox.score}</div>
                            <div className="Ranking-Result_VS">VS</div> {/*vs 연하게 css 효과주기*/}
                            <div className={`Ranking-Result_score${winnerRightBox}`}>{rightbox.score}</div>
                        </div>
                </div>
                <div className="Ranking-Result_rightbox">
                    <img src={rightbox.avatar} alt ="rightbox 아바타"></img>
                    <div>{rightbox.nickName}</div>
                </div>
            </div>
            <div className="Ranking-Result_under">
                <button onClick={gotoMain}>메인가기</button>
                <button onClick={gotoRanking}>랭킹페이지 가기</button>
            </div>
        </div>
    );
};

export default RankingResult;
