import React, { useState, useEffect } from "react";
import axios from "axios";
import FriendInfoSimple from "../friendlist/FriendInfoSimple";
import IsNotFriend from "./IsNotFriend";
import "./AddFriend.css";

interface SearchFriendProps {
  intraId: string;
  friendStatus: number;
  onClose: () => void;
}

interface FriendInfoProps {
<<<<<<< HEAD
  nickName: string;
  rank: number;
  avatar: string;
=======
	nickName: string;
	rank: number;
	avatar: string;
>>>>>>> socket-chat
}

const SearchFriend: React.FC<SearchFriendProps> = ({
  intraId,
  friendStatus,
  onClose,
}) => {
  const [userData, setUserData] = useState<any>(null);

<<<<<<< HEAD
  useEffect(() => {
    axios.get(`http://localhost:5001/member/${intraId}`).then((response) => {
      console.log(response);
      setUserData(response.data);
    });
  }, [intraId]);

  return (
    <div className="search-result">
      <img
        className="search-result-close-button"
        src="close_button.svg"
        alt="Close"
        width="20"
        height="20"
        onClick={onClose}
        style={{ cursor: "pointer" }}
      />
      {userData && friendStatus === 1 ? (
        <FriendInfoSimple
          nickName={userData.nickName}
          rank={userData.rank}
          avatar={userData.avatar}
          winCnt={userData.winCnt}
          loseCnt={userData.loseCnt}
        />
      ) : (
        userData && (
          <IsNotFriend
            nickName={userData.nickName}
            rank={userData.rank}
            avatar={userData.avatar}
            onClose={onClose}
            intraId={intraId}
            friendStatus={friendStatus} // friendStatus 속성을 전달해주세요.
          />
        )
      )}
    </div>
  );
};
=======
	const nickName = "GOAT"
	const rank = 28
	const avatar = "avatar/GOAT.jpeg"

	return (
	  <div className='search-result'>
		<img
		  className='search-result-close-button'
		  src="close_button.svg"
		  alt="Close"
		  width="20"
		  height="20"
		  onClick={onClose}
		/>
		{friendStatus === 1 ?
			(<FriendInfoSimple  nickName={nickName} rank={rank} avatar={avatar}/>)
			: (<IsNotFriend nickName={nickName} rank={rank} avatar={avatar}/>)
		}
	  </div>
	);
};
  
const IsNotFriend: React.FC<FriendInfoProps> = ({ nickName, rank, avatar }) => {
	const handleAdd = () => {
		console.log('친구 추가');
	}

	const handleBlock = () => {
		console.log('차단');
	}

	return (
		<div className='friend-info-simple'>
			<div
				className='friend-info-avatar'
				style={{ backgroundImage: `url(${avatar})` }}
			></div>
			<div className='friend-info-info'>
				<div className='friend-info-text'>
					<div className='small-square'>{nickName}</div>
					<div className='small-square'>{rank}</div>
				</div>
				<div className='friend-info-button'>
					<div className="friend-button">
						<button className='dm-button' onClick={handleAdd}>친구추가</button>
						<button className='vs-button' onClick={handleBlock}>차단</button>
					</div>
						<div className='small-square'>전적</div>
				</div>
			</div>
		</div>
	)
}
>>>>>>> socket-chat

export default SearchFriend;
