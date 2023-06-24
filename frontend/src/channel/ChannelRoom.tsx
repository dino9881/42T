import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PwInput from "./PwInput";

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

function ChannelRoom({ channelData }: ChannelRoomProps) {
    const { chIdx, chName, chPwd, chUserCnt, operatorId } = channelData;

    // axios 를 통해서 operatorid로 사진과 닉네임 가져오기
    return (
        <div className="chan-room">
            <div className="chan-lockcheck">
                <img src="/channel/lock.png" alt="lock" />
            </div>
            <div className="chan-hostinfo">
                <div className="chan-hostimg">
                    <img src="/avatar/son.jpeg" alt="son" />
                </div>
                <span className="chan-hostname">닉네임!!</span>
            </div>
            <div className="chan-info">
                <span className="chan-name">{chName}</span>
                <PwInput chIdx={chIdx} />
                <div className="chan-count">{chUserCnt}/5</div>
            </div>
        </div>
    );
}
export default ChannelRoom;
