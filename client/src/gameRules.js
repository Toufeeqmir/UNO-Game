//Mirrors server/src/check/deck.js canplaycard - used only to grey out
// illegal cards in the UI. server independently re-validates every move

export function canPlayCard(card, topCard, activeColor) {
  if (card.type === "wild") return true;
  if (!topCard) return true;
  if (card.color === activeColor) return true;

  return card.type === topCard.type && card.value === topCard.value;
}
