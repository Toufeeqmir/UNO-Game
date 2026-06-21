import { useGameState } from "./hooks/useGameState";
import Lobby from "./components/Lobby";
import GameRoom from "./components/GameRoom";

export default function App() {
  const { gameState, roomCode, errorMsg } = useGameState();

   const inActiveGame = roomCode && (gameState?.started || gameState?.winnerId);

  function handlePlayAgain() {
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-5">
      {inActiveGame ? (
        <GameRoom gameState={gameState} errorMsg={errorMsg} onPlayAgain={handlePlayAgain} />
      ) : (
        <Lobby roomCode={roomCode} gameState={gameState} errorMsg={errorMsg} />
      )}
    </div>
  );
}
