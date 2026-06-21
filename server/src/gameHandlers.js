export function registerGameHandlers(socket, io, rooms, broadcastRoomState){
     socket.on("playCard", (cardId, chosenColor) =>{
        const room = rooms.get(socket.data.roomCode);
        if(!room) return;

        const result = room.playCard(socket.id,cardId, chosenColor);
        if(!result.success){
            socket.emit("errorMsg", result.reason);
            return;
        }
         broadcastRoomState(room);


     });

      socket.on("drawCard", () =>{
        const room = rooms.get(socket.data.roomCode);
        if(!room) return;

        const result = room.drawCard(socket.id);
        if(!result.success){
            socket.emit("errorMsg", result.reason);
            return;
        }
        broadcastRoomState(room);
      });
}