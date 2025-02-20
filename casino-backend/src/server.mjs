

// ! DO NOT TOUCH ANYTHING THIS IS THE SERVER FOR THE BACKEND
// NOTE ASK FIRST THE DEVS BEFORE TO TOUCH THIS
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  createDeck,
  dealCards,
  isValidMeld,
  calculateCardPoints,
  calculateHandPoints,
  canFormMeldWithCard,
  sortCards,
  shuffleDeck,
} from "./utils/card-utils.mjs";

const app = express();
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e8,
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

const games = new Map();
const PLAYERS_REQUIRED = 3;

// note sanitize the Game State
function sanitizeGameState(game) {
  return {
    drawnCard: game.drawnCard,
    drawnCardVisible: game.drawnCardVisible,
    id: game.id,
    players: game.players.map((player) => ({
      id: player.id,
      name: player.name,
      playerNumber: player.playerNumber,
      hand: player.hand,
      exposedMelds: player.exposedMelds,
      secretMelds: player.secretMelds,
      score: player.score,
      consecutiveWins: player.consecutiveWins,
      isSapawed: player.isSapawed,
      points: player.points,
      turnsPlayed: player.turnsPlayed,
      groupCards: player.groupCards,
      isBot: player.isBot,
      // Add this flag to identify if the player is the fight initiator
      isFightInitiator:
        game.fightInitiator !== null &&
        game.fightInitiator === game.players.indexOf(player),
    })),
    deck: game.deck,
    deckEmpty: game.deckEmpty,
    discardPile: game.discardPile,
    currentPlayerIndex: game.currentPlayerIndex,
    hasDrawnThisTurn: game.hasDrawnThisTurn,
    round: game.round,
    entryFee: game.entryFee,
    gameEnded: game.gameEnded,
    selectedCardIndices: game.selectedCardIndices,
    gameStarted: game.gameStarted,
    firstPlayerHasPlayed: game.firstPlayerHasPlayed,
    lastAction: game.lastAction,
    fightInitiator: game.fightInitiator,
    fightResponses: game.fightResponses,
    challengeInitiator: game.challengeInitiator,
    challengeTarget: game.challengeTarget,
    challengeResponses: game.challengeResponses,
    hasWinner: game.hasWinner,
    winner: game.winner
      ? {
          id: game.winner.id,
          name: game.winner.name,
        }
      : null,
  };
}

// note connection to the socket
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("join-game", (playerName) => {
    let game = Array.from(games.values()).find(
      (g) => g.players.length < PLAYERS_REQUIRED
    );

    if (!game) {
      game = {
        id: Date.now().toString(),
        players: [],
        deck: [],
        deckEmpty: false,
        discardPile: [],
        currentPlayerIndex: 0,
        hasDrawnThisTurn: false,
        round: 1,
        entryFee: 500,
        gameEnded: false,
        selectedCardIndices: [],
        gameStarted: false,
        firstPlayerHasPlayed: false,
        lastAction: null,
        fightInitiator: null,
        fightResponses: [],
        challengeInitiator: null,
        challengeTarget: null,
        challengeResponses: [],
        fightTimeout: null,
        hasWinner: false,
      };
      games.set(game.id, game);
    }

    const playerNumber = game.players.length + 1;

    game.players.push({
      id: socket.id,
      name: playerName,
      playerNumber,
      hand: [],
      exposedMelds: [],
      secretMelds: [],
      groupCards: [],
      score: 0,
      consecutiveWins: 0,
      isSapawed: false,
      points: 0,
      turnsPlayed: 0,
      isBot: false,
    });

    socket.join(game.id);

    io.to(game.id).emit("player-joined", {
      playerName,
      playerNumber,
      playersCount: game.players.length,
    });

    io.to(game.id).emit("game-state", sanitizeGameState(game));

    if (game.players.length === PLAYERS_REQUIRED && !game.gameStarted) {
      game.gameStarted = true;
      setTimeout(() => startGame(game), 1000);
    }
  });

  socket.on("audio_stream", (audioData) => {
    if (audioData && audioData.audio && Array.isArray(audioData.audio)) {
      // Forward the Float32Array data to other clients in the room
      socket.to(audioData.room).emit("audio_stream", audioData.audio)
      console.log("Audio data received:", audioData)
    } else {
      console.error("Invalid audio data received:", audioData)
    }
  })

  socket.on("player-action", (action) => {
    const game = Array.from(games.values()).find((g) =>
      g.players.some((p) => p.id === socket.id)
    );

    if (!game) return;

    const playerIndex = game.players.findIndex((p) => p.id === socket.id);
    
    if (action.type === "autoSort") {
      handleAutoSort(game, playerIndex, socket.id);
    } else if(action.type === "group"){
      groupCardsSelected(game, playerIndex, action.cardIndices);
    }else if (action.type === "shuffle") {
      handleShuffle(game, action.playerIndices, socket.id);
    } else if (
      playerIndex === game.currentPlayerIndex ||
      ["fight-response", "challenge-response"].includes(action.type)
    ) {
      handlePlayerAction(game, action, playerIndex);
  
      if (!game.gameEnded && game.players[game.currentPlayerIndex].isBot) {
        setTimeout(() => botTurn(game), 1000);
      }
    } else {
      return;
    }
  
    io.to(game.id).emit("game-state", sanitizeGameState(game));
  });

  socket.on("sapaw", (data) => {
    
    const { playerId } = data;
    
    const game = Array.from(games.values()).find((g) =>
      g.players.some((p) => p.id === playerId)
    );
  
    if (!game) {
      return;
    }
  
    const playerIndex = game.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) {

      return;
    }
  
    const updatedPlayers = [...game.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      isSapawed: false
    };
  
    const updatedGame = {...game, players: updatedPlayers};

    io.to(game.id).emit("game-state", sanitizeGameState(updatedGame));
  
    // Update the game in your games collection
    games.set(game.id, updatedGame);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", {
      message: data.message,
      author: data.author,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    for (const [gameId, game] of games) {
      const playerIndex = game.players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        const player = game.players[playerIndex];
        game.players.splice(playerIndex, 1);
        if (game.players.length === 0) {
          games.delete(gameId);
        } else {
          io.to(gameId).emit("player-disconnected", {
            playerName: player.name,
            playerNumber: player.playerNumber,
            playersCount: game.players.length,
          });
          io.to(gameId).emit("game-state", sanitizeGameState(game));
        }
        break;
      }
    }
  });
});

// note start game
function startGame(game) {
  if (game.players.length !== PLAYERS_REQUIRED) return;

  game.deck = createDeck();
  const { hands, remainingDeck } = dealCards(game.deck, PLAYERS_REQUIRED, 12);
  game.deck = remainingDeck;
  game.discardPile = [];
  game.hasDrawnThisTurn = true;
  game.selectedCardIndices = [];
  game.firstPlayerHasPlayed = false;
  let playername = "";

  game.players.forEach((player, index) => {
    player.hand = hands[index];
    if (player.consecutiveWins === 1 || index === 0) {
      playername = player.name;
      player.hand.push(game.deck.pop());
    }
    player.exposedMelds = [];
    player.score = calculateHandPoints(player.hand);
    player.points = player.hand.reduce((total, card) => total + calculateCardPoints(card), 0);
  });

  game.lastAction = { player: playername, type: "Game Started" };

  io.to(game.id).emit("game-started", sanitizeGameState(game));
  io.to(game.id).emit("game-state", sanitizeGameState(game));

  if (game.players[0].isBot) {
    setTimeout(() => botTurn(game), 1000);
  }
}

// note handle the player action
function handlePlayerAction(game, action, playerIndex) {
  const player = game.players[playerIndex];
  const playerName = player.name;

  const playerWinName = game.players.find((p) => p.consecutiveWins === 1);

  switch (action.type) {
    case "drawShow":
      handleDrawShow(game, action.fromDeck, action.meldIndices);
      game.lastAction = {
        player: playerName,
        type: action.fromDeck ? "drew from deck" : "drew from discard pile",
      };
    break;
    case "group":
      groupCardsSelected(game, playerIndex, action.cardIndices);
    break;
    case "ungroup":
      ungroupCardsSelected(
        game, 
        action.target.playerIndex,
        action.target.groupIndex,
        action.target.group
      );
    break;
    case "draw":
      handleDraw(game, action.fromDeck, action.meldIndices);
      game.lastAction = {
        player: playerName,
        type: action.fromDeck ? "drew from deck" : "drew from discard pile",
      };
      break;
      case "denyDrawnCard":
        handleDenyDrawnCard(game)
        game.lastAction = { player: playerName, type: "denied drawn card" }
        break  
    case "addDrawnCardToHand": // Add this new case
      handleAddDrawnCardToHand(game);
      break;
    case "discard":
      handleDiscard(game, action.cardIndex);
      game.lastAction = { player: playerName, type: "discarded a card" };
      break;
    case "meld":
      handleMeld(game, action.cardIndices);
      game.lastAction = { player: playerName, type: "melded cards" };
      break;
    case "sapaw":
      handleSapaw(
        game,
        action.target.playerIndex,
        action.target.meldIndex,
        action.cardIndices
      );
      game.lastAction = { player: playerName, type: "performed a sapaw" };
      break;
    case "callDraw":
      handleCallDraw(game);
      game.lastAction = { player: playerName, type: "called a draw" };
      break;
    case "updateSelectedIndices":
      game.selectedCardIndices = action.indices;
      break;
    case "autoSort":
      handleAutoSort(game, playerIndex);
      game.lastAction = { player: playerName, type: "sorted their hand" };
      break;
    case "shuffle":
      handleShuffle(game, playerIndex);
      game.lastAction = { player: playerName, type: "shuffled their hand" };
      break;
    case "nextGame":
      handleNextGame(game);
      game.lastAction = {
        player: playerWinName?.name || playerName,
        type: "started a new game",
      };
      break;
    case "resetGame":
      handleResetGame(game);
      game.lastAction = { player: playerName, type: "reset the game" };
      break;
    case "fight":
      handleFight(game, playerIndex);
      game.lastAction = { player: playerName, type: "initiated a fight" };
      break;
    case "fight-response":
      handleFightResponse(game, playerIndex, action.accept);
      game.lastAction = {
        player: playerName,
        type: action.accept ? "accepted the fight" : "declined the fight",
      };
      break;
    case "challenge":
      handleChallenge(game, playerIndex, action.targetIndex);
      game.lastAction = { player: playerName, type: "initiated a challenge" };
      break;
    case "challenge-response":
      handleChallengeResponse(game, playerIndex, action.accept);
      game.lastAction = {
        player: playerName,
        type: action.accept
          ? "accepted the challenge"
          : "declined the challenge",
      };
      break;
  }
}

// note player draw a card
function handleDraw(game, fromDeck, meldIndices = []) {
  if (game.hasDrawnThisTurn) return

  const currentPlayer = game.players[game.currentPlayerIndex]
  let drawnCard

  if (!fromDeck && game.discardPile.length > 0) {
    const topCard = game.discardPile[game.discardPile.length - 1]
    const { canMeld } = canFormMeldWithCard(topCard, currentPlayer.hand)

    if (!canMeld) {
      return
    }

    drawnCard = game.discardPile.pop();

    if (meldIndices.length > 0) {
      const meldCards = [...meldIndices.map(i => currentPlayer.hand[i]), drawnCard];
      if (isValidMeld(meldCards)) {
        meldIndices.sort((a, b) => b - a).forEach(index => {
          currentPlayer.hand.splice(index, 1);
        });
        currentPlayer.exposedMelds.push(meldCards);
        game.selectedCardIndices = [];
        game.hasDrawnThisTurn = true;
        return;
      }
    }
  } else if (game.deck.length > 0) {
    drawnCard = game.deck.pop()
  }

  if(drawnCard){
    currentPlayer.hand.push(drawnCard)
    game.hasDrawnThisTurn = true
  }

  if (game.deck.length === 0) {
    game.deckEmpty = true
  }
  
}

function groupCardsSelected(game, playerIndex, cardIndices) {
  const currentPlayer = game.players[playerIndex];


  const selectedCards = currentPlayer.hand.filter((_, index) => cardIndices.includes(index));
  const { canMeld } = canFormMeldWithCard(selectedCards[0], currentPlayer.hand);

  if (!isValidMeld(selectedCards)) return;

  cardIndices.sort((a, b) => b - a).forEach((index) => {
    currentPlayer.hand.splice(index, 1);
  });

  game.selectedCardIndices = [];

  if (canMeld) {
     // Sort the selected cards before pushing them to groupCards
     const sortedCards = selectedCards.sort((a, b) => a.value - b.value);
     currentPlayer.groupCards.push(sortedCards);  // Push the selected cards as a new group
  }
}

function ungroupCardsSelected(game, playerIndex, groupIndex, group) {

  const currentPlayer = game.players[playerIndex];

  // Add selected cards to player's hand
  group.forEach((card) => currentPlayer.hand.push(card));

  // Remove the selected cards from the group by comparing card IDs
  currentPlayer.groupCards[groupIndex] = currentPlayer.groupCards[groupIndex]
    .filter(card => !group.some(selectedCard => selectedCard.id === card.id));
    if (currentPlayer.groupCards[groupIndex].length === 0) {
      currentPlayer.groupCards.splice(groupIndex, 1);
    }
}

function handleDrawShow(game, fromDeck, meldIndices = []) {
  if (game.hasDrawnThisTurn) return

  const currentPlayer = game.players[game.currentPlayerIndex]
  let drawnCard

  if (!fromDeck && game.discardPile.length > 0) {
    const topCard = game.discardPile[game.discardPile.length - 1]
    const { canMeld } = canFormMeldWithCard(topCard, currentPlayer.hand)

    if (!canMeld) {
      return
    }

    drawnCard = game.discardPile.pop()

        if (meldIndices.length > 0) {
      const meldCards = [...meldIndices.map(i => currentPlayer.hand[i]), drawnCard];
      if (isValidMeld(meldCards)) {
        meldIndices.sort((a, b) => b - a).forEach(index => {
          currentPlayer.hand.splice(index, 1);
        });
        currentPlayer.exposedMelds.push(meldCards);
        game.selectedCardIndices = [];
        game.hasDrawnThisTurn = true;
        return;
      }
    }
  } else if (game.deck.length > 0) {
    drawnCard = game.deck.pop()
  }

  if (drawnCard) {
    // Instead of immediately adding to hand, set it as the drawn card
    game.drawnCard = drawnCard
    game.drawnCardVisible = true
    game.hasDrawnThisTurn = true
  } 

  if (game.deck.length === 0) {
    game.deckEmpty = true
  }
  
}

// Add new function to handle adding drawn card to hand
function handleAddDrawnCardToHand(game) {
  if (!game.drawnCard) return

  const currentPlayer = game.players[game.currentPlayerIndex]
  currentPlayer.hand.push(game.drawnCard)
  currentPlayer.points = currentPlayer.hand.reduce((total, card) => total + calculateCardPoints(card), 0);
  currentPlayer.score = calculateHandPoints(currentPlayer.hand)
  console.log("currentPlayer.points",currentPlayer.points)
  game.drawnCard = null
  game.drawnCardVisible = false
}

// note player discard a card
function handleDiscard(game, cardIndex) {
  const currentPlayer = game.players[game.currentPlayerIndex];

  if (!game.hasDrawnThisTurn || cardIndex >= currentPlayer.hand.length) {
    return;
  }

  const discardedCard = currentPlayer.hand.splice(cardIndex, 1)[0];
  game.discardPile.push(discardedCard);
  currentPlayer.points = currentPlayer.hand.reduce((total, card) => total + calculateCardPoints(card), 0);
  currentPlayer.score = calculateHandPoints(currentPlayer.hand);
  game.hasDrawnThisTurn = false;

  if (game.deckEmpty || currentPlayer.points === 0) {
    handleCallDraw(game);
    return;
  }

  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
}

// note player call a draw
function handleCallDraw(game) {
  const scores = game.players.map((player) => ({
    id: player.id,
    score: calculateHandPoints(player.hand),
  }));

  const winner = scores.reduce((min, player) =>
    player.score < min.score ? player : min
  );

  game.players.forEach((player) => {
    player.score = scores.find((s) => s.id === player.id).score;
    if (player.id === winner.id) {
      player.consecutiveWins++;
    } else {
      player.consecutiveWins = 0;
    }
  });

  game.winner = game.players.find((p) => p.id === winner.id);
  game.gameEnded = true;
}

// note player do meld
function handleMeld(game, cardIndices) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  const meldedCards = cardIndices.map((index) => currentPlayer.hand[index]);

  if (!isValidMeld(meldedCards)) return;

  currentPlayer.exposedMelds.push(meldedCards);
  cardIndices
    .sort((a, b) => b - a)
    .forEach((index) => {
      currentPlayer.hand.splice(index, 1);
    });
  game.selectedCardIndices = [];

  if (currentPlayer.hand.length === 0) {
    handleTongits(game);
  }
}

// note player do a sapaw
function handleSapaw(game, targetPlayerIndex, targetMeldIndex, cardIndices) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  const targetPlayer = game.players[targetPlayerIndex];
  const sapawCards = cardIndices.map((index) => currentPlayer.hand[index]);
  const targetMeld = [
    ...targetPlayer.exposedMelds[targetMeldIndex],
    ...sapawCards,
  ];

  if (!isValidMeld(targetMeld)) return;

  targetPlayer.exposedMelds[targetMeldIndex] = targetMeld;
  cardIndices
    .sort((a, b) => b - a)
    .forEach((index) => {
      currentPlayer.hand.splice(index, 1);
    });
  targetPlayer.isSapawed = true;
  game.selectedCardIndices = [];

  if (currentPlayer.hand.length === 0) {
    handleTongits(game);
  }
}

// note player tongits
function handleTongits(game) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  currentPlayer.score = 0;
  currentPlayer.consecutiveWins++;

  game.players.forEach((player) => {
    if (player.id !== currentPlayer.id) {
      player.score = calculateHandPoints(player.hand);
      player.consecutiveWins = 0;
    }
  });

  game.winner = currentPlayer;
  game.gameEnded = true;
  game.lastAction = { player: currentPlayer.name, type: "Achieved Tongits!" };
}

// note handle auto sort card
export const findMelds = (hand) => {
  const melds = [];
  let remainingCards = [...hand];
  while (true) {
    const meld = findAndRemoveMeld(remainingCards);
    if (!meld) break;
    melds.push(meld);
  }
  return { melds, remainingCards };
};
const findAndRemoveMeld = (cards) => {
  // Check for four-of-a-kind
  const rankMap = {};
  for (const card of cards) {
    if (!rankMap[card.rank]) {
      rankMap[card.rank] = [];
    }
    rankMap[card.rank].push(card);
  }
  for (const rank in rankMap) {
    if (rankMap[rank].length >= 4) {
      // Collect the first four cards of this rank
      const meld = rankMap[rank].slice(0, 4);
      // Find their indices in the original cards array
      const indices = [];
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].rank === rank) {
          indices.push(i);
          if (indices.length === 4) break;
        }
      }
      // Remove them in reverse order to avoid index issues
      indices.sort((a, b) => b - a).forEach(index => {
        cards.splice(index, 1);
      });
      return meld;
    }
  }
  // Check for three-of-a-kind
  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        if (
          cards[i].rank === cards[j].rank &&
          cards[j].rank === cards[k].rank
        ) {
          const meld = [cards[i], cards[j], cards[k]];
          cards.splice(k, 1);
          cards.splice(j, 1);
          cards.splice(i, 1);
          return meld;
        }
      }
    }
  }
  // Check for straight flush
  const sortedCards = [...cards].sort(
    (a, b) => rankToNumber(a.rank) - rankToNumber(b.rank)
  );
  for (let i = 0; i < sortedCards.length - 2; i++) {
    if (
      sortedCards[i].suit === sortedCards[i + 1].suit &&
      sortedCards[i + 1].suit === sortedCards[i + 2].suit &&
      rankToNumber(sortedCards[i + 1].rank) -
        rankToNumber(sortedCards[i].rank) === 1 &&
      rankToNumber(sortedCards[i + 2].rank) -
        rankToNumber(sortedCards[i + 1].rank) === 1
    ) {
      const meld = [sortedCards[i], sortedCards[i + 1], sortedCards[i + 2]];
      cards.splice(cards.indexOf(sortedCards[i + 2]), 1);
      cards.splice(cards.indexOf(sortedCards[i + 1]), 1);
      cards.splice(cards.indexOf(sortedCards[i]), 1);
      return meld;
    }
  }
  return null;
};
const rankToNumber = (rank) => {
  const rankOrder = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  return rankOrder.indexOf(rank);
};

function handleAutoSort(game, playerIndex) {
  const player = game.players[playerIndex];
  const hand = player?.hand;

  // Find all possible melds in the hand
  const melds = [];
  let remainingCards = [...hand];

  while (true) {
    const meld = findAndRemoveMeld(remainingCards);
    if (!meld) break;
    melds.push(meld);
  }

  // Sort the melds and remaining cards
  melds.forEach(meld => meld.sort((a, b) => rankToNumber(a.rank) - rankToNumber(b.rank)));
  remainingCards.sort((a, b) => {
    if (a.suit !== b.suit) {
      return a.suit.localeCompare(b.suit);
    }
    return rankToNumber(a.rank) - rankToNumber(b.rank);
  });

  // Combine melds and remaining cards back into the hand
  player.hand = [...melds.flat(), ...remainingCards];
}


//note player do shuffle
function handleShuffle(game, playerIndices) {
  playerIndices.forEach((playerId) => {
    const playerIndex = game.players.findIndex((p) => p.id === playerId)
    const player = game.players[playerIndex]

    for (let i = player.hand.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [player.hand[i], player.hand[j]] = [player.hand[j], player.hand[i]];
    }
  })
}

// note next game if the game end
function handleNextGame(game) {
  const preservedConsecutiveWins = game.players.map(
    (player) => player.consecutiveWins || 0
  );
  const winnerIndex = preservedConsecutiveWins.indexOf(
    Math.max(...preservedConsecutiveWins)
  );

  game.round++;
  game.deck = createDeck();
  const { hands, remainingDeck } = dealCards(game.deck, PLAYERS_REQUIRED, 12);
  game.deck = remainingDeck;
  game.deckEmpty = false;
  game.discardPile = [];
  game.currentPlayerIndex = winnerIndex;
  game.hasDrawnThisTurn = true;
  game.gameEnded = false;
  game.selectedCardIndices = [];
  game.firstPlayerHasPlayed = false;
  game.fightInitiator = null;
  game.fightResponses = [];
  game.challengeInitiator = null;
  game.challengeTarget = null;
  game.challengeResponses = [];

  game.players = game.players.map((player, index) => ({
    ...player,
    hand: hands[index],
    exposedMelds: [],
    secretMelds: [],
    groupCards: [],
    score: 0,
    consecutiveWins: preservedConsecutiveWins[index],
    isSapawed: false,
    points: 0,
    turnsPlayed: 0,
  }));

  game.players[winnerIndex].hand.push(game.deck.pop());
  game.lastAction = {
    player: game.players[winnerIndex].name,
    type: "Next Game started",
  };

  io.to(game.id).emit("game-state", sanitizeGameState(game));

  if (game.players[winnerIndex].isBot) {
    setTimeout(() => botTurn(game), 1000);
  }
}

// note reset Game if the game already end
function handleResetGame(game) {
  game.round = 1;
  game.deck = createDeck();
  const { hands, remainingDeck } = dealCards(game.deck, PLAYERS_REQUIRED, 12);
  game.deck = remainingDeck;
  game.deckEmpty = false;
  game.discardPile = [];
  game.currentPlayerIndex = 0;
  game.hasDrawnThisTurn = false; // Changed to false so first player can draw
  game.gameEnded = false;
  game.selectedCardIndices = [];
  game.firstPlayerHasPlayed = false;
  game.fightInitiator = null;
  game.fightResponses = [];
  game.challengeInitiator = null;
  game.challengeTarget = null;
  game.challengeResponses = [];
  game.gameStarted = true; // Add this to ensure game is marked as started

  // Reset player states
  game.players = game.players.map((player, index) => ({
    ...player,
    hand: hands[index],
    exposedMelds: [],
    secretMelds: [],
    groupChat: [],
    groupCards: [],
    score: 0,
    consecutiveWins: 0,
    isSapawed: false,
    points: 0,
    turnsPlayed: 0,
  }));

  // Give first player an extra card
  game.players[0].hand.push(game.deck.pop());
  game.lastAction = { player: game.players[0].name, type: "Game Reset" };

  // Emit reset event first
  io.to(game.id).emit("game-reset", {
    newGameId: game.id,
    message: "The game has been reset.",
  });

  // Start the game after a short delay
  setTimeout(() => {
    io.to(game.id).emit("game-started", sanitizeGameState(game));
    io.to(game.id).emit("game-state", sanitizeGameState(game));
  }, 1000);

  console.log("Game Reset");
}

// note player do fight
function handleFight(game, playerIndex) {
  if (game.fightInitiator !== null) return;

  game.fightInitiator = playerIndex;
  game.fightResponses = [];

  io.to(game.id).emit("fight-initiated", {
    initiator: game.players[playerIndex].name,
    initiatorIndex: playerIndex, // Add this to help identify the initiator
  });

  game.fightTimeout = setTimeout(() => handleFightTimeout(game), 30000);
}

// note player do fight responsive either draw or fight
function handleFightResponse(game, playerIndex, accept) {
  if (game.fightInitiator === null || playerIndex === game.fightInitiator)
    return;

  game.fightResponses.push({ playerIndex, accept });

  io.to(game.id).emit("fight-response-received", {
    responder: game.players[playerIndex].name,
    accepted: accept,
  });

  if (game.fightResponses.length === game.players.length - 1) {
    clearTimeout(game.fightTimeout);
    resolveFight(game);
  }
}

// note resolve fight
function resolveFight(game) {
  // Count how many players accepted
  const acceptedResponses = game.fightResponses.filter(
    (response) => response.accept
  );
  const declinedResponses = game.fightResponses.filter(
    (response) => !response.accept
  );

  // Calculate scores for all players
  const playerScores = game.players.map((player, index) => ({
    playerIndex: index,
    name: player.name,
    score: calculateHandPoints(player.hand),
  }));

  // If no one accepted, initiator wins automatically
  if (acceptedResponses.length === 0) {
    // Set scores for all players
    game.players.forEach((player, index) => {
      player.score = playerScores[index].score;
      if (index === game.fightInitiator) {
        player.consecutiveWins++;
      } else {
        player.consecutiveWins = 0;
      }
    });

    game.winner = game.players[game.fightInitiator];
    game.gameEnded = true;

    // Create score summary
    const scoreMessage = game.players
      .map((player) => `${player.name}: ${player.score}`)
      .join(", ");

    game.lastAction = {
      player: game.players[game.fightInitiator]?.name,
      type: `Won the fight by default! All players declined. (Scores: ${scoreMessage})`,
    };
  }
  // If at least one player accepted and one declined
  else if (acceptedResponses.length > 0 && declinedResponses.length > 0) {
    // Players who declined automatically lose
    declinedResponses.forEach((response) => {
      const player = game.players[response.playerIndex];
      player.consecutiveWins = 0;
      player.score = playerScores[response.playerIndex].score;
    });

    // Compare scores between initiator and accepting players only
    const playersToCompare = [
      game.fightInitiator,
      ...acceptedResponses.map((r) => r.playerIndex),
    ];

    const scores = playersToCompare.map((playerIndex) => ({
      playerIndex,
      score: playerScores[playerIndex].score,
    }));

    const winner = scores.reduce((min, player) =>
      player.score < min.score ? player : min
    );

    // Update consecutive wins and scores
    game.players.forEach((player, index) => {
      player.score = playerScores[index].score;
      if (index === winner.playerIndex) {
        player.consecutiveWins++;
      } else if (playersToCompare.includes(index)) {
        player.consecutiveWins = 0;
      }
    });

    game.winner = game.players[winner.playerIndex];
    game.gameEnded = true;

    // Create score summary
    const scoreMessage = game.players
      .map((player) => `${player.name}: ${player.score}`)
      .join(", ");

    game.lastAction = {
      player: game.players[game.fightInitiator]?.name,
      type: `Fight resolved - ${
        game.players[winner.playerIndex].name
      } won! (Scores: ${scoreMessage})`,
    };
  }
  // If all players accepted
  else if (acceptedResponses.length === game.players.length - 1) {
    // All players accepted - compare all scores
    const winner = playerScores.reduce((min, player) =>
      player.score < min.score ? player : min
    );

    // Update scores and consecutive wins
    game.players.forEach((player, index) => {
      player.score = playerScores[index].score;
      if (index === winner.playerIndex) {
        player.consecutiveWins++;
      } else {
        player.consecutiveWins = 0;
      }
    });

    game.winner = game.players[winner.playerIndex];
    game.gameEnded = true;

    // Create score summary
    const scoreMessage = game.players
      .map((player) => `${player.name}: ${player.score}`)
      .join(", ");

    game.lastAction = {
      player: game.players[game.fightInitiator]?.name,
      type: `Won the fight! (Scores: ${scoreMessage})`,
    };
  }

  game.fightInitiator = null;
  game.fightResponses = [];

  // Include scores in the fight-resolved event
  io.to(game.id).emit("fight-resolved", {
    winner: game.winner ? game.winner.name : null,
    scores: game.players.map((player) => ({
      name: player.name,
      score: player.score,
    })),
  });
}

// note player challenge the fight
function handleChallenge(game, playerIndex, targetIndex) {
  if (game.challengeInitiator !== null || playerIndex === targetIndex) return;

  game.challengeInitiator = playerIndex;
  game.challengeTarget = targetIndex;
  game.challengeResponses = [];

  io.to(game.id).emit("challenge-initiated", {
    initiator: game.players[playerIndex].name,
    target: game.players[targetIndex].name,
  });
}

// note player challenge the fight
function handleChallengeResponse(game, playerIndex, accept) {
  if (game.challengeInitiator === null || playerIndex !== game.challengeTarget)
    return;

  if (accept) {
    resolveChallenge(game);
  } else {
    game.lastAction = {
      player: game.players[playerIndex].name,
      type: "Declined the challenge",
    };
    game.challengeInitiator = null;
    game.challengeTarget = null;
  }
}

// note resolve the challenege
function resolveChallenge(game) {
  const initiatorScore = calculateHandPoints(
    game.players[game.challengeInitiator].hand
  );
  const targetScore = calculateHandPoints(
    game.players[game.challengeTarget].hand
  );

  if (initiatorScore < targetScore) {
    game.lastAction = {
      player: game.players[game.challengeInitiator].name,
      type: "Won the challenge",
    };
    game.players[game.challengeInitiator].consecutiveWins++;
    game.players[game.challengeTarget].consecutiveWins = 0;
  } else {
    game.lastAction = {
      player: game.players[game.challengeTarget].name,
      type: "Won the challenge",
    };
    game.players[game.challengeTarget].consecutiveWins++;
    game.players[game.challengeInitiator].consecutiveWins = 0;
  }

  game.challengeInitiator = null;
  game.challengeTarget = null;

  io.to(game.id).emit("challenge-resolved", {
    winner:
      initiatorScore < targetScore
        ? game.players[game.challengeInitiator].name
        : game.players[game.challengeTarget].name,
  });
}

// note player do a fight
function handleFightTimeout(game) {
  if (game.fightInitiator === null) return;

  const nonRespondingPlayers = game.players.filter(
    (_, index) =>
      index !== game.fightInitiator &&
      !game.fightResponses.some((r) => r.playerIndex === index)
  );

  nonRespondingPlayers.forEach((player) => {
    game.fightResponses.push({
      playerIndex: game.players.indexOf(player),
      accept: false,
    });
  });

  resolveFight(game);
}

function botTurn(game) {
  // Bot logic implementation would go here
  console.log("Bot turn - not implemented");
}

function handleDenyDrawnCard(game) {
  const currentPlayer = game.players[game.currentPlayerIndex]
  if (game.drawnCard) {
    game.discardPile.push(game.drawnCard)
    game.drawnCard = null
    game.drawnCardVisible = false
    game.hasDrawnThisTurn = false


    if (game.deckEmpty) {
      handleCallDraw(game);
      return;
    }
    // Move to the next player
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length
  }
}

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
