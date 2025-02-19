import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Card } from '../TongitsGame/play-bot/Card';

function GroupCard({player}) {
  return (
    <div className='w-auto flex flex-row justify-start gap-3 rounded-lg relative'>
        <AnimatePresence>
    {player.groupCards?.map((group, groupIndex) => (
        <motion.div
          key={groupIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-row gap-2" // Keeps each group in a row with gap between cards
          onClick={()=> console.log("abs dito mo ialgay")}
        >
          {group.map((card, cardIndex) => (
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
                border="1px solid black"
                cardSize="w-1.5 h-22 p-2 text-4xl"
                card={card}
              />
            </motion.div>
          ))}
        </motion.div>
      ))}
  </AnimatePresence>
    </div>
  )
}

export default GroupCard
