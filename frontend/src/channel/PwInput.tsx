import instance from "../refreshToken";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import './Channel.css';

interface PwInputProps {
    chIdx: number;
    chPwd: string;
    chUserCnt: number;
}

let isChanUser = false;

function PwInput({ chIdx, chPwd = "", chUserCnt } : PwInputProps) {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // 숫자 이외의 문자 제거
        const filteredValue = value.replace(/\D/g, "");
        setInputValue(filteredValue);
    };

    const handleButtonClick = () => {
        if(!isChanUser){
        instance
            .get(`${process.env.REACT_APP_BACK_URL}/channel/isChan/${chIdx}`)
            .then((response) => {
                isChanUser = response.data;
            })
            .catch((error) => {
                if(error.response.status === 400)
                {
                    alert("비밀번호를 확인해주세요1");
                    window.location.reload();
                }
                else if (error.response.status === 403)
					alert(error.response.data.message);
				else if(error.response.status === 404)
					alert("없는 채널번호...;;");    
				else if(error.response.status === 500)
					alert("서버에러 (뺵 잘못)");
            });
        }
        // 입력값이 4자리인지 확인
        if(!inputValue || inputValue.length === 4){   
        instance
            // .post("${process.env.REACT_APP_BACK_URL}/channel/create", {chName:title, isPrivate:true})
            .post(`${process.env.REACT_APP_BACK_URL}/channel/enter/${chIdx}`, {chPwd:inputValue})
            .then((response) => {
                if (!isChanUser)
                    socket.emit("first-enter", {channelName: response.data.chName} );
                navigate("/chat", { state: { chIdx } });
            })
            .catch((error) => {
                if(error.response.status === 400)
                {
                    alert("비밀번호를 확인해주세요2");
                    window.location.reload();
                }
				else if (error.response.status === 403)
					alert(error.response.data.message);
				else if(error.response.status === 404)
					alert("없는 채널번호...;;");    
				else if(error.response.status === 500)
					alert("서버에러 (뺵 잘못)");
            });
            return;
        }
    
        if(chUserCnt === 5)
        {
            alert("이미 인원이 다 찼습니다.");
            return;
        }
    };

    return (
        <div className="chan-pw_inputbox">
            <input type="password" name="pw-input" className={chPwd ? "chan-pw_input" : "chan-pw_input hidden"} value={inputValue} onChange={handleInputChange} maxLength={4} />
            <Button onClick={handleButtonClick} className="enter_button" variant="light" size="sm">
              Enter
            </Button>
        </div>
      );
}

export default PwInput;
