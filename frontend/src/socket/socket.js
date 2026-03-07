// Module-level socket instance — not stored in Redux (not serializable)
// Components use this to emit events; Redux stores derived data (onlineUsers, messages)

import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => socket;

export const initSocket = (userId) => {
    if (socket) return socket; // already connected
    socket = io(import.meta.env.VITE_BACKEND_URL.replace("/api", ""), {
        query: { userId },
        withCredentials: true,
    });
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
