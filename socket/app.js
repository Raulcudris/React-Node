import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

const PORT = Number(process.env.PORT || 4000);

// IMPORTANTE: en prod debe ser tu host público SIN slash final
// Ej: http://44.192.105.241  (o https si tienes cert válido)
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || "http://localhost:5173").replace(/\/$/, "");

// 1) Crear httpServer explícito (más estable detrás de proxy)
const httpServer = http.createServer();

const io = new Server(httpServer, {
  // 2) CORS bien definido
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },

  // 3) Transportes OK detrás de Nginx (polling + websocket)
  transports: ["websocket", "polling"],

  pingTimeout: 20000,
  pingInterval: 25000,

  // Opcional: si estás detrás de proxy y notas cortes
  // allowEIO3: true,
});

let onlineUsers = []; // [{ userId, socketId }]

const addUser = (userId, socketId) => {
  if (!userId) return;
  const exists = onlineUsers.find((u) => u.userId === userId);
  if (!exists) onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
};

const getUser = (userId) => onlineUsers.find((u) => u.userId === userId);

io.on("connection", (socket) => {
  console.log("✅ socket connected:", socket.id);

  socket.on("newUser", (userId) => {
    addUser(String(userId), socket.id);
    console.log("👥 onlineUsers:", onlineUsers.length);
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("sendMessage", ({ receiverId, data }, ack) => {
    const receiver = getUser(String(receiverId));

    if (!receiver) {
      if (typeof ack === "function") ack({ ok: false, reason: "RECEIVER_OFFLINE" });
      return;
    }

    io.to(receiver.socketId).emit("getMessage", data);
    if (typeof ack === "function") ack({ ok: true });
  });

  socket.on("disconnect", (reason) => {
    removeUser(socket.id);
    console.log("❌ socket disconnected:", socket.id, reason);
    io.emit("onlineUsers", onlineUsers);
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Socket.IO listening on port ${PORT} | origin: ${CLIENT_ORIGIN}`);
});
