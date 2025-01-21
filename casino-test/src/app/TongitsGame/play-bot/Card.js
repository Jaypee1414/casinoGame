import {React,useRef, useEffect, useState} from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Player } from '../../../hooks/use-tongit-game';
import { Card as CardType } from '../../../utils/card-utils';

export function Card({contextText, position, border,transformCard,id ,opacityCard, cardSize, card, onClick, small = false,isDiscarding}) {
  const { suit, rank } = card;
  const boxRef = useRef(null)
  const [isPosition, setIsPosition] = useState()
    // Animation controls for the card
    const controls = useAnimation();
  const color = suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black';

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.style.transform = transformCard ? transformCard : " ";
      boxRef.current.style.border = border ? border : ''; 
    }
  }, [transformCard,border])
    // Effect to trigger discard animation
    useEffect(() => {
      if (isDiscarding) {
        const rect = boxRef.current.getBoundingClientRect();
        setIsPosition(rect.x)
        controls.start({
          x: `calc(${position.x}px - ${rect.x}px)`, 
          y:  -370, // Upward movement
          rotate: 360,
          scale: [1, 1, 0.8], 
          // opacity: [1, 0], // Fade out Transition
          transition: { duration: 0.3, ease: "easeIn" }
        });
      }
    }, [isDiscarding, controls,position]);

  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };
  const baseClasses = `${opacityCard} bg-white border border-gray-300 rounded-md sm:w-[29px] sm:h-[38px] 2xl:h-[88px] 2xl:w-[68px] shadow-sm flex flex-col justify-between cursor-pointer ${color}`;

  // Make the card bigger by adjusting width, height, and padding
  const sizeClasses = small 
  ? `${cardSize}` // smaller size
  : `${cardSize}`; // bigger size


  return (
    <motion.div 
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={controls}
  >   <div 
  id={`card-${id}`}
    className={`${baseClasses} ${sizeClasses}`}
    onClick={onClick}
    ref={boxRef} 
  >
    <div className="text-left font-bold text-2xl sm:text-[10px] sm:mt-[-18px] sm:ml-[-4px] 2xl:text-[18px] 2xl:mt-[-2px] 2xl:ml-[2px]">{rank}</div>
    <div className={`text-center ${contextText ? contextText : "text-4xl sm:text-[17px] sm:mt-[-21px] 2xl:text-4xl"  }  2xl:text-4xl sm:text-[8px] sm:mt-[-21px] `}>
      {getSuitSymbol(suit)}
    </div>
  </div></motion.div> 

  );
}
