import React, { useEffect, useState } from "react";
import ChannelRow from "./ChannelRow";
import axios from "axios";

function Channel() {
  const [channelData, setChannelData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // API 요청
    axios
      .get("http://localhost:5001/channel/all")
      .then((response) => {
        // 요청이 성공하면 데이터를 상태로 설정
        setChannelData(response.data);
      })
      .catch((error) => {
        // 요청이 실패하면 에러 처리
        console.error("API 요청 실패:", error);
      });
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

      {(channelData.length > 0 && channelData.length > 8) && (
    //  {(channelData.length === 0 || (channelData.length / 8 > 0 && channelData.length % 8 === 0)) && (
        <div className="chan-left-right_button">
          <button
            className="chan-left_button"
            onClick={goToPreviousPage}
            disabled={currentPage === 1} // 첫 번째 페이지면 비활성화
          ></button>
          <button
            className="chan-right_button"
            onClick={goToNextPage}
            disabled={paginatedChannels.length < 8} // 마지막 페이지면 비활성화
          ></button>
        </div>
      )}
    </div>
  );
}

export default Channel;

