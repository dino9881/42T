import React, { useState, useEffect } from "react";
import FriendInfoSimple from "../friendlist/FriendInfoSimple";
import IsNotFriend from "./IsNotFriend";
import instance from "../../refreshToken";
import FriendInfo from "../friendlist/FriendInfo";
import BanList from "../friendlist/BanList";
import "./AddFriend.css";

interface SearchFriendProps {
intraId: string;
friendStatus: number;
onClose: () => void;
}

const SearchFriend: React.FC<SearchFriendProps> = ({ intraId, friendStatus, onClose, }) => {
	const [userData, setUserData] = useState<any>(null);

	useEffect(() => {
		instance.get(`http://localhost:5001/member/${intraId}`).then((response) => {
		console.log(response);
		setUserData(response.data);
		});
	}, [intraId]);

	return (
		<div className="search-result">
			<img
				className="search-result-close-button"
				src="close_button.svg"
				alt="Close"
				width="20"
				height="20"
				onClick={onClose}
				style={{ cursor: "pointer" }}
			/>
			{userData && friendStatus === 0 && (
			<IsNotFriend
				nickName={userData.nickName}
				rank={userData.rank}
				avatar={userData.avatar}
				onClose={onClose}
				intraId={intraId}
				friendStatus={friendStatus}
			/>
			)}
			{userData && friendStatus === 1 && (
			<FriendInfo
				intraId={userData.intraId}
				nickName={userData.nickName}
				rank={userData.rank}
				avatar={userData.avatar}
				winCnt={userData.winCnt}
				loseCnt={userData.loseCnt}
				currstate={userData.state}
				state={friendStatus}
				info={false}
			/>
			
			)}
			{userData && friendStatus === 2 &&
			<BanList 
				nickName={userData.nickName}
				avatar={userData.avatar}
			/>}
		</div>
	);
};

export default SearchFriend;
