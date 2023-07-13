import React from "react";
import axios from "axios";
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
}

const IsNotFriend: React.FC<FriendInfoProps & SearchFriendProps> = ({ nickName, rank, avatar, onClose, intraId, friendStatus }) => {
  
	const handleAdd = () => {
		instance.post(`http://localhost:5001/member/friend/add/${nickName}`)
		  .then((response) => {
			onClose();
			window.location.reload();
		  })
		  .catch((error) => {
			console.log(error);
		  });
	  };

	const handleBan = () => {
		instance.post(`http://localhost:5001/member/ban/${nickName}`).then((res)=>{
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
			<div className="small-square">전적</div>
			</div>
		</div>
		</div>
	);
};

export default IsNotFriend;
