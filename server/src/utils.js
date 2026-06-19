export function generateRoomCode(rooms){
     const chars = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
     let code;
     do{
         code = Array.from({ length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join("");
     } while (rooms.has(code));
     return code;
}

