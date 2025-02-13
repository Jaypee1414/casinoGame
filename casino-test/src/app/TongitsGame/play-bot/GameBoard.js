
import React from 'react';
import { Card } from './Card';
import { Player } from '../../../hooks/use-tongit-game';
import { Card as CardType } from '../../../utils/card-utils';

export function GameBoard({ gameState, gameMode, onSapawSelect, currentPlayerIndex }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
      {gameState.players.map((player, playerIndex) => (
        <div key={player.id} className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">{player.name}</h3>
          <p>Cards: {player.hand.length}</p>
          <p>Exposed Melds: {player.exposedMelds.length}</p>
          <p>Score: {player.score}</p>
          <div>
            {player.exposedMelds.map((meld, meldIndex) => (
              <div key={meldIndex} className="mt-2">
                <p>Meld {meldIndex + 1}:</p>
                <div className="flex space-x-1 overflow-x-auto">
                  {meld.map((card, cardIndex) => (
                    <div
                      key={cardIndex}
                      className="flex-shrink-0"
                      onClick={() => onSapawSelect({ playerIndex, meldIndex })}
                    >
                      <Card card={card} small />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {playerIndex !== 0 && (
            <div className="mt-2">
              <p>{player.name}&apos;s hand ({player.hand.length} cards)</p>
              <div className="flex space-x-1 overflow-x-auto">
                {player.hand.map((_, index) => (
                  <div key={index} className="w-8 h-12 bg-blue-500 rounded-lg"></div>
                ))}
              </div>
            </div>
          )}
          {playerIndex === currentPlayerIndex && (
            <div className="mt-2">
              <p className="font-bold text-green-600">{player.name}&apos;s turn</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
