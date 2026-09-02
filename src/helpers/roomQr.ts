const ROOM_QR_PREFIX = "tictactoe://join/";

export function createRoomQrValue(roomCode: string) {
  return `${ROOM_QR_PREFIX}${roomCode}`;
}

export function parseRoomQrValue(value: string) {
  const match = value.match(/^tictactoe:\/\/join\/(\d{6})$/);
  return match?.[1] ?? null;
}
