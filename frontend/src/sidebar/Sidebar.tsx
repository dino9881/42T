import React, { useState, useEffect } from 'react';
import AddFriend from './search/AddFriend';
import MyInfo from './myinfo/MyInfo';
import FriendList from './friendlist/FriendList';
import ChannelUser from './channeluser/ChannelUser';
import './Sidebar.css';

const Sidebar = () => {
	const [viewList, setViewList] = useState(true)

	return (
		<div className='side'>
			<AddFriend />
			<MyInfo />
			<div className='side-list'>
				{ viewList ? <FriendList /> : <ChannelUser/> }
				<div className='side-list-buttons'>
					
					<button
						className={`friend-list-button ${!viewList ? 'list-button' : ''}`}
						onClick={() => setViewList(true)}
					>
						친구목록
					</button>
					<button
						className={`dm-list ${viewList ? 'list-button' : ''}`}
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
  