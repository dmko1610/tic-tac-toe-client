export type PlayerSymbol = "X" | "O";
export type CellValue = PlayerSymbol | null;
export type GameStatus = "waiting" | "playing" | "x_won" | "o_won" | "draw";

export type GameState = {
  roomCode: string;
  board: CellValue[];
  currentTurn: PlayerSymbol;
  status: GameStatus;
  players: {
    X?: string;
    O?: string;
  };
  winner: PlayerSymbol | null;
  rematchRequests: PlayerSymbol[];
};
