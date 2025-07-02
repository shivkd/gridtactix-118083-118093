import React from 'react';
import { Coord, Unit } from '../types';
import './GameBoard.css';

type Props = {
  board: (Unit | null)[][];
  selectedUnitId: string | null;
  validMoves: Coord[];
  validAttacks: Coord[];
  // Prefix props with underscore to match usage/unused convention for ESLint
  onCellClick: (_cell: Coord) => void;
  onUnitClick: (_unit: Unit) => void;
  playerColors: Record<number, string>;
};

function isCoordEqual(a: Coord, b: Coord) {
  return a.x === b.x && a.y === b.y;
}

// cell and unit were previously unused parameters below, so now use _cell and _unit if they appear elsewhere

// PUBLIC_INTERFACE
const GameBoard: React.FC<Props> = ({
  board,
  selectedUnitId,
  validMoves,
  validAttacks,
  onCellClick,
  onUnitClick,
  playerColors,
}) => {
  return (
    <div className="game-board">
      {board.map((row, y) => (
        <div className="board-row" key={y}>
          {row.map((unit, x) => {
            // Only "unit" and "x" are needed here; no "cell" param
            const coord = { x, y };
            const moveHighlight = validMoves.some((c) => isCoordEqual(c, coord));
            const attackHighlight = validAttacks.some((c) => isCoordEqual(c, coord));
            const isSelected = unit?.id === selectedUnitId;
            return (
              <div
                key={x}
                className={`cell${moveHighlight ? ' move-highlight' : ''}${
                  attackHighlight ? ' attack-highlight' : ''
                }${isSelected ? ' selected-unit' : ''}`}
                onClick={() => onCellClick(coord)}
              >
                {unit && (
                  <div
                    className="unit"
                    style={{ borderColor: playerColors[unit.player] }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnitClick(unit);
                    }}
                  >
                    <span
                      className="unit-avatar"
                      style={{
                        background: playerColors[unit.player],
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                      title={
                        isSelected
                          ? 'Selected Unit'
                          : unit.canMove
                          ? 'Can Move'
                          : 'Unit'
                      }
                    >
                      {unit.player === 1 ? '▲' : '◆'}
                    </span>
                    <span className="unit-hp">
                      {unit.hp}/{unit.maxHp}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
export default GameBoard;
