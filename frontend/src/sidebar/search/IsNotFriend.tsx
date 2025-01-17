import React, { useState, useEffect } from "react";
import instance from "../../refreshToken";

interface SearchFriendProps {
  intraId: string;
  friendStatus: number;
  onClose: () => void;
}

interface FriendInfoProps {
  nickName: string;
  rank: number;
  avatar: string;
  winCnt: number;
  loseCnt: number;
}

interface MyData  {
	avatar: string;
	intraId: string;
	nickName: string;
	rank: number;
	winCnt: number;
	loseCnt: number;
  };

const IsNotFriend: React.FC<FriendInfoProps & SearchFriendProps> = ({ nickName, rank, avatar, winCnt, loseCnt, onClose }) => {
	const [myData, setMyData] = useState<MyData | null>(null);

	useEffect(() => {
		instance.get(`${process.env.REACT_APP_BACK_URL}/auth/me`).then((response) => {
			if (myData !== response.data){
				setMyData(response.data); 
			}
		})
	}, []);

	const handleAdd = () => {
		if (myData && myData.nickName === nickName){
			alert("Error!!!")
			return;
		}
		instance.post(`${process.env.REACT_APP_BACK_URL}/member/friend/add/${nickName}`)
		.then(() => {
			onClose();
			window.location.reload();
		})
		.catch(() => {
			// console.log(error);
		});
	};

	const handleBan = () => {
		if (myData && myData.nickName === nickName){
			alert("Error!!!")
			return;
		}
		instance.post(`${process.env.REACT_APP_BACK_URL}/member/ban/add/${nickName}`).then(()=>{
			window.location.reload();
		})
	};

	return (
		<div className="friend-info-simple">
		<div
			className="friend-info-avatar"
			style={{ backgroundImage: `url(${avatar})` }}
		></div>
		<div className="friend-info-info">
			<div className="friend-info-text">
			<div className="small-square">{nickName}</div>
			<div className="small-square">{rank}</div>
			</div>
			<div className="friend-info-button">
			<div className="friend-button">
				<button className="dm-button" onClick={handleAdd}>
				친구추가
				</button>
				<button className="vs-button" onClick={handleBan}>
				차단
				</button>
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
};

export default IsNotFriend;
