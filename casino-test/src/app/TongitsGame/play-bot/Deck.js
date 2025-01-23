import React from 'react';

export function Deck({ cardsLeft, onDraw, disabled }) {
  return (
    <button 
    
      className="w-1.5 2xl:w-24 h-24 sm:w-[30px] sm:h-[42px] sm:mt-[-38px] sm:mr-[20px] md:w-[40px] md:h-[60px] md:mt-[-62px] lg:h-[] xl:h-[] 2xl:h-28 bg-[url('/image/cardBackground.svg')]  bg-no-repeat bg-cover bg-center rounded-lg shadow-md flex items-center justify-center"
      onClick={onDraw}
      disabled={disabled}
    >
      <span className="text-white text-stroke-thin font-bold font-jaro text-4xl sm:text-[13px]" style={{
        textShadow: "2px 2px 4px rgba(255, 255, 255, 0.8)"
      }}>{cardsLeft}</span>
    </button>
  );
}
