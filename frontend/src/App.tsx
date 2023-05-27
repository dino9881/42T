import "./App.css";
import Login from "./Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OAuth from "./OAuth";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/login" element={<OAuth />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
