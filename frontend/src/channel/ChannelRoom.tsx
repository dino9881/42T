import React, { useEffect, useState } from "react";
import PwInput from "./PwInput";
import axios from "axios";


interface ChannelData {
    chIdx: number;
    chName: string;
    chPwd: string;
    chUserCnt: number;
    operatorId: string;
}

interface ChannelRoomProps {
    channelData: ChannelData;
}

interface MemberData {
    intraId: string;
    nickName: string;
    avatar: string;
    rank: number;
}

function ChannelRoom({ channelData }: ChannelRoomProps) {
    const { chIdx, chName, chPwd, chUserCnt, operatorId } = channelData;
    // const [ memberData, setMemberData] = useState([]);
    const [memberData, setMemberData] = useState<MemberData>({ // MemberData 타입으로 선언
        intraId: "",
        nickName: "",
        avatar: "",
        rank: 0,
      });

    const { nickName, avatar } = memberData;
    
    // memberData 업데이트 
    useEffect(() => { // API 요청
    axios
      .get(`http://localhost:5001/member/${operatorId}`)
      .then((response) => {
        // 요청이 성공하면 데이터를 상태로 설정
        setMemberData(response.data);
      })
      .catch((error) => {
        // 요청이 실패하면 에러 처리
        console.error("API 요청 실패:", error);
      });
    }, []);

    // axios 를 통해서 operatorid로 사진과 닉네임 가져오기
    return (
        <div className="chan-room">
            <div className="chan-lockcheck">
                {chPwd && <img src="/channel/lock.png" alt="lock" />}
            {!chPwd && ( <div style={{ display: "none" }}> <img src="/channel/lock_not.png" alt="open_lock" /></div>)}
            </div>
            <div className="chan-hostinfo">
                <div className="chan-hostimg">
                    <img src={avatar} alt="son" />
                </div>
                <span className="chan-hostname">{nickName}</span>
            </div>
            <div className="chan-info">
                <span className="chan-name">{chName}</span>
                    <PwInput chIdx={chIdx} chPwd={chPwd} />
                <div className="chan-count">{chUserCnt}/5</div>
            </div>
        </div>
    );
}
export default ChannelRoom;
