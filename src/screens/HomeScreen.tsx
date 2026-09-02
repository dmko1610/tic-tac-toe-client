import { useEffect, useState } from "react";
import { socket } from "../services/socket";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { GameState, PlayerSymbol } from "../types/game";
import { GameScreen } from "./GameScreen";
import { usePlayerId } from "../hooks/usePlayerId";

export function HomeScreen() {
  const [roomCode, setRoomCode] = useState("");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [symbol, setSymbol] = useState<PlayerSymbol | null>(null);

  const playerId = usePlayerId();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("room_created", (payload) => {
      setSymbol(payload.symbol);
      setGameState(payload.state);
    });

    socket.on("room_joined", (payload) => {
      setSymbol(payload.symbol);
      setGameState(payload.state);
    });

    socket.on("game_state", (state) => {
      setGameState(state);
    });

    socket.on("move_rejected", (payload) => {
      Alert.alert("Move rejected", payload.message);
    });

    socket.on("error", (payload) => {
      Alert.alert("Error", payload.message);
    });

    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("room_created");
      socket.off("room_joined");
      socket.off("game_state");
      socket.off("move_rejected");
      socket.off("error");
      socket.disconnect();
    };
  }, []);

  function createRoom() {
    console.log("create pressed", { playerId, connected: socket.connected });

    socket.emit("create_room", {
      playerId
    });
  }

  function joinRoom() {
    console.log("join pressed", {
      playerId,
      roomCode,
      connected: socket.connected
    });

    socket.emit("join_room", {
      playerId,
      roomCode
    });
  }

  function leaveRoom() {
    if (gameState) {
      socket.emit("leave_room", {
        roomCode: gameState.roomCode,
        playerId
      });
    }

    setGameState(null);
    setSymbol(null);
  }

  if (!playerId) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (gameState && symbol) {
    return (
      <GameScreen
        playerId={playerId}
        symbol={symbol}
        state={gameState}
        onLeave={leaveRoom}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Create room" onPress={createRoom} />

      <TextInput
        placeholder="Room code"
        value={roomCode}
        onChangeText={setRoomCode}
        keyboardType="number-pad"
        style={styles.input}
      />

      <Button title="Join room" onPress={joinRoom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, gap: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8 }
});
