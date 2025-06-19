import { Text, View } from "react-native";

export interface RankData {
    id: number;
    nickname: string;
    totalPoint: number;
}

export function RankItem({ rank, position }: { rank: RankData, position: number }) {
    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            <View style={{
                display:"flex",
                flexDirection: "row",
                gap: 10
            }}>
                <Text>#{position}</Text>
                <Text>{rank.nickname}</Text>
            </View>
            <Text>{rank.totalPoint}</Text>
        </View>
    )
}