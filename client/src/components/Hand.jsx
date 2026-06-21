import { useState } from "react";
import Card from "./Card";
import { socket } from "../socket";
import { canPlayCard } from "../gameRules";

const COLOR_OPTIONS = [
    { name:  "red", className: "bg-red-500"},
    { name: "yellow", className: "bg-yellow-400"},
    { name: "green", className: "bg-green-500"},
    { name: "blue", className: "bg-blue-500"},
];

export default function Hand ({ hand, isMyTurn , topCard, activeColor }){
   const [pendingWildCardId, setPendingWildCard] = useState(null);
     function handlePlay(card){
      console.log("handlePlay fired for card: ", card.id, card.type);
       if(card.type === "wild"){
          setPendingWildCard(card.id);
          return;
       }
        console.log("About to emit playCard, socket connected?", socket.connected, "socket id:", socket.id);
        socket.emit("playCard", card.id);
     }

      function handleChooseColor(color){
          socket.emit("playCard", pendingWildCardId, color);
          setPendingWildCard(null);
      }
 

   //   console.log("Hand contents: ", hand.map(c => c.id), "Socket ID", socket.id);


     return(
         <div className="flex gap-2 flex-wrap p-3 justify-center">

            {hand.map((card) =>{
                 const playable = isMyTurn && canPlayCard(card, topCard, activeColor);
                  console.log("Card:", card.id, card.color, "| isMyTurn:", isMyTurn, "| activeColor:", activeColor, "| playable:", playable);

                 return(
                     <Card
                      key={card.id}
                      card={card}
                      disabled={!playable}
                      onClick={() => handlePlay(card)}
                       />
                 );
            })}


      {pendingWildCardId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 text-center">
            <h3 className="text-slate-900 font-semibold mb-4">Choose a color</h3>
            <div className="flex gap-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleChooseColor(c.name)}
                  className={`${c.className} w-14 h-14 rounded-lg border-4 border-white shadow-md`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

             
         </div>
         
     )
}