/* eslint-disable @next/next/no-img-element */
"use client"

import React from "react";
import Image from "next/image";

const GameFooter = ({
  onMeld,
  onDiscard,
  onSapaw,
  onCallDraw,
  isPlayerTurn,
  gameEnded,
  hasDrawnThisTurn,
  selectedIndices,
  selectedSapawTarget,
  onAutoSort,
  onShuffle
}) => {
  const [scale, setScale] = React.useState(1);

  const animateClick = () => {
    setScale(0.99);
    setTimeout(() => setScale(1), 300);
  };

  return (
    <div className="px-16 2xl:px-36 flex w-screen items-center gap-11 h-32 absolute bottom-0 sm:mb-[-26px] 2xl:mb-[20px] left-0 justify-between">
      <div className="space-x-3 sm:w-[400px] 2xl:w-[780px] ">
        <button
          onClick={onMeld}
          disabled={!isPlayerTurn || selectedIndices.length < 3 || !hasDrawnThisTurn || gameEnded}
        >
          <img
            onClick={animateClick}
            src="/image/dropButton.svg"
            alt="Meld"
            className="w-[115px] sm:w-[36px] sm:h-[26px]  2xl:w-[180px] 2xl:h-[80px] h-full"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity: (!isPlayerTurn || selectedIndices.length < 3 || !hasDrawnThisTurn || gameEnded) ? 0.5 : 1
            }}
          />
        </button>
        <button
          onClick={onDiscard}
          disabled={!isPlayerTurn || selectedIndices.length !== 1 || !hasDrawnThisTurn || gameEnded}
        >
          <img
            onClick={animateClick}
            src="/image/dumpButton.svg"
            alt="Discard"
            className="w-[115px] sm:w-[36px] sm:h-[26px]  2xl:w-[180px] 2xl:h-[80px] h-full"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity: (!isPlayerTurn || selectedIndices.length !== 1 || !hasDrawnThisTurn || gameEnded) ? 0.5 : 1
            }}
          />
        </button>
        <button
          onClick={onSapaw}
          disabled={!isPlayerTurn || !selectedSapawTarget || selectedIndices.length === 0 || !hasDrawnThisTurn || gameEnded}
        >
          <img
            src="/image/sapawButton.svg"
            alt="Sapaw"
            className="w-[115px] sm:w-[36px] sm:h-[26px]  2xl:w-[180px] 2xl:h-[80px] h-full"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity: (!isPlayerTurn || !selectedSapawTarget || selectedIndices.length === 0 || !hasDrawnThisTurn || gameEnded) ? 0.5 : 1
            }}
          />
        </button>
        <button
          onClick={onCallDraw}
          disabled={!isPlayerTurn || selectedIndices.length < 3 || !hasDrawnThisTurn || gameEnded}
        >
          <img
            onClick={animateClick}
            src="/image/fightButton.svg"
            alt="Call Draw"
            className="w-[115px] sm:w-[36px] sm:h-[26px] 2xl:w-[180px] 2xl:h-[80px] h-full"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity: (!isPlayerTurn || selectedIndices.length < 3 || !hasDrawnThisTurn || gameEnded) ? 0.5 : 1
            }}
          />
        </button>
      </div>
      <div className="h-full flex gap-1 justify-center items-center">
        <button onClick={onAutoSort}>
          <img
            onClick={animateClick}
            src="/image/auoSort.svg"
            alt="Auto Sort"
            className="w-32 h-32 sm:w-[36px] sm:h-[36px] 2xl:w-[100px] 2xl:h-[100px]"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out"
            }}
          />
        </button>
        <button onClick={onShuffle}>
          <img
            onClick={animateClick}
            src="/image/shuffleButton.svg"
            alt="Shuffle"
            className="w-32 h-32 sm:w-[36px] sm:h-[36px] 2xl:w-[100px] 2xl:h-[100px]"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out"
            }}
          />
        </button>
        <button>
          <img
            onClick={animateClick}
            src="/image/withdrawButton.svg"
            alt="Withdraw"
            className="w-36 h-32 sm:w-[56px] sm:h-[56px] 2xl:w-[180px] 2xl:h-[80px] "
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out"
            }}
          />
        </button>
        <button>
          <img
            onClick={animateClick}
            src="/image/depositButton.svg"
            alt="Deposit"
            className="w-36 h-32 sm:w-[56px] sm:h-[56px] 2xl:w-[180px] 2xl:h-[80px]"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out"
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default GameFooter;

