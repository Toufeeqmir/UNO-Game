import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { registerRoomHandlers } from "./roomHandlers.js";
import { registerGameHandlers } from "./gameHandlers.js";

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const rooms = new Map();

function broadcastRoomState(room) {
  for (const playerId of room.players.keys()) {
    io.to(playerId).emit("state", room.getStateForPlayer(playerId));
  }
}

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  registerRoomHandlers(socket, io, rooms, broadcastRoomState);
  registerGameHandlers(socket, io, rooms, broadcastRoomState);

  socket.on("disconnect", () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    room.removePlayer(socket.id);

    if (room.playerCount === 0) {
      rooms.delete(room.code);
      console.log(`Room ${room.code} closed (empty)`);
    } else {
      broadcastRoomState(room);
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`UNO server running on port ${PORT}`);
});