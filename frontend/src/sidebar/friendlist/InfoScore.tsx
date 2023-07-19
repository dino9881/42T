import React, { useState, useEffect } from "react";
import instance from "../../refreshToken";
import './FriendInfo.css';

interface History {
  winnerId: string;
  loserId: string;
  winnerScore: number;
  loserScore: number;
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
    instance.get(`http://localhost:5001/game/history/${intraId}`)
      .then((res) => {
        setHistory(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = () => {
    instance.delete(`http://localhost:5001/member/friend/delete/${nickName}`).then(()=>{
      // console.log(res);
		window.location.reload();
    })
  };

  const handleBan = () => {
    instance.post(`http://localhost:5001/member/ban/add/${nickName}`).then(()=>{
		window.location.reload();
    })
  };

  const handleAdd = () => {
    instance.post(`http://localhost:5001/member/friend/add/${nickName}`)
		.then(() => {
			window.location.reload();
		})
		.catch((error) => {
			console.log(error);
		});
  }

  return (
    <div className={state === 3 ? "my-score-box" : "friend-info-full"}>
      <div className="rank">랭킹 {rank}</div>
      <div className={state === 3 ? "my-score-table" : "score-table"}>
        {history.map((history, index) => (
            <GameHistory key={index} winnerId={history.winnerId} loserId={history.loserId} winnerScore={history.winnerScore} loserScore={history.loserScore} />
        ))}
      </div>
      {state !== 3 && (
        <div className="friend-bottom-box">
          {state === 1 && (
            <button className="delete-friends" onClick={handleDelete}>친구삭제</button>
          )}
          {state === 0 && (
            <button className="delete-friends" onClick={handleAdd}>친추</button>
          )}
          <button className="block-friend" onClick={handleBan}>차단</button>
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
