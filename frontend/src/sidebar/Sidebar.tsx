import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFriend from './search/AddFriend';
import MyInfo from './myinfo/MyInfo';
import FriendList from './friendlist/FriendList';
import DmList from './dmlist/DmList';
import './Sidebar.css';

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
	const [memberData, setMemberData] = useState<any>(null)

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

	// axios.post('http://localhost:5001/member/create', 
	// {
	// 	"intraId": "heeskim",
	// 	"nickName": "hees",
	// 	"avatar": "../public/img/avatar.jpg",
	// 	"rank": 100
	// }
	// )
	// .then(function (response) {
	// 	console.log(response);
	// })
	// .catch(function (error) {
	// 	console.log(error);
	// });

	// useEffect(() => {
	// 	axios.get('http://localhost:5001/member/heeskim')
	// 		.then((response) => {
	// 			setMemberData(response.data);
	// 			console.log(response.data); // 데이터 출력
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// }, []);

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
  