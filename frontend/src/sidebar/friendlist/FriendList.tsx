import React from "react";
import './FriendList.css';
import FriendInfo from "./FriendInfo";

interface Friend {
	name: string;
	age: number;
	avatarUrl: string;
}
  
interface FriendListProps {
	friends: Friend[];
}

const FriendList: React.FC<FriendListProps> = ({ friends }) => {
  
	return (
	  <div className="list-scroll">
		{friends.map((friend, index) => (
        <FriendInfo key={index} name={friend.name} age={friend.age} avatarUrl={friend.avatarUrl}/>
     	 ))}
	  </div>
	);
};

export default FriendList;