import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PLAYER_ID_KEY = "playerId";

export function usePlayerId() {
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlayerId() {
      const existing = await AsyncStorage.getItem(PLAYER_ID_KEY);

      if (existing) {
        setPlayerId(existing);

        return;
      }

      const created = `player-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      await AsyncStorage.setItem(PLAYER_ID_KEY, created);
      setPlayerId(created);
    }

    loadPlayerId();
  }, []);

  return playerId;
}
