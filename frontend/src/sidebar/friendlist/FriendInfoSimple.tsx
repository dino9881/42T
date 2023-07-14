import React from "react";
import { socket } from "../../socket";
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
}

const FriendInfoSimple: React.FC<FriendInfoProps> = ({ intraId, nickName, rank, avatar, winCnt, loseCnt, currstate }) => {
    const navigate = useNavigate();

	const handleButtonClick = () => {
		instance
            .post('http://localhost:5001/channel/enter/dm/chan',{
				"intraId": intraId,
				"nickName": nickName,
				"avatar": avatar
			})
			.then((response) => {
			console.log(response)
				//   .post(`http://localhost:5001/dm/enter/${chIdx}`)
                navigate("/dm", { state: { chIdx:response.data.chIdx } });
            })
            .catch((error) => {
                // 요청이 실패하면 에러 처리
                console.error("API 요청 실패:", error);
                //   403 밴 유저
                //   404 없는 채널 번호
                //   500 서버 에러

			})
	}

	function handleVsClick(){
		instance.get('http://localhost:5001/auth/me').then((response) => {
			console.log({intraId : response.data.intraId, nickName : response.data.nickName  , player2: nickName });
            socket.emit("game-apply", {intraId : response.data.intraId, nickName : response.data.nickName  , player2: nickName });
		});
	}
	return (
		<div className='friend-info-simple'>
			<div className='state-circle'></div>
			<div  className={`state-circle ${currstate === 0 ? "state-circle-state0" : currstate === 1 ? "state-circle-state1" : "state-circle-state2"}`}></div>
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
						{/* {currstate !== 0 ? (<button className="dm-button">dm</button>) */}
						{currstate !== 0 ? (<button className="dm-button" onClick={handleButtonClick}>dm</button>)
						:( <button className="dm-button" disabled>dm</button> )}
						{/* <Link to="/chat"> <button className='dm-button'>dm</button> </Link> */}
						<button onClick={handleVsClick} className='vs-button'>1vs1</button>
						
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