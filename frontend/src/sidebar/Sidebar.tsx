import React, { useState, useEffect } from 'react';
import AddFriend from './search/AddFriend';
import MyInfo from './myinfo/MyInfo';
import FriendList from './friendlist/FriendList';
import DmList from './dmlist/DmList';
import './Sidebar.css';

interface Friend {
	name: string;
	rank: number;
	avatar: string;
}

const Sidebar = () => {
	const [viewList, setViewList] = useState(true)

	const friends: Friend[] = [
		{ name: "GOAT", rank: 28, avatar: "avatar/GOAT.jpeg" },
		{ name: "haaland", rank: 25, avatar: "avatar/haaland.jpeg" },
		{ name: "Kevin De Bruyne", rank: 25, avatar: "avatar/kdb.jpeg" },
		{ name: "son", rank: 28, avatar: "avatar/son.jpeg" },
		{ name: "lee", rank: 30, avatar: "avatar/lee.jpeg" },
		{ name: "foden", rank: 30, avatar: "avatar/phil-foden.jpeg" },
		{ name: "kim", rank: 30, avatar: "avatar/kim.jpeg" }
	];

	return (
		<div className='side'>
			<AddFriend />
			<MyInfo />
			<div className='side-list'>
				{ viewList ? <FriendList friends={friends}/> : <DmList/> }
				<div className='side-list-buttons'>
					
					<button
						className={`friend-list-button ${viewList ? 'list-button' : ''}`}
						onClick={() => setViewList(true)}
					>
						친구목록
					</button>
					<button
						className={`dm-list ${!viewList ? 'list-button' : ''}`}
						onClick={() => {
									setViewList(false);
								}}
					>
						채팅유저목록
					</button>
				</div>
			</div>
		</div>
	);
  };
  

  export default Sidebar;
  