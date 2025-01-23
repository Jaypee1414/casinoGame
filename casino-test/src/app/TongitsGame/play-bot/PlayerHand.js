import React from "react";
import { Card } from "./Card";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function PlayerHand({
  position,
  cardSize,
  hand,
  onCardClick,
  selectedIndices,
  isCurrentPlayer,
  discardingIndex
}) {
  const containerRef = useRef(null);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // State for window width

  const animationTriggered = useRef(false);

  // Reset selected cards when selectedIndices changes
  useEffect(() => {
    setSelectedCards(new Set(selectedIndices));
  }, [selectedIndices]);

  useEffect(() => {
    if (!animationTriggered.current && containerRef.current && hand?.length > 0) {
      const cards = containerRef.current.children;
      gsap.set(cards, {
        x: 3,
        y: 0,
        opacity: 0,
      });

      gsap.to(cards, {
        x: (index) => index * -45,
        opacity: 1,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power2.out',
      });

      animationTriggered.current = true;
    }
  }, [hand]);

  // Responsive x position function
  const cardPlacement = (index) => {
    let xPosition = 0;

    // Adjust x position based on screen width
    if (windowWidth < 640) {
      xPosition = index * -20; // For small screens
    } else if (windowWidth < 768) {
      xPosition = index * -25;
    } else if (windowWidth < 1024) {
      xPosition = index * -30;
    } else if (windowWidth < 1280) {
      xPosition = index * -35;
    } else {
      xPosition = index * -40; // For larger screens
    }

    return xPosition;
  };

  // Update windowWidth on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (index) => {
    if (isCurrentPlayer) {
      onCardClick(index);
      setSelectedCards((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-wrap justify-center sm:w-[300px] 2xl:w-[600px]  rounded-lg absolute ${
        isCurrentPlayer
          ? "bg-opacity-10 shadow-lg h-20 sm:h-[72px] sm:left-[260px] sm:top-[216px] md:h-[62px] md:left-[450px] md:top-[285px] lg:top-[490px] lg:right-[100px]  2xl:h-[100px] 2xl:top-[660px] 2xl:left-[900px]"
          : "bg-opacity-10 shadow-lg h-20 sm:h-[72px] sm:left-[260px] sm:top-[216px] md:h-[62px] md:left-[450px] md:top-[285px] lg:top-[490px] lg:right-[100px] 2xl:h-[100px] 2xl:top-[660px] 2xl:left-[900px]"
      }`}
    >
      {hand?.map((card, index) => (
        <motion.div
          key={`${card.suit}-${card.rank}-${index}`}
          layout
          initial={false}
          animate={{
            y: selectedIndices.includes(index) ? -16 : 0,
            x: cardPlacement(index), // Use the responsive x position here
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ rotate: 5 }}
          style={{
            transformStyle: "preserve-3d",
            transform: "perspective(1000px)",
            borderRadius: "0.5rem",
            bottom: "10px",
            right: "10px",
            position: "absolute",
            zIndex: hand.length - index,
          }}
        >
          <Card
            border={"1px solid black"}
            position={position}
            opacityCard={`${
              selectedCards.size === 0 || selectedCards.has(index)
                ? "opacity-100"
                : "opacity-85"
            }`}
            cardSize={cardSize}
            card={card}
            onClick={() => handleCardClick(index)}
            isDiscarding={discardingIndex === index}
          />
        </motion.div>
      ))}
      {isCurrentPlayer && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse sm:w-[80px] sm:h-[30px] sm:text-[10px] md:h-[40px] md:w-[100px] md:text-[14px]">
            Your Turn!
          </div>
        </div>
      )}
    </div>
  );
};
