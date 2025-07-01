const PLAYER_COLORS: Record<number, string> = {
  1: '#2563eb', // primary
  2: '#14b8a6', // secondary
};

export const getPlayerColor = (playerId: number): string =>
  PLAYER_COLORS[playerId] ?? '#aaa';
