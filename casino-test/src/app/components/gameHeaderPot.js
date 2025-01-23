import React, { useEffect } from "react";
import Image from "next/image";
import Bet from "./Bet";

function GameHeaderPot({betAmout, gameState,socket }) {
  const userWinner = gameState.players
  .find(p => p.id === socket?.id)?.consecutiveWins;  // Safely calculate consecutive wins

  const round = gameState.round;
  // const potMoney = gameState.potMoney
  return (
    <div className="relative">
      <Image
        src="/image/headerGame.svg"
        width={1000}
        height={1000}
        alt="My image"
        className="w-auto h-36 sm:max-w-[300px] sm:max-h-[60px] md:max-w-[] md:max-h-[] lg:max-w-[] lg:max-h-[] xl:max-w-[550px] xl:max-h-[550px] 2xl:max-w-[] 2xl:max-h-[]"
        style={{
          transition: "transform 0.3s ease-in-out",
        }}
      />
      <div className="absolute top-5 left-40 transform -translate-x-1/2 ">
        <div className="flex flex-row-reverse gap-3  w-48">
          {Array.from({ length: userWinner }).map((_, index) => (
            <div key={index}>
              <Image
                src="/image/winnerCrown.svg"
                width={50}
                height={50}
                alt="Winner Crown"
                className="w-12 h-12 sm:w-[18px] sm:h-[18px]"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-[10px] 2xl:top-[30px] 2xl:-right-[-40px] -right-20 transform -translate-x-1/1 w-48 flex flex-col gap-0">
  <h3 className="font-jainiPurva text-yellow-300 font-bold text-2xl sm:text-[8px] md:text-[] lg:text-[] xl:text-[] 2xl:text-[17px] leading-tight">
    Bet Amount: {betAmout}
  </h3>
  <h3 className="font-jainiPurva text-yellow-300 font-bold text-2xl sm:text-[8px] md:text-[] lg:text-[] xl:text-[] 2xl:text-[17px] leading-tight">
    Pot: {betAmout * 3 * round}
  </h3>
</div>

    </div>
  );
}

export default GameHeaderPot;
