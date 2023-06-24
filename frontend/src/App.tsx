import "./App.css";
import axios, { AxiosResponse } from "axios";
import Login from "./Login";
import Main from "./main";
import Chat from "./Chat";
import Channel from "./channel/Channel";
import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import OAuth from "./OAuth";
import Background from "./Background";

function App() {
    axios.defaults.withCredentials = true;

   

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/login" element={<OAuth />}></Route>
                    <Route path="/main" element={<Main />}></Route>
                    <Route path="/chat" element={<Chat />}></Route>
                    <Route path="/channel" element={<Channel />}></Route>
                </Routes>
            </BrowserRouter>
            <Background />
            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <div className="footer">
            <h4>2023 ft_transcendence</h4>
        </div>
    );
}

export default App;
