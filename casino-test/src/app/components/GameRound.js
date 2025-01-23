import React from "react";
import Image from "next/image";
function GameRound({gameState}) {
  return (
    <div className="absolute w-28 h-28 sm:w-[36px] sm:h-[36px] sm:mt-[50px] md:w-[] md:h-[] lg:w-[] lg:h-[] xl:w-[] xl:h-[] 2xl:w-[120px] 2xl:h-[120px] 2xl:mt-[-200px] 2xl:ml-[20px]">
      <Image
        src="/image/roundBG.svg"
        width={50}
        height={50}
        alt="Winner Crown"
        className="w-28 h-28"
      />
      <div className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-3xl sm:text-xs sm:mt-[50px] sm:ml-[-4px] xl:text-lg xl:-left-2 2xl:text-3xl 2xl:mt-[-32px] 2xl:ml-[-10px] font-jaro">
        {gameState.round}
      </div>
    </div>
  );
}

export default GameRound;
