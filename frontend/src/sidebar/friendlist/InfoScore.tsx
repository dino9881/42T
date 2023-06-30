import React, { useState, useEffect } from "react";
import axios from 'axios';
import './FriendInfo.css';

interface History {
  winnerId: string;
  loserId: string;
  winnerScore: number;
  loserScore: number;
}

interface HistoryProps {
  history: History[];
}

interface InfoScoreProps {
  intraId: string;
  nickName: string;
  rank: number;
  state: number;
}

const InfoScore: React.FC<InfoScoreProps> = ({ intraId, nickName, rank, state }) => {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:5001/game/history/${intraId}`)
      .then((res) => {
        console.log(res);
        setHistory(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = () => {
    console.log('친구 삭제됨');
  };

  const handleBlock = () => {
    console.log('차단');
  };

  return (
    <div className={state === 1 ? "my-score-box" : "friend-info-full"}>
      <div className="rank">Rank {rank}</div>
      <div className={state === 1 ? "my-score-table" : "score-table"}>
        {history.map((history, index) => (
          <GameHistory
            key={index}
            winnerId={history.winnerId}
            loserId={history.loserId}
            winnerScore={history.winnerScore}
            loserScore={history.loserScore}
          />
        ))}
      </div>
      {state === 2 && (
        <div className="friend-bottom-box">
          <button className="delete-friends" onClick={handleDelete}>친구삭제</button>
          <button className="block-friend" onClick={handleBlock}>차단</button>
        </div>
      )}
    </div>
  );
};

const GameHistory: React.FC<History> = ({ winnerId, loserId, winnerScore, loserScore }) => {
  return (
    <div id="score">
      <span style={{color: "blue"}}>{winnerId} {winnerScore}</span>
      :
      <span style={{color: "red"}}> {loserScore} {loserId}</span>
    </div>
  );
};

export default InfoScore;
