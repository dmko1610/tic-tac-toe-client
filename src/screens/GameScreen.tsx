import { Pressable, StyleSheet, Text, View } from "react-native";
import { socket } from "../services/socket";
import { GameState, PlayerSymbol } from "../types/game";
import { RoomQrCode } from "../components/RoomQrCode";

interface Props {
  playerId: string;
  symbol: PlayerSymbol;
  state: GameState;
  onLeave: () => void;
}

export function GameScreen({ playerId, symbol, state, onLeave }: Props) {
  const isMyTurn = state.status === "playing" && state.currentTurn === symbol;
  const isGameFinished =
    state.status !== "playing" && state.status !== "waiting";
  const statusMessage = getStatusMessage(state, symbol);
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
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <RoomQrCode roomCode={state.roomCode} />
        <View style={styles.roomHeader}>
          <Text style={styles.roomLabel}>Share this room code</Text>
          <Text selectable style={styles.roomCode}>
            {state.roomCode}
          </Text>
        </View>

        <View style={styles.statusBlock}>
          <Text style={styles.symbolText}>You are {symbol}</Text>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
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
          <Pressable
            onPress={requestRematch}
            disabled={didRequestRematch}
            style={[
              styles.actionButton,
              didRequestRematch ? styles.actionButtonDisabled : null
            ]}
          >
            <Text style={styles.actionButtonText}>
              {didRequestRematch ? "Rematch requested" : "Rematch"}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Pressable onPress={onLeave} style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Leave</Text>
      </Pressable>
    </View>
  );
}

function getStatusMessage(state: GameState, symbol: PlayerSymbol) {
  if (state.status === "waiting") {
    return "Waiting for another player";
  }

  if (state.status === "draw") {
    return "Draw";
  }

  if (state.status === "x_won" || state.status === "o_won") {
    return state.winner === symbol ? "You won" : "You lost";
  }

  return state.currentTurn === symbol ? "Your turn" : "Opponent's turn";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16
  },
  roomHeader: { alignItems: "center", gap: 4 },
  roomLabel: { fontSize: 16 },
  roomCode: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 4,
    textAlign: "center"
  },
  statusBlock: { alignItems: "center", gap: 6 },
  symbolText: { fontSize: 16 },
  statusText: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  innerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
    height: 300
  },
  cellText: { fontSize: 42, fontWeight: "700" },
  button: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#222"
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 24
  },
  actionButton: {
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#222"
  },
  actionButtonDisabled: {
    opacity: 0.5
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  }
});
