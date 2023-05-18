import React from 'react';
import './Sidebar.css';
import AddFriend from './search/AddFriend';
import MyInfo from './myinfo/MyInfo';
import FriendList from './friendlist/FriendList';

const Sidebar = () => {
	return (
		<div className='side'>
			<AddFriend />
			<MyInfo />
			<div className='side-list'>
				<div className='side-list-buttons'>
					<button className="friend-list-button">친구목록</button>
					<button className='dm-list'>채팅유저목록</button>
				</div>
				<div className='friend-list'>
					<FriendList />
				</div>

			</div>
		</div>
	);
  };
  
  export default Sidebar;
  