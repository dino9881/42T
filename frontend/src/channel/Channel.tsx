<<<<<<< HEAD
import React from "react";
import ChannelRow from "./ChannelRow";



function Channel(){
    return <div className="channel_list">
        <ChannelRow></ChannelRow>
        <ChannelRow></ChannelRow>
        <ChannelRow></ChannelRow>
        <ChannelRow></ChannelRow>
    </div>
}


=======
import React, { useEffect, useState } from "react";
import ChannelRow from "./ChannelRow";
import axios from "axios";

function Channel(){
    const [channelData, setChannelData] = useState([]);

    useEffect(() => {
    // API 요청
    axios.get("http://localhost:5001/channel/all")
      .then(response => {
        // 요청이 성공하면 데이터를 상태로 설정
        setChannelData(response.data);
      })
      .catch(error => {
        // 요청이 실패하면 에러 처리
        console.error("API 요청 실패:", error);
      });
    }, []);
    console.log(channelData);

    // return <div className="channel_list">
    //     {channelData.map((channel, index) => (
    //         <ChannelRow channelData={channelData}></ChannelRow>
    //     ))}
    // </div>
    return <div className="channel_list">
            {channelData.map((channel, index) => {
            if (index % 2 === 0) {
                return (
                <ChannelRow
                    key={index}
                    channelData1={channel}
                    channelData2={channelData[index + 1]}
                />
                );
            }
            return null;
            })}
     </div>
}



>>>>>>> frontend
export default Channel;
