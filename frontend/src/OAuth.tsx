import React from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import axios from "axios";

const OAuth: React.FC = () => {
    const location = useLocation();
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });

    const code = query.code;
    console.log(code);
    axios.post("http://localhost:5001/auth", { code: code });
    return (
        <div>
            <h1>code</h1>
        </div>
    );
};

export default OAuth;
