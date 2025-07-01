import React from 'react';
import { PlayerInfo } from '../types';
import './ControlPanel.css';

type Props = {
  players: PlayerInfo[];
  turn: number;
  currentPlayer: number;
  yourPlayerId: number;
  onEndTurn: () => void;
  winner: number | null;
};

const ControlPanel: React.FC<Props> = ({
  players,
  turn,
  currentPlayer,
  yourPlayerId,
  onEndTurn,
  winner,
}) => (
  <div className="control-panel">
    <div className="players-info">
      {players.map((pl) => (
        <span
          key={pl.id}
          className={
            'player-chip' +
            (pl.id === currentPlayer ? ' current' : '') +
            (pl.id === yourPlayerId ? ' you' : '')
          }
          style={{ borderColor: pl.color, color: pl.color }}
        >
          {pl.name}
          {pl.id === yourPlayerId ? ' (You)' : ''}
          {pl.id === currentPlayer ? ' 🟢' : ''}
        </span>
      ))}
      <span className="turn-info">Turn: {turn}</span>
      {winner !== null ? (
        <span className="winner-banner">
          Winner: {players.find((pl) => pl.id === winner)?.name || 'Player ' + winner}
        </span>
      ) : null}
    </div>
    <div className="controls-bar">
      <button
        className="btn end-turn"
        onClick={onEndTurn}
        disabled={winner !== null || currentPlayer !== yourPlayerId}
      >
        End Turn
      </button>
    </div>
  </div>
);

export default ControlPanel;
