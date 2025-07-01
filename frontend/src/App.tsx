import React, { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';
import ControlPanel from './components/ControlPanel';
import AlertModal from './components/AlertModal';
import { useGameSocket } from './hooks/useGameSocket';
import { GameState, Coord, Unit } from './types';
import { getPlayerColor } from './utils/colors';
import './App.css';

const DEMO_GAME_ID = 'demo-01';
const YOUR_PLAYER_ID = 1; // In real app, extracted from login/session

const defaultPlayers = [
  { id: 1, name: 'Player 1', color: getPlayerColor(1) },
  { id: 2, name: 'Player 2', color: getPlayerColor(2) },
];

function getBlankGameState(): GameState {
  const board: (Unit | null)[][] = Array(6)
    .fill(null)
    .map(() => Array(6).fill(null));
  return {
    board,
    units: [],
    currentPlayer: 1,
    players: defaultPlayers,
    winner: null,
    turn: 1,
    validMoves: [],
    validAttacks: [],
    selectedUnitId: null,
  };
}

// PUBLIC_INTERFACE
const App: React.FC = () => {
  const { state, error, sendAction } = useGameSocket(DEMO_GAME_ID);
  const [modal, setModal] = useState<string | null>(null);

  useEffect(() => {
    if (error) setModal(error);
  }, [error]);

  // PUBLIC_INTERFACE
  const handleCellClick = (coord: Coord) => {
    if (!state) return;
    // Clicking on valid move square with a selected unit
    if (
      state.selectedUnitId &&
      state.validMoves.some((c) => c.x === coord.x && c.y === coord.y)
    ) {
      sendAction({
        action: 'move',
        unitId: state.selectedUnitId,
        dest: coord,
      });
      return;
    }
    // Attack
    if (
      state.selectedUnitId &&
      state.validAttacks.some((c) => c.x === coord.x && c.y === coord.y)
    ) {
      sendAction({
        action: 'attack',
        unitId: state.selectedUnitId,
        target: coord,
      });
      return;
    }
  };

  // PUBLIC_INTERFACE
  const handleUnitClick = (unit: Unit) => {
    if (!state) return;
    if (state.selectedUnitId === unit.id) {
      sendAction({ action: 'select', unitId: null });
      return;
    }
    if (unit.player !== YOUR_PLAYER_ID) return;
    // Only select your own units on your turn
    if (state.currentPlayer !== YOUR_PLAYER_ID) return;
    sendAction({ action: 'select', unitId: unit.id });
  };

  // PUBLIC_INTERFACE
  const handleEndTurn = () => {
    sendAction({ action: 'end_turn' });
  };

  // PUBLIC_INTERFACE
  const closeModal = () => setModal(null);

  const gameState = state ?? getBlankGameState();

  return (
    <div className="App light-theme">
      <h1 style={{ color: '#2563eb', marginTop: 22, fontSize: '2rem' }}>
        GridTactix Duel
      </h1>
      <ControlPanel
        players={gameState.players}
        turn={gameState.turn}
        currentPlayer={gameState.currentPlayer}
        yourPlayerId={YOUR_PLAYER_ID}
        onEndTurn={handleEndTurn}
        winner={gameState.winner}
      />
      <GameBoard
        board={gameState.board}
        selectedUnitId={gameState.selectedUnitId}
        validMoves={gameState.validMoves}
        validAttacks={gameState.validAttacks}
        onCellClick={handleCellClick}
        onUnitClick={handleUnitClick}
        playerColors={{
          1: getPlayerColor(1),
          2: getPlayerColor(2),
        }}
      />
      {modal && <AlertModal message={modal} onClose={closeModal} />}
      <footer style={{ marginTop: 18, color: '#7e7e7e', fontSize: '0.91rem' }}>
        v0.1 - React GridTactix | <span style={{ color: '#f59e42' }}>Kavia</span>
      </footer>
    </div>
  );
};

export default App;
