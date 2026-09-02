import { io } from "socket.io-client";

const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL;

if (!socketUrl) {
  throw new Error("EXPO_PUBLIC_SOCKET_URL is not configured");
}

export const socket = io(socketUrl, {
  transports: ["websocket"],
  autoConnect: false
});


