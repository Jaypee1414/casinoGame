import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function PlayerIcon({ playerIndex, players, positioning, currentPlayerPOV }) {
  // Calculate the relative index based on the current player's POV
  const relativeIndex = React.useMemo(() => {
    const currentPlayerIndex = players.findIndex(
      (player) => player.id === currentPlayerPOV
    );
    return (playerIndex - currentPlayerIndex + players.length) % players.length;
  }, [playerIndex, players, currentPlayerPOV]);

  // Determine image URL based on relative index
  const imageUrl =
    relativeIndex === 0
      ? "https://miro.medium.com/v2/resize:fit:1400/1*rKl56ixsC55cMAsO2aQhGQ@2x.jpeg"
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVCTEOejHb2Cc4W8KxhLqz8_o5K2rO3XrfpA&s";

  return (
    <motion.div
      className={`text-2xl absolute ${positioning}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="backdrop-blur-md bg-black/30 sm:w-[85px] sm:h-[70px] sm:mt-[-100px] sm:ml-[-50px] 2xl:w-[280px] 2xl:h-[240px] border border-white/10 text-white p-4 rounded-xl shadow-2xl max-w-xs w-full hover:bg-black/40 transition-all duration-300">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-sm "></div>
            <img
              src={imageUrl || "/placeholder.svg?height=64&width=64"}
              alt={`Player ${playerIndex + 1}`}
              className="relative w-16 h-16 rounded-full object-cover border-2 border-white/20 sm:w-[20px] sm:h-[20px] sm:mt-[-16px] 2xl:w-[80px] 2xl:h-[80px] 2xl:mt-[-5px] "
              style={{
                transition: "transform 0.3s ease-in-out",
              }}
            />
            {players[playerIndex].consecutiveWins > 0 && (
              <div className="absolute -bottom-2 -left-1 text-white text-xs font-bold px-2 py-1 rounded-full   w-full">
                <Image
                  src="/image/winnerCrown.svg"
                  width={50}
                  height={50}
                  alt="Winner Crown"
                  className="w-6 h-6"
                />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-[6px] sm:mt-[-16px] sm:ml-[-11px] 2xl:text-[22px] 2xl:mt-[10px] 2xl:ml-[2px] font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {players[playerIndex].name}
            </h2>
            <p className="text-sm sm:text-[4px] sm:mt-[-16px] sm:ml-[-11px] 2xl:text-[18px] 2xl:mt-[10px] 2xl:ml-[2px] text-gray-300">
              {`Player ${playerIndex + 1}`}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center border-t border-white/10 pt-3 sm:mt-[-2px] 2xl:mt-[30px]">
          <div>
            <p className="text-sm sm:text-[6px] text-gray-400 sm:mt-[-14px] 2xl:text-[18px] ">Pot Money</p>
            <p className="text-lg font-bold text-emerald-400 sm:text-[4px] sm:mt-[-10px] 2xl:text-[16px] 2xl:mt-[10px] ">
              ₱ {players[playerIndex].points || 0}
            </p>
          </div>
          <div className="w-8 2xl:w-[44px] sm:w-[14px]  h-8 2xl:h-[48px] sm:mt-[-18px] 2xl:mt-[30px] bg-no-repeat bg-cover bg-center rounded-lg shadow-md flex items-center justify-center gap-3">
            <p className="text-white text-stroke-thin font-extrabold text-2xl font-jaro absolute sm:text-[8px] 2xl:text-[25px]">
              {players[playerIndex]?.hand?.length || 0}
            </p>
            <Image
              src="/image/cardBackground.svg"
              width={50}
              height={50}
              alt="Winner Crown"
              className="w-12 h-12"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PlayerIcon;
