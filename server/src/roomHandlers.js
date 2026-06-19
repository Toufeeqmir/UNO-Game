import { Room } from "./room.js";
import { generateRoomCode } from "./utils.js";

export function registerRoomHandlers(socket, io , rooms, broadcastRoomState){
     socket.on("createRoom", (name) =>{
         const code = generateRoomCode(rooms);
         const room = new Room(code);

         room.addPlayer(socket.id, name || "Player");
         rooms.set(code, room);
         socket.join(code);
         socket.data.roomCode = code;

         socket.emit("roomJoined", { code });
         broadcastRoomState(room);
     });

     socket.on("joinRoom", ({ code, name }) =>{
        const room = rooms.get(code?.toUpperCase());
        if(!room){
            socket.emit("errorMsg", "Room not found");
            return;
        }
        if(room.started){
            socket.emit("errorMsg", "Game already in progress");
            return;
        }

         room.addPlayer(socket.id, name || "Player");
         socket.join(room.code);
         socket.data.roomCode = room.code;

          socket.emit("roomJoined", { code: room.code });
          broadcastRoomState(room);
     });

     socket.on("startGame", () =>{
         const room  = rooms.get(socket.data.roomCode);
         if(!room) return;
         if(!room.canStart()){
             socket.emit("errorMsg", "Need at least 2 players to start");

             return;
         }
         room.startGame();
         broadcastRoomState(room);
     })
}