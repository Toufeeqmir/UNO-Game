export const COLORS = ["red", "yellow", "green", "blue"];
export const ACTIONS = ["skip", "reverse", "draw2"];

export function buildDeck() {
  const deck = [];
  let cardId = 0;

  for (const color of COLORS) {
    deck.push({ id: `c${cardId++}`, color, type: "number", value: 0 });

    for (let n = 1; n <= 9; n++) {
      deck.push({ id: `c${cardId++}`, color, type: "number", value: n });
      deck.push({ id: `c${cardId++}`, color, type: "number", value: n });
    }

    for (const action of ACTIONS) {
      deck.push({ id: `c${cardId++}`, color, type: "action", value: action });
      deck.push({ id: `c${cardId++}`, color, type: "action", value: action });
    }
  }

  for (let i = 0; i < 4; i++) {
    deck.push({ id: `c${cardId++}`, color: null, type: "wild", value: "wild" });
  }

  for (let i = 0; i < 4; i++) {
    deck.push({ id: `c${cardId++}`, color: null, type: "wild", value: "wild_draw4" });
  }

  return deck;
}

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function canPlayCard(card, topCard, activeColor = topCard?.color) {
  if (card.type === "wild") return true;
  if (!topCard) return true;
  if (card.color === activeColor) return true;

  return card.type === topCard.type && card.value === topCard.value;
}

