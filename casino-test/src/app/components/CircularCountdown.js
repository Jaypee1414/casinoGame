import { useState, useEffect } from "react";

function CircularCountdown({ isPlayerTurn, gameState, timer }) {
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  const circleRadius = 50; // Radius of the circle
  const circleLength = 2 * Math.PI * circleRadius; // Length of the circle (circumference)

  // Update the stroke-dashoffset based on the timer
  useEffect(() => {
    const offset = circleLength - (circleLength * timer) / 25; // Timer range is 0 to 25
    setStrokeDashoffset(offset);
  }, [timer, circleLength]);

  return (
    isPlayerTurn && !gameState.gameEnded && (
      <div className="absolute top-14 left-1/2 transform -translate-x-1/2">
        <svg
          className={`w-24 h-24 sm:w-[20px] sm:h-[20px] sm:mt-[8px] md:w-[30px] md:h-[30px] md:ml-[10px] 2xl:w-[100px] 2xl:h-[100px] 2xl:mt-[-180px] 2xl:ml-[140px] ${timer >= 10 ? "" : "animate-pulse"}`} // Increased width and height
          width="120" // Size of the container to fit the full circle
          height="120"
          viewBox="0 0 120 120" // Adjusted viewBox to ensure the full circle fits
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle */}
          <circle
            cx="60" // Center of the circle (in the middle of the SVG container)
            cy="60"
            r={circleRadius}
            stroke={timer >= 10 ? "yellow" : "red"}
            strokeWidth="8"
            fill="none"
            opacity="0.2"
          />
          {/* Foreground Circle */}
          <circle
            cx="60" // Same center as the background circle
            cy="60"
            r={circleRadius}
            stroke={timer >= 10 ? "yellow" : "#be123c"} // Using rose-700 color
            strokeWidth="8"
            fill="none"
            strokeDasharray={circleLength}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 1s linear", // Smooth transition
            }}
          />
        </svg>
        <div className="absolute top-0 sm:mt-[4px] md:mt-[3px] md:ml-[5px] 2xl:mt-[-130px] 2xl:ml-[70px] left-0 w-full h-full flex justify-center items-center">
          <span className={`text-2xl sm:text-[8px] 2xl:text-[32px] md:text-[12px] font-bold ${timer >= 10 ? "text-black" : "text-white"}`}>
            {timer}s
          </span>
        </div>
      </div>
    )
  );
}

export default CircularCountdown;
