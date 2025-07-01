import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from './ControlPanel';

describe('ControlPanel', () => {
  test('renders players and turn, disables End Turn if not your turn', () => {
    const players = [
      { id: 1, name: 'Player 1', color: '#2563eb' },
      { id: 2, name: 'Player 2', color: '#14b8a6' },
    ];
    render(
      <ControlPanel
        players={players}
        turn={3}
        currentPlayer={2}
        yourPlayerId={1}
        onEndTurn={() => {}}
        winner={null}
      />
    );
    expect(screen.getByText(/Player 1/)).toBeInTheDocument();
    expect(screen.getByText(/Player 2/)).toBeInTheDocument();
    expect(screen.getByText(/Turn: 3/)).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /End Turn/i });
    expect(btn).toBeDisabled();
  });

  test('fires onEndTurn when clicked', () => {
    const players = [
      { id: 1, name: 'Player 1', color: '#2563eb' },
      { id: 2, name: 'Player 2', color: '#14b8a6' },
    ];
    const onEndTurn = jest.fn();
    render(
      <ControlPanel
        players={players}
        turn={2}
        currentPlayer={1}
        yourPlayerId={1}
        onEndTurn={onEndTurn}
        winner={null}
      />
    );
    const btn = screen.getByRole('button', { name: /End Turn/i });
    fireEvent.click(btn);
    expect(onEndTurn).toHaveBeenCalled();
  });
});
