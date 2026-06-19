import { buildDeck, shuffle, canPlayCard } from "./check/deck.js";

const HAND_SIZE = 7;

export class Room {
    constructor(code) {
        this.code = code;
        this.players = new Map(); //socketId 
        this.turnOrder = [];
        this.currentTurnIndex = 0;
        this.direction = 1;  // 1 = forward , -1  = reversed 
        this.deck = [];
        this.discardPile = [];
        this.started = false;
        this.winnerId = null;
    }

    addPlayer(socketId, name) {
        this.players.set(socketId, { id: socketId, name, hand: [] });
        if (!this.turnOrder.includes(socketId)) {
            this.turnOrder.push(socketId);
        }
    }
    removePlayer(socketId) {
        this.players.delete(socketId);
        this.turnOrder = this.turnOrder.filter((id) => id !== socketId);
        if (this.currentTurnIndex >= this.turnOrder.length) {
            this.currentTurnIndex = 0;
        }
    }

    get playerCount() {
        return this.players.size;
    }

  

    get currentPlayerId() {
        return this.turnOrder[this.currentTurnIndex];
    }
        canStart(){
             return this.playerCount >= 2 && !this.started;
        }

        startGame(){
            this.deck = buildDeck();
            this.discardPile = [];
            this.currentTurnIndex = 0;
            this.direction = 1;
            this.started = true;
            this.winnerId = null;

            for(const player of this.players.values()){
                player.hand = this.deck.splice(0, HAND_SIZE);
            }
               //removes and returns the last card in the deck , used to start  the discard pile

             const firstCard = this.deck.pop();
             this.discardPile.push(firstCard);
        }
  
        // this.discardPile.length == is the index of the last item in the array 
        getTopCard(){
            return this.discardPile[this.discardPile.length-1] || null;
        }

        isPlayerTurn(socketId){
             return this.currentPlayerId === socketId;
        }

        playCard(socketId, cardId){
            if(!this.isPlayerTurn(socketId)){
                 return { success:  false, reason: "not_your_turn"};
            }

            const player = this.players.get(socketId);
            const cardIndex = player.hand.findIndex((c) => c.id === cardId);
             if(cardIndex === -1){
                 return { success: false, reason: 'card_not_in_hand'};
             }

             const card = player.hand[cardIndex];
             const topCard = this.getTopCard();

             if(!canPlayCard(card, topCard)){
                 return { success: false, reason: "invalid_move"};
             }
          
             //remove card from hand, add to discard pile 
         player.hand.splice(cardIndex, 1);

         this.discardPile.push(card);

         //win check - if hand is empty, the player won
         if(player.hand.length === 0){
            this.winnerId = socketId;
            this.started = false;
            return { success: true , gameOver: true};
         }

          //apply card effect (skip/reverse/draw2) and move to next turn
          this.applyCardEffectAndAdvanceTurn(card);
          return { success: true, gameOver: false};
        }
 
          drawCard(socketId){
             if(!this.isPlayerTurn(socketId)){
                 return { success: false, reason: "not_your_turn"};
             }
              
             if(this.deck.length === 0){
                 this.reshuffleDiscardIntoDeck();


             }
              const player = this.players.get(socketId);
              const card = this.deck.pop();
              if(card) player.hand.push(card);

              this.advanceTurn();
              return { success: true};
          }

          reshuffleDiscardIntoDeck(){
             const top = this.discardPile.pop(); //save the top card
             this.deck = this.discardPile;   // remaining discard -> new deck
             this.discardPile = [top];    // reset discard pile with just  the top 

             //shuffle the new deck
             for(let  i = this.deck.length-1; i > 0; i--){
                const j = Math.floor(Math.random() * (i + 1));
                [this.deck[i], this.deck[j]] = [this.deck[j] , this.deck[i]];
             }       
          }

          advanceTurn(){
                 const len = this.turnOrder.length;
                 this.currentTurnIndex = (this.currentTurnIndex + this.direction + len) % len;
              }


              applyCardEffectAndAdvanceTurn(card){
                if(card.type === "action"){
                    if(card.value === "reverse"){
                        this.direction *= -1;
                        this.advanceTurn();
                        return;
                    }
                    if(card.value === "skip"){
                        //advanceturn twice: to  move the past the current player(normal), once more to skip the next player entirely.
                        this.advanceTurn();
                        this.advanceTurn();
                        return;
                    }

                    if(card.value === "draw2"){
                        this.advanceTurn();
                        const nextPlayerId = this.currentPlayerId;
                        const nextPlayer = this.players.get(nextPlayerId);
                        for(let i = 0; i < 2; i++){
                            if(this.deck.length === 0) this.reshuffleDiscardIntoDeck();
                            const drawn = this.deck.pop();
                            if(drawn) nextPlayer.hand.push(drawn);
                        }
                         this.advanceTurn();
                         return;

                    }
                }

                 this.advanceTurn();
              }

        
    }

  // Test the room.js
    //  const testRoom = new Room("TEST");
    //  testRoom.addPlayer("p1", "Alice");
    //  testRoom.addPlayer("p2", "Bob");
    //  console.log("Can start", testRoom.canStart());
    //  testRoom.startGame();
    //  console.log("Alice's hand size", testRoom.players.get("p1").hand.length);
    //  console.log("Top card:", testRoom.getTopCard());
    //  console.log("Current Player:", testRoom.currentPlayerId);





