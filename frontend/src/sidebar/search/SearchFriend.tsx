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
  nickName: string;
  rank: number;
  avatar: string;
}

const SearchFriend: React.FC<SearchFriendProps> = ({
  intraId,
  friendStatus,
  onClose,
}) => {
  const [userData, setUserData] = useState<any>(null);

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

export default SearchFriend;
