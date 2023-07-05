import React, { useState, useEffect } from 'react';
import AddFriend from './search/AddFriend';
import MyInfo from './myinfo/MyInfo';
import FriendList from './friendlist/FriendList';
import DmList from './dmlist/DmList';
import './Sidebar.css';

<<<<<<< HEAD
const Sidebar = () => {
	const [viewList, setViewList] = useState(true)

=======
interface Friend {
	intraId: string;
	nickName: string;
	rank: number;
	avatar: string;
}

const Sidebar = () => {
	const [viewList, setViewList] = useState(true)

	const friends: Friend[] = [
		{ intraId:"test1", nickName: "GOAT", rank: 28, avatar: "avatar/GOAT.jpeg" },
		// { intraId:"test2", nickName: "haaland", rank: 25, avatar: "avatar/haaland.jpeg" },
		// { intraId:"test3", nickName: "Kevin De Bruyne", rank: 25, avatar: "avatar/kdb.jpeg" },
		// { intraId:"test4", nickName: "son", rank: 28, avatar: "avatar/son.jpeg" },
		// { intraId:"test5", nickName: "lee", rank: 30, avatar: "avatar/lee.jpeg" },
		// { intraId:"test6", nickName: "foden", rank: 30, avatar: "avatar/phil-foden.jpeg" },
		// { intraId:"test7", nickName: "kim", rank: 30, avatar: "avatar/kim.jpeg" }
	];

>>>>>>> socket-chat
	return (
		<div className='side'>
			<AddFriend />
			<MyInfo />
			<div className='side-list'>
				{ viewList ? <FriendList /> : <DmList/> }
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
  