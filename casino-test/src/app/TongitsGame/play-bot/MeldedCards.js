import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./Card";
import { Player } from "../../../hooks/use-tongit-game";
import { Card as CardType } from "../../../utils/card-utils";
import PlayerIcon from "@/app/components/PlayerIcon";

export function MeldedCards({
  contextText,
  gameState,
  socket,
  players,
  onSapawSelect,
  currentPlayerIndex,
  selectedSapawTarget,
}) {
  const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const sortCardsByRank = (cards) => {
    return cards.sort((a, b) => {
      const rankA = rankOrder.indexOf(a.rank);
      const rankB = rankOrder.indexOf(b.rank);
      return rankA - rankB;
    });
  };

  const sortMelds = (melds) => {
    return melds.map((meld) => sortCardsByRank(meld));
  };

  // SAPAW Action: Apply SAPAW by adjusting card ranks and sorting after
  const applySapaw = (melds, sapawCard) => {
    if (!melds || !sapawCard) return melds;
    
    const newMelds = melds.map(meld => {
      if (!meld) return [];
      // Find the card to apply SAPAW action
      const sapawIndex = meld.findIndex(card => card.rank === sapawCard.rank);
      if (sapawIndex !== -1) {
        const newMeld = [...meld];
        newMeld[sapawIndex] = { ...meld[sapawIndex], rank: sapawCard.rank };
        return newMeld;
      }
      return meld;
    });

    // Sort the melds after the SAPAW
    return sortMelds(newMelds);
  };

  // Determine the current player's index based on socket.id
  const currentPlayerPOV = useMemo(() => {
    return players.findIndex(player => player.id === socket);
  }, [players, socket]);

  // Function to calculate relative player index
  const getRelativePlayerIndex = (absoluteIndex) => {
    return (absoluteIndex - currentPlayerPOV + players.length) % players.length;
  };

  // Function to get positioning class based on relative index
  const getPositioningClass = (relativeIndex) => {
    switch (relativeIndex) {
      case 0:
        return "bottom-64 left-96 right-96 -translate-x-1/2 z-10 sm:w-[185px] sm:h-[50px] sm:top-[240px] sm:left-[150px] md:w-[245px] md:h-[70px] md:top-[270px] md:left-[230px] lg:w-[320px] lg:h-[90px] lg:top-[550px] lg:left-[210px] xl:w-[520px] xl:h-[190px] xl:top-[550px] xl:left-[560px] 2xl:w-[] 2xl:h-[] 2xl:top-[] 2xl:ml-[]  bg-blue-500  "; //border-2 border-blue-500 bottom "
      case 1:
        return "top-44  right-64  z-10 p-10 bg-black sm:top-10  sm:w-[170px] sm:right-[100px] md:w-[220px]  md:top md:right-[200px] lg:top-[160px] lg:right-[240px] xl:top-48 xl:right-[430px] xl:w-[380px]";//border-2 border-yellow-500 left 
      case 2:
        return "top-44  left-72 z-10 pl-3 sm:w-[170px] sm:h-[100px] sm:top-[75px] sm:left-[85px]  bg-red-500 md:w-[220px] md:h-[150px] md:top-[90px] md:ml-[85px] lg:w-[360px] lg:h-[150px] lg:top-[180px] lg:left-[60px]   xl:w-[440px] xl:h-[250px] xl:top-[230px] xl:left-[310px] 2xl:w-[] 2xl:h-[] 2xl:top-[] 2xl:ml-[] "; //border-2 border-red-500 right 
      default:
        return "";
    }
  };

  // Function to get PlayerIcon positioning
  const getPlayerIconPositioning = (relativeIndex) => {
    switch (relativeIndex) {
      case 0:
        return "hidden";
      case 1:
        return "top-36 2xl:top-52 right-14 sm:right-[50px] md:right-[60px] 2xl:right-32 z-20 ";
      case 2:
        return "top-36 2xl:top-48 left-14 sm:left-[50px] md:left-[80px] md:top-[180px] 2xl:left-32 z-20";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none" key={socket}>
      {players.map((player, absoluteIndex) => {
        const relativeIndex = getRelativePlayerIndex(absoluteIndex);
        const sortedMelds = selectedSapawTarget 
          ? applySapaw(player.exposedMelds, selectedSapawTarget) 
          : sortMelds(player.exposedMelds);
        
        const isCurrentPlayer = absoluteIndex === currentPlayerIndex;
        
        return (
          <div key={player.id}>
            <PlayerIcon
              playerIndex={absoluteIndex}
              players={players}
              positioning={getPlayerIconPositioning(relativeIndex)}
              currentPlayerPOV={socket?.id}
            />
            <div
              className={`
              absolute pointer-events-auto w-80
              ${getPositioningClass(relativeIndex)}
            `}
            >
              <div className={`bg-opacity-0  bg-white absolute   ${relativeIndex === 0 ? "w-[350px]  flex justify-start p-3 =" : ""} rounded-lg`}>
                <AnimatePresence>
                  {sortedMelds?.map((meld, meldIndex) => (
                    <motion.div
                      key={meldIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale:
                          selectedSapawTarget?.playerIndex === absoluteIndex &&
                          selectedSapawTarget?.meldIndex === meldIndex
                            ? 1.05
                            : 1,
                      }} // 
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-lg first-line: ${
                        selectedSapawTarget?.playerIndex === absoluteIndex &&
                        selectedSapawTarget?.meldIndex === meldIndex
                          ? "bg-black bg-opacity-30 flex h-auto justify-start"
                          : "flex justify-start h-auto"
                      }`}
                      onClick={() => onSapawSelect({ playerIndex: absoluteIndex, meldIndex })}
                    >
                      <div className="flex flex-row flex-wrap">
                        {meld?.map((card, cardIndex) => (
                          <motion.div
                            key={cardIndex}
                            initial={{ scale: 0 }}
                            animate={{
                              scale: 1,
                              x: cardIndex * -20,
                            }}
                            transition={{ delay: cardIndex * 0.1 }}
                            className="transform scale-75 origin-top-left cursor-pointer rounded-md"
                          >
                            <Card
                              contextText={contextText}
                              border={`1px solid black`}
                              transformCard={`perspective(500px) rotateX(40deg)`}
                              cardSize={"w-14 h-auto  text-xl 2xl:text-lg"}
                              card={card}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    
  );
}

