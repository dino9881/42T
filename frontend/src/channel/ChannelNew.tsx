import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../refreshToken";
import { socket } from "../socket";
import './Channel.css';

interface ChannelData{
    chIdx: number;
}

function ChannelNew() {
    
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [isCloseNewMake, setCloseNewMake] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [isPchecked, setIsPchecked] = useState(false);

    let publicAndPrivate = "";

    if (isPchecked) 
        publicAndPrivate = "비밀방";
    else 
        publicAndPrivate = "공개방"; 
    
    useEffect(() => {

        socket.on("new-channel", (payload: ChannelData) => {
            closeNewMake();
            navigate("/chat", { state: { chIdx:payload.chIdx } });
        });
        
        socket.on("duplicate-chanName", () => {
            console.log("dub error")
            alert("같은 제목의 방이 이미 있습니다.");
        });
        
        socket.on("max-channel", () => {
            alert("만들 수 있는 방의 수를 초과했습니다.");
        });
        
        socket.on("server-error", () => {
            alert("server error");
        });

        return () => {
            console.log("여기가 리리턴 in이다~~!!")
            socket.off("max-channel");
            socket.off("new-channel");
            socket.off("duplicate-chanName");
            socket.off("server-error");
        };
    }, []); 


    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter" && event.nativeEvent.isComposing === false) {
          makeNewChannel();
        }
    };

    const closeNewMake = () => {
        console.log("클로즈 뉴 메이크");
        setCloseNewMake(false);
        setInputValue("");
    }

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
        if(!event.target.checked){
            setInputValue("");
        }
    }

    const handlePrivateboxChange = (e : ChangeEvent<HTMLInputElement>) => {
        setIsPchecked(e.target.checked);
        if(e.target.checked){
            setIsChecked(false);
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
        const title = (document.getElementsByName("title_inputbox")[0] as HTMLInputElement).value.trim();
        const password = (document.getElementsByName("password_input")[0] as HTMLInputElement).value;
        
        if(!title) {
            alert("방제목을 확인해주세요.");
            return;
        }
        
        if (title.includes("#")) {
            alert("방제목에 #을 넣을수 없습니다.");
            return;
        }

        if(isChecked && password.length !== 4) {
            alert("비밀번호는 4자리로 입력해주세요.");
            return;
        }

        if(isPchecked){
        instance
            .post(`${process.env.REACT_APP_BACK_URL}/channel/create`, {chName:title, isPrivate:true})
            .then((response) => {
                closeNewMake();
                navigate("/chat", { state: { chIdx:response.data.chIdx }});
            })
            .catch((error) => {
                // 요청이 실패하면 에러 처리
                if (error.response.status === 401)
                    alert("Accesstoken 인증 실패.");
                else if(error.response.status === 400)
                    alert("잘못된 요청입니다.");    
                else if(error.response.status === 403)
                    alert("만들수 있는 방의 수를 초과.");    
                else if(error.response.status === 404)
                    alert("없는 채널 && 없는 멤버.");    
                else if(error.response.status === 409)
                    alert("중복된 이름.");    
                else if(error.response.status === 500)
                    alert("서버에러 (뺵 잘못)");
            });
        } else {
            socket.emit("create-channel", {
                channelName: title,
                password: password,
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
            <div className="chan-new_nameAndcheckbox">
                <div className="chan-new_name">방 제목</div>
                    <input id="toggle" type="checkbox" checked={isPchecked} onChange={handlePrivateboxChange} hidden/>
                <label htmlFor="toggle" className="toggleSwitch">
                    <span className="toggleButton"></span>
                </label>
                <div className="chan-new_publicAndPrivate">{publicAndPrivate}</div>
            </div>
            <input onKeyDown={handleKeyPress} type="text" name="title_inputbox" className="chan-new_input_title" maxLength={20} autoComplete='off'></input>
        </div>    
        <div className="chan-new_pwbox">
            <div className="chan-new_pwcheck">
                <input disabled={isPchecked} type="checkbox" className="chan-new_make_checkbox" name="make_password" value="1"  checked={isChecked} onChange={handleCheckboxChange}></input>
                <div className="chan-new_pw">비밀 번호</div>
            </div>
            <input placeholder="비밀번호는 숫자만 4자리" type="password" name="password_input" className="chan-new_input_password" value={inputValue} maxLength={4}  disabled={!isChecked} onChange={handleInputChange}></input>
        </div>
        <div className="chan-new_make_do_box">
            <button onClick={makeNewChannel} className="chan-new_make_button">만들기</button>
        </div>
    </div>
)}
</>
);
}

export default ChannelNew;