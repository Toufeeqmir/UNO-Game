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
        this.activeColor = null;
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
    canStart() {
        return this.playerCount >= 2 && !this.started;
    }

    startGame() {
        this.deck = shuffle(buildDeck());
        this.discardPile = [];
        this.currentTurnIndex = 0;
        this.direction = 1;
        this.started = true;
        this.winnerId = null;

        for (const player of this.players.values()) {
            player.hand = this.deck.splice(0, HAND_SIZE);
        }
        // Start with a visible colored card so the first turn always has a real match target.
        const firstCardIndex = this.deck.findIndex((card) => card.type !== "wild");
        const [firstCard] = this.deck.splice(firstCardIndex === -1 ? this.deck.length - 1 : firstCardIndex, 1);
        this.discardPile.push(firstCard);

        if (firstCard.type === "wild") {
            const randomColors = ["red", "yellow", "green", "blue"];
            this.activeColor = randomColors[Math.floor(Math.random() * randomColors.length)];
        } else {
            this.activeColor = firstCard.color;
        }
    }

    // this.discardPile.length == is the index of the last item in the array 
    getTopCard() {
        return this.discardPile[this.discardPile.length - 1] || null;
    }

    isPlayerTurn(socketId) {
        return this.currentPlayerId === socketId;
    }

    playCard(socketId, cardId, chosenColor = null) {
        if (!this.isPlayerTurn(socketId)) {
            return { success: false, reason: "not_your_turn" };
        }


        const player = this.players.get(socketId);
        const cardIndex = player.hand.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) {
            return { success: false, reason: 'card_not_in_hand' };
        }

        const card = player.hand[cardIndex];
        const topCard = this.getTopCard();

        if (!canPlayCard(card, topCard, this.activeColor)) {
            return { success: false, reason: "invalid_move" };
        }

        if(card.type === "wild" && !chosenColor){
            return { success: false, reason: "must_choose_color"};
        }
        //remove card from hand, add to discard pile 
        player.hand.splice(cardIndex, 1);

        this.discardPile.push(card);

        //update active color: wild cards use the chosen color , everything else uses its own color
        this.activeColor = card.type === "wild" ? chosenColor : card.color;

        //win check - if hand is empty, the player won
        if (player.hand.length === 0) {
            this.winnerId = socketId;
            this.started = false;
            return { success: true, gameOver: true };
        }

        //apply card effect (skip/reverse/draw2) and move to next turn
        this.applyCardEffectAndAdvanceTurn(card);
        return { success: true, gameOver: false };
    }

    drawCard(socketId) {
        if (!this.isPlayerTurn(socketId)) {
            return { success: false, reason: "not_your_turn" };
        }

        if (this.deck.length === 0) {
            this.reshuffleDiscardIntoDeck();
        }
        if (this.deck.length === 0) {
            return { success: false, reason: "deck_empty" };
        }

        const player = this.players.get(socketId);
        const card = this.deck.pop();
        if (card) player.hand.push(card);

        this.advanceTurn();
        return { success: true };
    }

    reshuffleDiscardIntoDeck() {
        const top = this.discardPile.pop(); //save the top card
        this.deck = this.discardPile;   // remaining discard -> new deck
        this.discardPile = [top];    // reset discard pile with just  the top 

        //shuffle the new deck
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    advanceTurn() {
        const len = this.turnOrder.length;
        this.currentTurnIndex = (this.currentTurnIndex + this.direction + len) % len;
    }
    getStateForPlayer(socketId) {
        return {
            code: this.code,
            started: this.started,
            winnerId: this.winnerId,
            topCard: this.getTopCard(),
            activeColor: this.activeColor,
            currentPlayerId: this.currentPlayerId,
            direction: this.direction,
            deckCount: this.deck.length,
            yourHand: this.players.get(socketId)?.hand || [],
            players: Array.from(this.players.values()).map((p) => ({
                id: p.id,
                name: p.name,
                cardCount: p.hand.length,
            })),
        };
    }


    applyCardEffectAndAdvanceTurn(card) {
        if (card.type === "wild" && card.value === "wild_draw4") {
            this.advanceTurn();
            this.drawCardsForPlayer(this.currentPlayerId, 4);
            this.advanceTurn();
            return;
        }

        if (card.type === "action") {
            if (card.value === "reverse") {
                this.direction *= -1;
                this.advanceTurn();
                return;
            }
            if (card.value === "skip") {
                //advanceturn twice: to  move the past the current player(normal), once more to skip the next player entirely.
                this.advanceTurn();
                this.advanceTurn();
                return;
            }

            if (card.value === "draw2") {
                this.advanceTurn();
                this.drawCardsForPlayer(this.currentPlayerId, 2);
                this.advanceTurn();
                return;

            }
        }

        this.advanceTurn();
    }

    drawCardsForPlayer(playerId, count) {
        const player = this.players.get(playerId);
        if (!player) return;

        for (let i = 0; i < count; i++) {
            if (this.deck.length === 0) this.reshuffleDiscardIntoDeck();
            const drawn = this.deck.pop();
            if (drawn) player.hand.push(drawn);
        }
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





