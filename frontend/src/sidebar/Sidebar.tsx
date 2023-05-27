import React from 'react';
import { useState } from 'react';
import './Sidebar.css';
import AddFriend from './search/AddFriend';
import MyInfo from './myinfo/MyInfo';
import FriendList from './friendlist/FriendList';
import DmList from './dmlist/DmList';

interface Friend {
	name: string;
	age: number;
	avatarUrl: string;
}

interface Myinfo {
	name: string;
	age: number;
	avatarUrl: string;
}

const Sidebar = () => {
	const [viewList, setViewList] = useState(true)

	const myinfo: Myinfo = {
		name: "yyoo",
		age: 26,
		avatarUrl: "avatar/yyoo.jpeg"
	};

	const friends: Friend[] = [
		{ name: "GOAT", age: 28, avatarUrl: "avatar/GOAT.jpeg" },
		{ name: "haaland", age: 25, avatarUrl: "avatar/haaland.jpeg" },
		{ name: "Kevin De Bruyne", age: 25, avatarUrl: "avatar/kdb.jpeg" },
		{ name: "son", age: 28, avatarUrl: "avatar/son.jpeg" },
		{ name: "lee", age: 30, avatarUrl: "avatar/lee.jpeg" },
		{ name: "foden", age: 30, avatarUrl: "avatar/phil-foden.jpeg" },
		{ name: "kim", age: 30, avatarUrl: "avatar/kim.jpeg" }
	];

	return (
		<div className='side'>
			<AddFriend />
			<MyInfo myinfo={myinfo}/>
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
  