import React, { useEffect, useState } from "react";
import ChannelRow from "./ChannelRow";
import { socket } from "../socket";
import instance from "../refreshToken";

interface ChannelProps{
  channelName:string
  channelInit: (channelName : string , channelIdx : number) => void;
}

function Channel({channelName, channelInit} : ChannelProps) {
  const [channelData, setChannelData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // main 페이지에 오면 접속 채널 초기화
    channelInit("undefined", 0);
    localStorage.setItem('chName', "undefined");
    localStorage.setItem('chIdx', "0");

    // API 요청
    instance
      .get("http://localhost:5001/channel/all")
      .then((response) => {
        // 요청이 성공하면 데이터를 상태로 설정
        setChannelData(response.data);
      })
      .catch((error) => {
        // 요청이 실패하면 에러 처리
        console.error("API 요청 실패:", error);
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
  

  // 채널 데이터를 페이지 단위로 나누는 함수
    const paginateChannels = (data: any[], page: number) => {
        const startIndex = (page - 1) * 8;
        const endIndex = startIndex + 8;
        return data.slice(startIndex, endIndex);
    };

  // 이전 페이지로 이동하는 함수
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // 다음 페이지로 이동하는 함수
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // 현재 페이지에 해당하는 채널 데이터 가져오기
  const paginatedChannels = paginateChannels(channelData, currentPage);

  return (
    <div className="channel_list">
             {paginatedChannels.map((channel, index) => {
                if (index % 2 === 0) {
                    return (
                        <ChannelRow
                            key={index}
                            channelData1={channel}
                            // channelData2={channelData[index + 1]}
                            channelData2={paginatedChannels[index + 1]}
                        />
                    );
                }
                return null;
            })}
          {channelData.length > 0 && (
      <div className="chan-left-right_button">
        <button
          className={`chan-left_button ${currentPage === 1 ? "chan-empty_left_button" : ""}`}
          onClick={goToPreviousPage}
          disabled={currentPage === 1} // 첫 번째 페이지면 비활성화
        ></button>
        <button
          className={`chan-right_button ${currentPage === Math.ceil(channelData.length / 8) ? "chan-empty_right_button" : ""}`}
          onClick={goToNextPage}
          disabled={currentPage === Math.ceil(channelData.length / 8) || paginatedChannels.length < 8} // 마지막 페이지면 비활성화
          ></button>
      </div>
    )}
    </div>
  );
}

export default Channel;

