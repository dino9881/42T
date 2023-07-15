import React, { useState } from 'react';
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
  

// import React, { useState } from 'react';
// import AddFriend from './search/AddFriend';
// import MyInfo from './myinfo/MyInfo';
// import FriendList from './friendlist/FriendList';
// import ChannelUser from './channeluser/ChannelUser';
// import './Sidebar.css';

// const Sidebar = () => {
// 	const [viewList, setViewList] = useState(true);
// 	const [channelIdx, setChannelIdx] = useState<number>(() => {
// 		const storedchannelIdx = localStorage.getItem("chIdx");
// 		return storedchannelIdx ? parseInt(storedchannelIdx) : 0;
// 	});

// 	const handleViewFriendList = () => {
// 		setViewList(true);
// 	};

// 	const handleViewChannelUserList = () => {
// 		if (channelIdx !== 0) {
// 			window.location.reload();
// 		} else {
// 			setViewList(false);
// 		}
// 	};

// 	return (
// 		<div className='side'>
// 			<AddFriend />
// 			<MyInfo />
// 			<div className='side-list'>
// 				{viewList ? <FriendList /> : <ChannelUser />}
// 				<div className='side-list-buttons'>
// 					<button
// 						className={`friend-list-button ${!viewList ? 'list-button' : ''}`}
// 						onClick={handleViewFriendList}
// 					>
// 						친구목록
// 					</button>
// 					{channelIdx !== 0 && (
// 						<button
// 							className={`dm-list ${viewList ? 'list-button' : ''}`}
// 							onClick={handleViewChannelUserList}
// 						>
// 							채팅유저목록
// 						</button>
// 					)}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Sidebar;
