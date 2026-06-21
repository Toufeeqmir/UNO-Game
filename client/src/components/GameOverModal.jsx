import { socket } from "../socket";

export default function GameOverModal({ winnerId, players, onPlayAgain }) {
  const winner = players.find((p) => p.id === winnerId);
  const isMe = winnerId === socket.id;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white text-slate-900 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {isMe ? "🎉 You won!" : `${winner?.name || "A player"} won!`}
        </h2>
        <button
          onClick={onPlayAgain}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg"
        >
          Back to Lobby
        </button>
      </div>
    </div>
  );
}