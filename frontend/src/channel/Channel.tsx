import React, { useEffect, useState } from "react";
import ChannelRow from "./ChannelRow";
import { socket } from "../socket";
import instance from "../refreshToken";
import './Channel.css';

interface ChannelProps{
  channelName:string
  channelInit: (channelName : string , channelIdx : number) => void;
}

interface ChannelData {
  chIdx: number;
  chName: string;
  chPwd: string;
  chUserCnt: number;
  ownerId: string;
}


function Channel({channelName, channelInit} : ChannelProps) {
  const [channelData, setChannelData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    channelInit("undefined", 0);
    localStorage.setItem('chName', "undefined");
    localStorage.setItem('chIdx', "0");

    instance
      .get(`${process.env.REACT_APP_BACK_URL}/channel/all`)
      .then((response) => {
        setChannelData(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401)
			      alert("Accesstoken 인증 실패.");
        else if(error.response.status === 404)
            alert("없는 멤버...;;");    
        else if(error.response.status === 500)
            alert("서버에러 (뺵 잘못)");
      });

      socket.on("reload", () => { window.location.reload(); });
    return () => {socket.off("reload")};
  }, []);
  
    const paginateChannels = (data : ChannelData[] , page: number) => {
        const startIndex = (page - 1) * 8;
        const endIndex = startIndex + 8;
        return data.slice(startIndex, endIndex);
    };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const paginatedChannels = paginateChannels(channelData, currentPage);

  return (
    <div className="channel_list">
             {paginatedChannels.map((channel, index) => {
                if (index % 2 === 0) {
                    return (
                        <ChannelRow
                            key={index}
                            channelData1={channel}
                            channelData2={paginatedChannels[index + 1]}
                        />
                    );
                }
                return null;
            })}
          {channelData.length > 0 && (
      <div className="chan-left-right_button">
        <button
          className={`${currentPage === 1 ? "chan-empty_left_button" : "chan-left_button"}`}
          onClick={goToPreviousPage}
        ></button>
        <button
          className={`${(currentPage === Math.ceil(channelData.length / 8) ) ? "chan-empty_right_button" : "chan-right_button"}`}
          onClick={goToNextPage}
          ></button>
      </div>
    )}
    </div>
  );
}

export default Channel;

