import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { socket } from "../services/socket";
import { GameState, PlayerSymbol } from "../types/game";

interface Props {
  playerId: string;
  symbol: PlayerSymbol;
  state: GameState;
  onLeave: () => void;
}

export function GameScreen({ playerId, symbol, state, onLeave }: Props) {
  const isMyTurn = state.status === "playing" && state.currentTurn === symbol;
  const isGameFinished = state.status !== "playing" && state.status !== "waiting";
  const didRequestRematch = state.rematchRequests.includes(symbol);
  const opponentSymbol = symbol === "X" ? "O" : "X";
  const didOpponentRequestRematch =
    state.rematchRequests.includes(opponentSymbol);

  function makeMove(cellIndex: number) {
    if (!isMyTurn || state.board[cellIndex]) {
      return;
    }

    socket.emit("make_move", {
      roomCode: state.roomCode,
      playerId,
      cellIndex
    });
  }

  function requestRematch() {
    socket.emit("request_rematch", {
      roomCode: state.roomCode,
      playerId
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.roomHeader}>
        <Text style={styles.roomLabel}>Share this room code</Text>
        <Text selectable style={styles.roomCode}>
          {state.roomCode}
        </Text>
      </View>

      <Text>You are: {symbol}</Text>
      <Text>Status: {state.status}</Text>
      <Text>Turn: {state.currentTurn}</Text>
      {didRequestRematch ? <Text>Waiting for opponent...</Text> : null}
      {!didRequestRematch && didOpponentRequestRematch ? (
        <Text>Opponent wants a rematch</Text>
      ) : null}

      <View style={styles.innerContainer}>
        {state.board.map((cell, index) => (
          <Pressable
            key={index}
            onPress={() => makeMove(index)}
            style={[
              styles.button,
              { backgroundColor: isMyTurn && !cell ? "#f3f3f3" : "#fff" }
            ]}
          >
            <Text style={styles.cellText}>{cell}</Text>
          </Pressable>
        ))}
      </View>

      {isGameFinished ? (
        <Button
          title={didRequestRematch ? "Rematch requested" : "Rematch"}
          onPress={requestRematch}
          disabled={didRequestRematch}
        />
      ) : null}

      <Button title="Leave" onPress={onLeave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, gap: 16 },
  roomHeader: { alignItems: "center", gap: 4 },
  roomLabel: { fontSize: 16 },
  roomCode: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 4,
    textAlign: "center"
  },
  innerContainer: { flexDirection: "row", flexWrap: "wrap", width: 300 },
  cellText: { fontSize: 42, fontWeight: "700" },
  button: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#222"
  }
});
