import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChannelNew() {
    
        const navigate = useNavigate();
        const [inputValue, setInputValue] = useState("");
        const [isCloseNewMake, setCloseNewMake] = useState(true);
        const [isChecked, setIsChecked] = useState(true);

        const closeNewMake = () => {
            setCloseNewMake(false);
        }

        const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
            setIsChecked(event.target.checked);
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
            const title = (document.getElementsByName("title_inputbox")[0] as HTMLInputElement).value;
            const password = (document.getElementsByName("password_input")[0] as HTMLInputElement).value;
        
            if(password) {
                return axios
                    .post("http://localhost:5001/channel/create" ,{ 
                        chName: title,
                        operatorId: "junhyuki",
                        chPwd: password,
                        
                    })
                    .then((response) => {
                        console.log(response.data.chIdx)
                        navigate("/chat", { state: { chIdx:response.data.chIdx } });
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
                    return axios
                    .post("http://localhost:5001/channel/create" ,{ 
                        chName: title,
                        operatorId: "junhyuki",                        
                    })
                    .then((response) => {
                        console.log(response.data.chIdx)
                        navigate("/chat", { state: { chIdx:response.data.chIdx } });
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
                비밀의방
                </div>
                {/* <button className="chan-new_make_button">만들기</button> */}
                <button onClick={makeNewChannel} className="chan-new_make_button">만들기</button>
            </div>
        </div>
    )}
    </>
    );
}

export default ChannelNew;
