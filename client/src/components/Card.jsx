import { Ban, Repeat, Plus } from "lucide-react";

const COLOR_CLASSES = {
    red: "bg-red-500",
    yellow: "bg-yellow-400",
    green: "bg-green-500",
    blue: "bg-blue-500",
};

const ACTION_ICONS = {
    skip: Ban,
    reverse: Repeat,
    draw2: Plus,
};

export default function Card({ card, onClick, disabled, faceDown, size = "normal" }) {
    const sizeClasses = size === "large" ? "w-20 h-20 text-3xl" : "w-14 h-20 text-xl";
    const iconSize = size === "large" ? 32 : 22;

    if (faceDown) {
        return (
            <div
                className={` ${sizeClasses} rounded-lg border-4 border-white bg-slate-700`}
            >

            </div>
        )
    }
    const isWild = card.type === "wild";
    const isAction = card.type === "action";
    const ActionIcon = isAction ? ACTION_ICONS[card.value] : null;
    const colorClass = isWild ? "bg-slate-950" : COLOR_CLASSES[card.color];
    const label = card.value === "draw2" ? "+2" : card.value === "wild_draw4" ? "+4" : card.type === "wild" ? "WILD" : card.value;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${sizeClasses} ${colorClass} relative overflow-hidden rounded-lg border-4 border-white font-extrabold text-white shadow-md flex items-center justify-center
        transition-transform hover:-translate-y-2 disabled:opacity-40 disabled:hover:-translate-y-0 disabled:cursor-not-allowed`}
        >
            {isWild && (
                <span className="absolute inset-2 grid grid-cols-2 grid-rows-2 rotate-12 rounded-full overflow-hidden opacity-90">
                    <span className="bg-red-500" />
                    <span className="bg-yellow-400" />
                    <span className="bg-blue-500" />
                    <span className="bg-green-500" />
                </span>
            )}
            {card.value === "draw2" ? (
                <span className="relative z-10 drop-shadow">{label}</span>
            ) : card.value === "wild_draw4" ? (
                <span className="relative z-10 drop-shadow">{label}</span>
            ) : isAction ? (
                <ActionIcon size={iconSize} strokeWidth={3} />
            ) : (
                <span className="relative z-10 drop-shadow">{label}</span>
            )}
        </button>
    );
}
