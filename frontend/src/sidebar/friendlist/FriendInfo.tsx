import React, { useState } from "react";
import FriendInfoSimple from "./FriendInfoSimple";
import InfoScore from "./InfoScore";
import './FriendInfo.css';

interface FriendInfoProps {
	intraId: string;
	nickName: string;
	rank: number;
	avatar: string;
	loseCnt: number;
	winCnt: number;
	state: number;	// 친구 or 벤 or 둘 다 아님
	currstate: number;	// 현재 상태
}

const FriendInfo: React.FC<FriendInfoProps> = ({ intraId, nickName, rank, avatar, winCnt, loseCnt, state, currstate }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");

	const handleToggle = () => {
	  setIsExpanded(!isExpanded);
	  setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
	};

	return (
		<div>
			<div className={isExpanded ? 'friend-info-line-big' : 'friend-info-line-small'}>
				<FriendInfoSimple nickName={nickName} rank={rank} avatar={avatar} winCnt={winCnt} loseCnt={loseCnt} currstate={currstate}/>
				<img src={toggleImgSrc} alt="toggle" className="friend-toggle-down" onClick={handleToggle} style={{ cursor: 'pointer' }}></img>
				{isExpanded && <InfoScore intraId={intraId} nickName={nickName} rank={rank} state={state} />}
			</div>
		</div>
	);
}

export default FriendInfo;