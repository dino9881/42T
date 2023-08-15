import { io } from "socket.io-client";

export const socket = io(`ws://${process.env.REACT_APP_HOST}:5001`, {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: true,
});
