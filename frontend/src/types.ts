export type Coord = { x: number; y: number };

export type Unit = {
  id: string;
  player: 1 | 2;
  hp: number;
  maxHp: number;
  pos: Coord;
  canMove: boolean;
  canAttack: boolean;
};

export type PlayerInfo = {
  id: number;
  name: string;
  color: string; // CSS color
};

export type GameState = {
  board: (Unit | null)[][];
  units: Unit[];
  currentPlayer: number;
  players: PlayerInfo[];
  winner: number | null;
  turn: number;
  validMoves: Coord[];
  validAttacks: Coord[];
  selectedUnitId: string | null;
};

export type GameAction =
  | { type: 'move'; unitId: string; dest: Coord }
  | { type: 'attack'; unitId: string; target: Coord }
  | { type: 'select'; unitId: string | null }
  | { type: 'endTurn' };

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type BackendEvent =
  | { event: 'update'; state: GameState }
  | { event: 'error'; message: string }
  | { event: 'gameover'; winner: number };

export type WsAction =
  | { action: 'move'; unitId: string; dest: Coord }
  | { action: 'attack'; unitId: string; target: Coord }
  | { action: 'end_turn' }
  | { action: 'select'; unitId: string | null };
