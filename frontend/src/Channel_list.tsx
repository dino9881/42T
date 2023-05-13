import React from "react";
import { useNavigate } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';

function channel_list()
{
    const navigate = useNavigate();
    function navMain(){
        navigate("/main");
    }
    return{
        <div className="channel_list-box">
            <h1></h1>
        </div>
    };
}

export default channel_list