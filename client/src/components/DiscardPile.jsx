import Card from "./Card";

const COLOR_DOT_CLASSES = {
    red: "bg-red-500",
    yellow: "bg-yellow-400",
    green: "bg-green-500",
    blue: "bg-blue-500",
};

export default function DiscardPile({ topCard, deckCount, isMyTurn, onDraw, activeColor }) {
     return(
          <div className="flex items-center gap-6">
            <div className="text-center">
                <button
                    type="button"
                    onClick={onDraw}
                    disabled={!isMyTurn || deckCount === 0}
                    aria-label="Draw card"
                    className="rounded-lg transition-transform hover:-translate-y-1 disabled:hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Card faceDown />
                </button>
                <span className="block text-xs mt-1 text-slate-300">{deckCount} left</span>
            </div>
             
             <div className="text-center">
                  {topCard ? <Card card={topCard} disabled size="large" /> : <p>No card yet</p>}
                  {activeColor && (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-300">
                        <span className={`h-3 w-3 rounded-full ${COLOR_DOT_CLASSES[activeColor]}`} />
                        {activeColor}
                    </span>
                  )}
             </div>
          </div>
           
     );
}
