import { io } from "socket.io-client";

export const socket = io("ws://localhost:5001", {
    transports: ["websocket"],
    withCredentials: true,
});
