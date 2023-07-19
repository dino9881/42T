import React, { useState, useEffect } from "react";
import FriendInfo from "./FriendInfo";
import BanList from "./BanList";
import instance from "../../refreshToken";
import './FriendList.css';

interface Friend {
	intraId: string;
	nickName: string;
	rank: number;
	avatar: string;
	winCnt: number;
	loseCnt: number;
	status: number;
}

interface Ban {
	nickName: string;
	avatar: string;
}

const FriendList = () => {
	const [friends, setFriends] = useState<Friend[]>([]);
	const [bans, setBans] = useState<Ban[]>([]);

	function getFriend() {
		instance.get("http://localhost:5001/member/friend/list")
			.then((response) => {
				// console.log(response.data);
				setFriends(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function getBan() {
		instance.get("http://localhost:5001/member/ban/list")
			.then((response) => {
				// console.log(response.data);
				setBans(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		getFriend()
		getBan()
	}, []);

	return (
	<div className="list-scroll">
		{friends && friends.map((friend, index) => (
        <FriendInfo key={index} intraId={friend.intraId} nickName={friend.nickName} rank={friend.rank} avatar={friend.avatar} winCnt={friend.winCnt} loseCnt={friend.loseCnt} state={1} currstate={friend.status} info={true}/>
    ))}
		<div className="friend-list-text"> - 차단목록</div>
		{bans && bans.map((ban, index) => (
        <BanList key={index} nickName={ban.nickName} avatar={ban.avatar} />
    ))}
	</div>
	);
};

export default FriendList;