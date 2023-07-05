import axios from "axios";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface PwInputProps {
    chIdx: number;
    chPwd: string;
}

function PwInput({ chIdx, chPwd } : PwInputProps) {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // 숫자 이외의 문자 제거
        const filteredValue = value.replace(/\D/g, "");
        setInputValue(filteredValue);
    };

    const pwCorrect = () : Promise<boolean> => {
        // console.log("chIdx : " + chIdx);
        // console.log("chPwd : " + inputValue);
        return axios
            .post(`http://localhost:5001/channel/check/${chIdx}` ,{ 
                chPwd: inputValue 
            })
            .then((response) => {
                const data = response.data;
                // console.log(data);
                return data;
            })
            .catch((error) => {
                // 요청이 실패하면 에러 처리
                console.error("API 요청 실패:", error);
            });
    }

    const handleButtonClick = () => {
        // 입력값이 4자리인지 확인
        if(!chPwd)
        {   navigate("/chat", { state: { chIdx } });
            return 
        }
        if (inputValue.length === 4) {
            pwCorrect().then((data: boolean) => {
                if (data) {
                    navigate("/chat", { state: { chIdx } });
                } else {
                    alert("비밀번호를 확인해주세요. ^^");
                }
            });
        } else {
            alert("비밀번호를 확인해주세요. ^^");
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
