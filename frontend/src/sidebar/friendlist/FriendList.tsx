import React, { useState, useEffect } from "react";
import { response } from "express";
import axios from 'axios';
import FriendInfo from "./FriendInfo";
import BanList from "./BanList";
import './FriendList.css';

interface Friend {
	intraId: string;
	nickName: string;
	rank: number;
	avatar: string;
	winCnt: number;
	loseCnt: number;
}
  
interface FriendListProps {
	friends: Friend[];
}

const FriendList = () => {
	const [friends, setFriends] = useState<Friend[]>([]);

	function getFriend() {
		axios.get("http://localhost:5001/member/friend/list")
			.then((response) => {
				console.log(response.data);
				setFriends(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		getFriend()
	}, []);

	return (
	  <div className="list-scroll">
		{friends.map((friend, index) => (
        	<FriendInfo key={index} intraId={friend.intraId} nickName={friend.nickName} rank={friend.rank} avatar={friend.avatar} winCnt={friend.winCnt} loseCnt={friend.loseCnt}/>
     	 ))}
		<div className="friend-list-text"> - 차단목록</div>
			<BanList />
	  </div>
	);
};

export default FriendList;