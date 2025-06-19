import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export interface Game {
  id: number;
  name: string;
  category: string;
  totalPlayer: number;
}

export function GameItem({ game }: { game: Game }) {
    return (
        <Pressable onPress={() => router.push({
            pathname: "/games/[gameId]",
            params: {
                gameId: game.id
            }
        })} style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            borderRadius: 10,
            padding: 10,
            backgroundColor: "#d9d9d9"
        }}>
            <Text style={{ color: "black", fontSize: 20 }}>{game.name}</Text>
            <View style={{
                display:"flex",
                flexDirection: "row",
                justifyContent:"space-between"
            }}>
                <Text style={{ color:"#969696" }}>{game.category}</Text>
                <Text>{game.totalPlayer} players</Text>
            </View>
        </Pressable>
    )
}