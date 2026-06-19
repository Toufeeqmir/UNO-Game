export const COLORS = ["red", "yellow", "green", "blue"];
export const ACTIONS = ["skip", "reverse", "draw2"];

export function buildDeck(){
     const deck = [];
     let cardId = 0;

     for(const color of COLORS){
         deck.push({ id: `c${cardId}`, color, type: "number", value: 0});

          // this inner loop it pushes two cards each time of that number
          for(let n =1; n <= 9; n++){
             deck.push({id: `c${cardId}`, color, type: "number", value: n});
             deck.push({id: `c${cardId++}`, color, type: "number", value: n});
          }

          for(const action of ACTIONS){
              deck.push({ id: `c${cardId++}`, color, type: "action", value: action});
              deck.push({ id: `c${cardId++}`, color, type: "action", value: action});
          }
         
     }
     return deck;
}
 export function shuffle(array){
     const arr = [...array]; // copy, so we don't mutate the original array
      for(let i = arr.length-1; i > 0; i--){
         const j = Math.floor(Math.random() * (i + 1));
         [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;

 }

 export function canPlayCard(card, topCard){
     if(!topCard) return true; // first card of the game, anything is valid
      if(card.color === topCard.color) return true;
      if(card.type === "number" && topCard.type === "number" && card.value === topCard.value){
        return true;
      }
      if(card.type === "action" && topCard.type === "action" && card.value === topCard.value){
        return true;
      }
      return false;
 }
//  console.log(buildDeck().length);