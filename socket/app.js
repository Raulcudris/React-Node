import "dotenv/config";
import { Server } from "socket.io";

const PORT = Number(process.env.PORT || 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const io = new Server({
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
  // Opcional: mejora estabilidad detrás de proxy/load balancer
  transports: ["websocket", "polling"],
  pingTimeout: 20000,
  pingInterval: 25000,
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
    io.emit("onlineUsers", onlineUsers); // opcional: enviar lista a todos
  });

  socket.on("sendMessage", ({ receiverId, data }, ack) => {
    const receiver = getUser(String(receiverId));

    if (!receiver) {
      // receptor offline: no explota y puedes actuar en frontend
      if (typeof ack === "function") ack({ ok: false, reason: "RECEIVER_OFFLINE" });
      return;
    }

    io.to(receiver.socketId).emit("getMessage", data);

    if (typeof ack === "function") ack({ ok: true });
  });

  socket.on("disconnect", (reason) => {
    removeUser(socket.id);
    console.log("❌ socket disconnected:", socket.id, reason);
    io.emit("onlineUsers", onlineUsers); // opcional
  });
});

io.listen(PORT);
console.log(`🚀 Socket.IO listening on port ${PORT} | origin: ${CLIENT_ORIGIN}`);
