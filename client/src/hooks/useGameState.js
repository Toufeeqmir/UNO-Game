import { useEffect, useState } from "react";
import { socket } from "../socket";

export function useGameState(){
     const [gameState, setGameState] = useState(null);
     const [roomCode , setRoomCode]  = useState(null);
     const [errorMsg, setErrorMsg] = useState(null);

     useEffect(() =>{
         function handleState(state){
            setGameState(state);
         }

         function handleRoomJoined({code}){
            setRoomCode(code);
            setErrorMsg(null);
         }

          function handleError(msg){
             setErrorMsg(msg);
          }

           socket.on("state", handleState);
           socket.on("roomJoined", handleRoomJoined);
           socket.on("errorMsg", handleError);

           return () =>{
             socket.off("state", handleState);
             socket.off("roomJoined", handleRoomJoined);
              socket.off("errorMsg", handleError);
           };

     }, []);

     return { gameState, roomCode , errorMsg, setErrorMsg };

}