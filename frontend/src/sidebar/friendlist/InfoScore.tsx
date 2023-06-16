import React from "react";
import './FriendInfo.css';

interface InfoScoreProps {
	name: string;
	age: number;
	avatarUrl: string;
	state: number; // 상태 값 추가
}

const InfoScore: React.FC<InfoScoreProps> = ({ name, age, avatarUrl, state }) => {
	const handleClick = () => {
		console.log('친구 삭제됨');
	}

	return (
		<div className={state === 1 ? "my-score-box" : "friend-info-full"}>
			<div className="rank">Rank {age}</div>
			<div className={state === 1 ? "my-score-table" : "score-table"}>
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
			</div>
			{state === 2 && (
				<button className="delete-friends" onClick={handleClick}>친구삭제</button>
			)}
		</div>
	);
}

export default InfoScore;
