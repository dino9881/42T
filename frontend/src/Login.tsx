import React from "react";
import { useNavigate } from "react-router-dom";



function Login()
{
    const navigate = useNavigate();
    function navMain(){
        navigate("/main");
    }
    return(
        <div className="login-box">
            <h1>42트</h1>
            <button className="login-button" onClick={navMain}>42 Login</button>
        </div>
    );
}

export default Login;