export default function TurnIndicator({ isMyTurn, canPlayAny, onDraw }) {
  if (!isMyTurn) {
    return (
      <div className="bg-white/10 text-slate-300 px-5 py-2 rounded-lg font-medium">
        Waiting for other player...
      </div>
    );
  }

  return (
    <div className="bg-green-500/20 px-5 py-2 rounded-lg font-semibold flex items-center gap-3">
      <span>Your turn!</span>
      {!canPlayAny && (
        <button
          onClick={onDraw}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1 rounded-md font-semibold"
        >
          No valid card — Draw
        </button>
      )}
    </div>
  );
}
