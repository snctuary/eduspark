import { Game, GameItem } from "@/components/GameItem";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [games, setGames] = useState<Game[]>([]);

  async function fetchGames() {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/games`);
    const fetchedGames = await response.json();

    setGames(fetchedGames);
  }

  useEffect(() => {
    fetchGames()
  }, []);
  
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 10,
        padding: 10,
      }}
    >
      <View style={{
        display: "flex",
        flexDirection: "column",
      }}>
        <Text style={{ fontSize: 30, color:"#3D5AFE" }}>EduSpark</Text>
        <Text>Gaming as an edugamers</Text>
      </View>
        <View style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 10,
        }}>
          {games.map((game) => <GameItem key={game.id} game={game} />)}
        </View>
    </View>
  );
}
