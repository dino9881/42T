import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "react-bootstrap/lib/InputGroup";

interface UserInfos {
    intra : string,
    nick : string, 
}

interface SettingInfo {
    setting :string
}

const userList = [
    {
        intra : "jonkim",
        nick : "dino"
    },
    {
        intra : "yyoo",
        nick : "yo"
    },
]

const banList = [
    {
        intra : "heeskim",
        nick : "hk"
    },
    {
        intra : "hjeong",
        nick : "hj"
    },
    {
        intra : "junhyuki",
        nick : "jh"
    },
]

function ChannelAdmin(){
    return <div className="channel-admin">
        <AdminUserList/>
        <AdminChannelSetting/>
    </div>
}

function AdminUserList(){
    return<div className="admin-list-box">
        <div className="admin-user-box">
        <h1>User List</h1>
            {userList.map(info => <UserInfo intra={info.intra} nick={info.nick}/>)}
        </div>
        <div className="admin-user-box">
        <h1>Ban List</h1>
            {banList.map(info => <UserInfo intra={info.intra} nick={info.nick}/>)}
        </div>
    </div>
}

function AdminChannelSetting() {
    return (
      <div className="admin-setting-box">
        <Setting setting="admin" />
        <Setting setting= "mute"/>
        <Setting setting= "kick"/>
        <PassSetting/>
      </div>
    );
  }

function Setting({setting} : SettingInfo){
    const [text, setText] = useState('');
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
      };
      const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      };

    return <div>
        <h3>{setting}</h3>
        <form onSubmit={onSubmit}>
            <input
                type="text"
                onChange={onChange} 
                value={text}
                name="setting"
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

function UserInfo({intra, nick} : UserInfos){
    return <div className="user-info-box">
        <div className="user-info-intra">{intra}</div>
        <div className="user-info-nick">{nick}</div>
    </div>
} 

export default ChannelAdmin;