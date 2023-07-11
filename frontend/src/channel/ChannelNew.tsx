import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../refreshToken";

function ChannelNew() {
    
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [isCloseNewMake, setCloseNewMake] = useState(true);
    const [isChecked, setIsChecked] = useState(false);

    const closeNewMake = () => {
        setCloseNewMake(false);
        setInputValue("");
    }

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
        if(!event.target.checked){
            setInputValue("");
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // 숫자 이외의 문자 제거
        const filteredValue = value.replace(/\D/g, "");
        setInputValue(filteredValue);
    };

    const makeNewChannel = ()  => {
        // console.log("chIdx : " + chIdx);
        // console.log("chPwd : " + inputValue);
        const title = (document.getElementsByName("title_inputbox")[0] as HTMLInputElement).value.trim();
        const password = (document.getElementsByName("password_input")[0] as HTMLInputElement).value;
        
        if(!title) {
            alert("방제목을 확인해주세요.");
            return;
        }

        if(isChecked && password.length !== 4) {
            alert("비밀번호는 4자리로 입력해주세요.");
            return;
        }
        
        const requestData = {
            chName: title,
            chPwd: isChecked ? password : undefined,
        };

        if(password) {
            return instance
                .post("http://localhost:5001/channel/create" , requestData)
                .then((response) => {
                    console.log(response.data.chIdx)
                    navigate("/chat", { state: { chIdx:response.data.chIdx } });
                    closeNewMake();
                })
                .catch((error) => {
                    console.log(error.response.status);
                    if(error.response.status === 409)
                        alert("같은 제목의 방이 이미 있습니다.");
                    else if (error.response.status === 400)
                        alert("입력정보가 잘못되었습니다(bad request).");
                    else if (error.response.status === 400)
                        alert("입력정보가 잘못되었습니다(bad request).");
                    else if(error.response.status === 404)
                        alert("멤버가 아님...;;");    
                    else if(error.response.status === 500)
                        alert("서버에러 (뺵 잘못)");
                });
            } else {
                return instance
                .post("http://localhost:5001/channel/create" ,{ 
                    chName: title,
                })
                .then((response) => {
                    console.log(response.data.chIdx)
                    navigate("/chat", { state: { chIdx:response.data.chIdx } });
                    closeNewMake();
                })
                .catch((error) => {
                    console.log(error.response.status);
                    if(error.response.status === 409)
                        alert("같은 제목의 방이 이미 있습니다.");
                    else if (error.response.status === 400)
                        alert("입력정보가 잘못되었습니다(bad request).");
                    else if(error.response.status === 404)
                        alert("멤버가 아님...;;");    
                    else if(error.response.status === 500)
                        alert("서버에러 (뺵 잘못)");
                    // 요청이 실패하면 에러 처리
                    // console.error("API 요청 실패:", error);
                });
            } 
    };

return (
    <>
    {isCloseNewMake && (
    <div className="chan-new_make">
        <button className="chan-new-make_close" onClick={closeNewMake} > 
        <img src="/channel/x_image.png" alt="Close" width={28} height={28}/>
        </button>
        <div className="chan-new_namebox">
            <div className="chan-new_name">방 제목</div>
            <input type="text" name="title_inputbox" className="chan-new_input_title" maxLength={20}></input>
        </div>    
        <div className="chan-new_pwbox">
            <div className="chan-new_pw">비밀 번호</div>
            <input type="password" name="password_input" className="chan-new_input_password" value={inputValue} maxLength={4}  disabled={!isChecked} onChange={handleInputChange}></input>
        </div>
        <div className="chan-new_make_do_box">
            <div>
            <input type="checkbox" className="chan-new_make_checkbox" name="make_password" value="1"  checked={isChecked} onChange={handleCheckboxChange}></input>
            비밀의 방
            </div>
            <button onClick={makeNewChannel} className="chan-new_make_button">만들기</button>
        </div>
    </div>
)}
</>
);
}

export default ChannelNew;