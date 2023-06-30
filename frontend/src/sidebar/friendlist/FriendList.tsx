import React from "react";
import './FriendList.css';
import FriendInfo from "./FriendInfo";

interface Friend {
	intraId: string;
	nickName: string;
	rank: number;
	avatar: string;
}
  
interface FriendListProps {
	friends: Friend[];
}

const FriendList: React.FC<FriendListProps> = ({ friends }) => {
  
	return (
	  <div className="list-scroll">
		{friends.map((friend, index) => (
        <FriendInfo key={index} intraId={friend.intraId} nickName={friend.nickName} rank={friend.rank} avatar={friend.avatar}/>
     	 ))}
	  </div>
	);
};

export default FriendList;