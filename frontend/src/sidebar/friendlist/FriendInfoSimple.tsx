import React from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../refreshToken";
import './FriendInfo.css';
import '../myinfo/MyInfo.css';

interface FriendInfoProps {
	intraId: string;
	nickName: string;
	rank: number;
	avatar: string;
	loseCnt: number;
	winCnt: number;
	currstate: number;
	state: number;
	setIsCustomOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FriendInfoSimple: React.FC<FriendInfoProps> = ({ intraId, nickName, rank, avatar, winCnt, loseCnt, currstate, state, setIsCustomOpen } : FriendInfoProps) => {
    const navigate = useNavigate();
	
	const handleButtonClick = () => {
		instance
		.post(`${process.env.REACT_APP_BACK_URL}/channel/enter/dm/chan`,{
			"intraId": intraId,
			"nickName": nickName,
			"avatar": avatar,
		})
		.then((response) => {
			// console.log(`dm respose = ${response.data}`)
			navigate("/dm", { state: { chIdx:response.data.chIdx } });
		})
		.catch(() => {
			// console.error("API 요청 실패:", error);
			//   403 밴 유저
			//   404 없는 채널 번호
			//   500 서버 에러
			
		})
	}
	
	function handleVsClick(){
		setIsCustomOpen(true);
	}


	return (
		<div className='friend-info-simple'>
			{state === 1 && (
				<div  className={`state-circle ${currstate === 0 ? "state-circle-state0" : currstate === 1 ? "state-circle-state1" : "state-circle-state2"}`}></div>
			)}
			<div
				className='friend-info-avatar'
				style={{ backgroundImage: `url(${avatar})` }}
			></div>
			<div className='friend-info-info'>
				<div className='friend-info-text'>
					<div className='small-square'>{nickName}</div>
					<div className='small-square'>{rank}</div>
				</div>
				<div className='friend-info-button'>
					<div className="friend-button">
						<button className="dm-button" onClick={handleButtonClick}>dm</button>
						{currstate !== 0 ? (<button className="vs-button" onClick={handleVsClick}>1vs1</button>)
						:( <button className="vs-button" disabled>1vs1</button> )}
					</div>
					<div className='small-square'>
						<span style={{color: "blue"}}>{winCnt}</span>
						/
						<span style={{color: "red"}}>{loseCnt}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FriendInfoSimple;