import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  // 1) URL base del socket:
  // - PROD: VITE_SOCKET_URL = http://44.192.105.241
  // - DEV:  http://localhost:4000
  const socketUrl = useMemo(() => {
    return import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
  }, []);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(socketUrl, {
      // 2) IMPORTANTE: en PROD vas por Nginx, entonces el path debe ser /socket.io
      path: "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [socketUrl]);

  useEffect(() => {
    if (currentUser?.id && socket?.connected) {
      socket.emit("newUser", currentUser.id);
    }
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
