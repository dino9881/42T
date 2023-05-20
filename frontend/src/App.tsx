import "./App.css";
import Layout from "./Layout";
import Login from "./Login";
import Main from "./main";
import Chat from "./Chat";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OAuth from "./OAuth";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/login" element={<OAuth />}></Route>
                    <Route path="/main" element={<Main />}></Route>
                    <Route path="/chat" element={<Chat />}></Route>
                </Routes>
            </BrowserRouter>
            <Layout />
        </div>
    );
}
export default App;
