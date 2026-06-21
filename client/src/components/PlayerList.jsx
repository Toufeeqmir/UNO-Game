import { socket } from "../socket";

export default function PlayerList({ players, currentPlayerId }) {
  return (
    <div className="bg-white/10 rounded-xl p-4 w-48">
      <h3 className="text-sm text-slate-300 mb-2 font-semibold">Players</h3>
      <ul className="space-y-1">
        {players.map((p) => {
          const isTurn = p.id === currentPlayerId;
          const isMe = p.id === socket.id;
          return (
            <li
              key={p.id}
              className={`flex justify-between text-sm px-2 py-1 rounded ${
                isTurn ? "bg-yellow-400/20 font-semibold" : ""
              }`}
            >
              <span>
                {isMe ? "You" : p.name} {isTurn && "🎯"}
              </span>
              <span className="text-slate-400">{p.cardCount}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}