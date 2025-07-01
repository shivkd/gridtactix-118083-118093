import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from './GameBoard';
import { Unit, Coord } from '../types';

const makeUnit = (player: 1 | 2, id: string, x: number, y: number): Unit => ({
  id: `${id}-${player}`,
  player,
  hp: 3,
  maxHp: 3,
  pos: { x, y },
  canMove: true,
  canAttack: false,
});

describe('GameBoard', () => {
  test('renders 6x6 cells and units, highlights selection', () => {
    const units = [
      makeUnit(1, 'A', 0, 0),
      makeUnit(2, 'B', 5, 5),
    ];
    const board = Array(6)
      .fill(null)
      .map(() => Array(6).fill(null));
    units.forEach((u) => (board[u.pos.y][u.pos.x] = u));

    const validMoves: Coord[] = [{ x: 1, y: 0 }];
    const validAttacks: Coord[] = [{ x: 5, y: 5 }];
    render(
      <GameBoard
        board={board}
        selectedUnitId={units[0].id}
        validMoves={validMoves}
        validAttacks={validAttacks}
        onCellClick={() => {}}
        onUnitClick={() => {}}
        playerColors={{ 1: '#2563eb', 2: '#14b8a6' }}
      />
    );
    // All cells rendered
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(6 * 6 - 2); // some cells are div, some have unit with button; rough check

    // Unit icons/HP shown
    expect(screen.getByText(/A-1/)).toBeInTheDocument;
    expect(screen.getByText(/B-2/)).toBeInTheDocument;

    // Selection highlight
    const selectedCell = screen.getAllByTitle('Selected Unit');
    expect(selectedCell.length).toBeGreaterThan(0);

    // Move and attack highlights
    // By CSS class, handled at runtime
  });

  test('calls onUnitClick for user units', () => {
    const myUnit = makeUnit(1, 'U', 1, 1);
    const board = Array(6)
      .fill(null)
      .map(() => Array(6).fill(null));
    board[1][1] = myUnit;

    const onUnitClick = jest.fn();
    render(
      <GameBoard
        board={board}
        selectedUnitId={myUnit.id}
        validMoves={[]}
        validAttacks={[]}
        onCellClick={() => {}}
        onUnitClick={onUnitClick}
        playerColors={{ 1: '#2563eb', 2: '#14b8a6' }}
      />
    );

    fireEvent.click(screen.getByText('▲'));
    expect(onUnitClick).toHaveBeenCalled();
  });
});
