import React from "react";
import axios from "axios";

function Login() {
    var url = "";
    axios.get(`${process.env.REACT_APP_BACK_URL}/auth/url`)
		.then(function (response) {
            console.log(response.data);
			url =response.data
		})
    
    function Oauth() {
        window.location.href = url;
    }

    return (
        <div className="login-box">
            <h1>42트</h1>
            <button className="login-button" onClick={Oauth}>
                42 Login
            </button>
        </div>
    );
}

export default Login;
