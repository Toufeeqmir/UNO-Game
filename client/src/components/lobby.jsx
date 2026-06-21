import { useState } from "react";
import { socket } from "../socket";

export default function Lobby({ roomCode, gameState, errorMsg }) {
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  function handleCreate() {
    if (!name.trim()) return;
    socket.emit("createRoom", name.trim());
  }

  function handleJoin() {
    if (!name.trim() || !joinCode.trim()) return;
    socket.emit("joinRoom", { code: joinCode.trim(), name: name.trim() });
  }

  function handleStart() {
    socket.emit("startGame");
  }

  if (!roomCode) {
    return (
      <div className="bg-white text-slate-900 rounded-2xl p-8 w-80 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-red-600 mb-4">UNO Online</h1>
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={12}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-2"
        />
        <button
          onClick={handleCreate}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg mb-3"
        >
          Create Room
        </button>

        <div className="text-slate-400 text-sm mb-3">or</div>

        <input
          placeholder="Room code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          maxLength={4}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-2"
        />
        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          Join Room
        </button>

        {errorMsg && <p className="text-red-600 text-sm mt-3">{errorMsg}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-900 rounded-2xl p-8 w-80 text-center shadow-xl">
      <h2 className="text-xl font-bold mb-1">Room: {roomCode}</h2>
      <p className="text-slate-400 text-sm mb-3">Share this code with friends to join</p>
      <ul className="space-y-1 mb-4">
        {gameState?.players.map((p) => (
          <li key={p.id} className="bg-slate-100 rounded px-3 py-1 text-sm">
            {p.id === socket.id ? `${p.name} (you)` : p.name}
          </li>
        ))}
      </ul>
      <button
        onClick={handleStart}
        disabled={(gameState?.players.length || 0) < 2}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-semibold py-2 rounded-lg"
      >
        Start Game
      </button>
      {(gameState?.players.length || 0) < 2 && (
        <p className="text-slate-400 text-xs mt-2">Need at least 2 players to start</p>
      )}
      {errorMsg && <p className="text-red-600 text-sm mt-3">{errorMsg}</p>}
    </div>
  );
}