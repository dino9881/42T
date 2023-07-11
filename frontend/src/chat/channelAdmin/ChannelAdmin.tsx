import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import './ChannelAdmin.css'
import instance from "../../refreshToken";
import { useNavigate } from "react-router-dom";

interface UserInfos {
    intraId : string,
    nickName : string, 
}

interface SettingInfo {
    setting : string,
    chIdx : number,
    userList:UserInfos[],
    banList:UserInfos[],
}

interface ChannelAdminProps{
    channelName:string,
    channelIdx:number
}

interface AdminUserListProps{
    userList:UserInfos[];
    banList:UserInfos[];
}

function ChannelAdmin({channelName, channelIdx} :ChannelAdminProps){
        const [banList, setBanList] = useState<UserInfos[]>(() => initialData());
        const [userList, setUserList] = useState<UserInfos[]>(() => initialData());
        const [chName, setChName] = useState(channelName);
        const [chIdx, setChIdx] = useState(channelIdx);

        function initialData(): UserInfos[]  {
            return [];
          }

          useEffect(() => {

            instance.get(`http://localhost:5001/channel/users/${channelIdx}`)
              .then((response) => {
                setUserList(response.data);
              })
              .catch((error) => {
                console.error("API 요청 실패:", error);
              });

              instance.get(`http://localhost:5001/channel/ban/${channelIdx}`)
              .then((response) => {
                setBanList(response.data);
              })
              .catch((error) => {
                console.error("API 요청 실패:", error);
              });
          }, []);

    return <div className="channel-admin">
        <span>admin  : {chName}</span>
        <AdminUserList userList={userList} banList={banList}/>
        <div className="admin-setting-box">
        <Setting setting="admin" chIdx={chIdx} userList={userList} banList={banList}  />
        <Setting setting="mute" chIdx={chIdx} userList={userList} banList={banList} />
        <Setting setting="kick" chIdx={chIdx} userList={userList} banList={banList} />
        <Setting setting="ban" chIdx={chIdx}userList={userList} banList={banList} />

        <PassSetting/>
      </div>
    </div>
}

function AdminUserList({userList, banList} : AdminUserListProps){
      
    return<div className="admin-list-box">
        <div className="admin-user-box">
        <h1>User List</h1>
            {userList.map((info, index) => <UserInfo key={index} intraId={info.intraId} nickName={info.nickName}/>)}
        </div>
        <div className="admin-user-box">
        <h1>Ban List</h1>
            {banList.map((info, index) => <UserInfo key={index} intraId={info.intraId} nickName={info.nickName}/>)}
        </div>
    </div>
}

function Setting({setting, chIdx , userList, banList} : SettingInfo ){
    const [text, setText] = useState('');
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (setting === "admin")
        {
            console.log(`admin ${text}`);
        }
        else if (setting === "mute")
        {
            console.log(`mute ${text}`);
        }
        else if (setting === "kick")
        {
            console.log(`kick ${text}`);
        }
        else if (setting === "ban")
        {
            const targetIntraId = userList.find(user => user.nickName === text);
            if (targetIntraId)
            {
                instance
                .post(`http://localhost:5001/channel/ban/save/${chIdx}`, {intraId : targetIntraId, nickName: text})
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error("API 요청 실패:", error);
                });
            }
            else
            {
                alert("올바르지 않은 닉네임")
            }

            }
        setText("");
      };

    return <div>
        <h3>{setting}</h3>
        <form onSubmit={onSubmit}>
            <input
                type="text"
                onChange={onChange} 
                value={text}
                name="setting"
                autoComplete="off"
            />
             <button>제출</button>
        </form>
    </div>
}

function PassSetting()
{
    return <div className="admin-pass-box">
        <h1>채널 비밀번호 설정</h1>
        <button> 수정 </button>
        <button> 삭제 </button>
        <button> 생성 </button>
    </div>
}

function UserInfo({intraId, nickName} : UserInfos){
    return <div className="user-info-box">
        <div className="user-info-intra">{intraId}</div>
        <div className="user-info-nick">{nickName}</div>
    </div>
} 

export default ChannelAdmin;