<<<<<<< HEAD
import PwInput from "./PwInput";

  function ChannelRoom() {
    const channelName = '히킴 해삼 말미잘 멍충이';
  
=======
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PwInput from "./PwInput";

interface ChannelData {
  chIdx: number;
  chName: string;
  chPwd: string;
  chUserCnt: number;
  operatorId: string;
};

interface ChannelRoomProps {
  channelData: ChannelData;
}

function ChannelRoom({ channelData }: ChannelRoomProps) {
  const { chIdx ,chName, chPwd, chUserCnt, operatorId } = channelData;
  
  // axios 를 통해서 operatorid로 사진과 닉네임 가져오기
>>>>>>> frontend
    return (
      <div className="chan-room">
        <div className="chan-lockcheck">
          <img src="/channel/lock.png" alt="lock" />
        </div>
        <div className="chan-hostinfo">
          <div className="chan-hostimg">
            <img src="/avatar/son.jpeg" alt="son" />
          </div>
<<<<<<< HEAD
          <span className="chan-hostname">방장_이름</span>
        </div>
        <div className="chan-info">
          <span className="chan-name">{channelName}</span>
          <PwInput channelName={channelName} />
          <div className="chan-count">3/5</div>
=======
          <span className="chan-hostname">닉네임!!</span>
        </div>
        <div className="chan-info">
          <span className="chan-name">{chName}</span>
          <PwInput chIdx={chIdx} />
          <div className="chan-count">{chUserCnt}/5</div>
>>>>>>> frontend
        </div>
      </div>
    );
  }
<<<<<<< HEAD

export default ChannelRoom;
=======
export default ChannelRoom
>>>>>>> frontend
