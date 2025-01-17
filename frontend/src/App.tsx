import "./App.css";
import axios from "axios";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import Login from "./Login";
import Chat from "./chat/Chat";
import Channel from "./channel/Channel";
import Ranking from "./ranking/Ranking";
import OAuth from "./OAuth";
import Background from "./Background";
import SetNick from "./login/SetNick";
import Contents from "./Contents";
import Menu from "./menu/Menu";
import { useState } from "react";
import ChannelAdmin from "./chat/channelAdmin/ChannelAdmin";
import Game from "./game/Game";
import Custom from "./custom/Custom";
import React from 'react'
import RankingResult from "./game/GameResult";
import NotFound from "./NotFound";


function App() {
    axios.defaults.withCredentials = true;
    const [channelName, setChannelName] = useState<string>(() => {
        const storedChName = localStorage.getItem("chName");
        return storedChName || "undefined";
      });
    const [channelIdx, setChannelIdx] = useState<number>(() => {
        const storedchannelIdx = localStorage.getItem("chIdx");
        return storedchannelIdx ? parseInt(storedchannelIdx) : 0;
      });

    function channelInit(newChannel : string, newChannelIdx : number){
        setChannelName(newChannel);
        setChannelIdx(newChannelIdx);
    }

   

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/login" element={<OAuth />}></Route>
                    <Route path="/login/nick" element={<SetNick />}></Route>
                    <Route path="/main" element={<Contents mainComponent={<Channel channelName={channelName} channelInit={channelInit} />} headerComponent={<Menu showBackButton={false} channelName={channelName} channelIdx={channelIdx}/>}/>}></Route>
                    <Route path="/chat" element={<Contents mainComponent={<Chat  channelInit={channelInit} isDM={false}/>} headerComponent={<Menu showBackButton={true} channelName={channelName} channelIdx={channelIdx}/>}/>}></Route>
                    <Route path="/dm" element={<Contents mainComponent={<Chat  channelInit={channelInit} isDM={true}/>} headerComponent={<Menu showBackButton={true} channelName={channelName} channelIdx={channelIdx}/>}/>}></Route>
                    <Route path="/admin" element={<Contents mainComponent={<ChannelAdmin channelName={channelName} channelIdx={channelIdx}/>} headerComponent={<Menu showBackButton={true} channelName={channelName} channelIdx={channelIdx}/>}/>}></Route>
                    <Route path="/rank" element={<Contents mainComponent={<Ranking/>} headerComponent={<Menu showBackButton={false} channelName={channelName} channelIdx={channelIdx}/>}/>}></Route>
                    <Route path="/game" element={<Game/>}></Route>
                    <Route path="/result" element={<Contents mainComponent={<RankingResult />} headerComponent={<Menu showBackButton={false} channelName={channelName} channelIdx={channelIdx}/>}/>}></Route>
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            <Background />
            </BrowserRouter>
        </div>
    );
}

export default App;