import { socket } from "../socket";
import { canPlayCard } from "../gameRules";
import Hand from "./Hand";
import DiscardPile  from "./DiscardPile";
import PlayerList from "./PlayerList";
import TurnIndicator from "./TurnIndicator";
import GameOverModal from "./GameOverModal";
 
export default function GameRoom({ gameState, errorMsg, onPlayAgain }){
    const { yourHand , topCard , activeColor,  currentPlayerId, players, deckCount, winnerId} = gameState;

    const isMyTurn = currentPlayerId === socket.id;
    const canPlayAny = yourHand.some((card) => canPlayCard(card, topCard, activeColor));

    function handleDraw() {
        if (!isMyTurn) return;
        socket.emit("drawCard");
    }

    console.log("topCard:", topCard, "activeColor:", activeColor, "YourHand:", yourHand);
    return(
         <div className="grid grid-cols-[200px_1fr] gap-6 max-w-4xl w-full">
            <PlayerList players = {players} currentPlayerId = {currentPlayerId} />

            <div className="flex flex-col items-center gap-4">
                 <DiscardPile topCard = {topCard} deckCount={deckCount} isMyTurn={isMyTurn} onDraw={handleDraw} activeColor={activeColor}/>
                 <TurnIndicator isMyTurn = {isMyTurn} canPlayAny = {canPlayAny} onDraw={handleDraw}/>
                 {errorMsg && <p className="text-sm font-semibold text-red-200">{errorMsg}</p>}

            </div>

            <div className="col-span-2">
                <h3 className="text-center text-slate-300 font-semibold mb-1">
                    Your Hand ({yourHand.length})
                </h3>
                <Hand hand = {yourHand} isMyTurn = {isMyTurn} topCard={topCard} activeColor={activeColor}/>
            </div>
            {winnerId && (
                 <GameOverModal winnerId={winnerId} players={players} onPlayAgain={onPlayAgain}/>
            )}
         </div>
    )
}
