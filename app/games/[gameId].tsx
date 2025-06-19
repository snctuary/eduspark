import { RankData, RankItem } from "@/components/RankItem";
import { shuffle } from "@/util/shuffle";
import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface Word {
    id: number;
    word: string;
    image: string;
    point: number;
}

export default function() {
    const { gameId } = useLocalSearchParams();
    const [words, setWords] = useState<Word[]>([]);

    const [currentWordId, setCurrentWordId] = useState(0);
    const currentWord = words.at(currentWordId);
    const [shuffled, setShuffled] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);

    const score = answers.map((answer, index) => answer === words.at(index)?.word).filter((result) => result === true).length * 10;
    const [nickname, setNickname] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [ranks, setRanks] = useState<RankData[]>([]);

    async function fetchWords() {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/words/${gameId}`);
        const fetchedWords: Word[] = await response.json();
        setShuffled(fetchedWords.map((word) => shuffle(word.word)))
        setAnswers(fetchedWords.map(() => ""));
        setWords(fetchedWords);
    }
    async function fetchRanks() {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/leaderboards/${gameId}`);
        const fetchedRanks: RankData[] = await response.json();

        setRanks(fetchedRanks);
    }

    const firstWord = currentWordId <= 0 
    const lastWord = currentWordId >= (words.length - 1);

    async function submitAnswers() {
        if (nickname.length >= 1) {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/leaderboards`, {
                headers: {
                    "content-type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    gameID: gameId,
                    nickname,
                    totalPoint: score
                })
            });
            fetchRanks();
            setSubmitted(true)
        }
    }


    useEffect(() => {
        fetchWords();
        fetchRanks();
    }, [gameId]);

    if (!showForm) {
        return (
            <View style={{
                display:"flex",
                flexDirection: "column",
                height: "100%",
                gap: 10,
                padding: 10,
            }}>
                <View style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1,
                    gap: 10
                }}>
                {currentWord?.image && <Image style={{
                    width: 100,
                    height: 100
                }} source={{
                    uri: `${process.env.EXPO_PUBLIC_API_URL}/images/${currentWord.image}`
                }}></Image>}
                <Text style={{
                    fontSize: 20
                }}>{shuffled.at(currentWordId)}</Text>
                <TextInput onChangeText={(input) => {
                    setAnswers((original) => original.with(currentWordId, input))
                }} value={answers.at(currentWordId)} style={{
                    display: "flex",
                    width: "75%",
                    backgroundColor: "#C8C8C8",
                    borderRadius: 10,
                    textAlign: "center"
                }}></TextInput>
                </View>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <Pressable disabled={currentWordId <= 0} onPress={() => setCurrentWordId((current) => current - 1)} style={{
                        padding: 12,
                        borderRadius: 10,
                        backgroundColor: !firstWord ? "#3D5AFE" : "#C8C8C8"
                    }}>
                        <Text style={{
                            color: "white"
                        }}>PREV</Text>
                    </Pressable>
                    <Pressable onPress={() => {
                        if (!lastWord) {
                            setCurrentWordId((current) => current + 1)
                        } else {
                            setShowForm(true)
                        }
                    }} style={{
                        padding: 12,
                        borderRadius: 10,
                        backgroundColor: "#3D5AFE"
                    }}>
                        <Text style={{
                            color: "white"
                        }}>{lastWord ? "SUBMIT" : "NEXT"}</Text>
                    </Pressable>
                </View>
            </View>
        )
    } else {
        return (
            <View style={{
                display:"flex",
                flexDirection: "column",
                height: "100%",
                gap: 10,
                padding: 10,
            }}>
               <View style={{
                display: "flex",
                flexDirection: "row",
               }}>
               <Pressable onPress={() => router.back()} style={{
                    padding: 12,
                    backgroundColor: "#969696",
                    borderRadius: 10
                }}>
                    <Text style={{
                        color: "white"
                    }}>Back To Home</Text>
                </Pressable>
               </View>
               <View style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignItems: "center"
               }}>
                <Text style={{ fontSize: 20 }}>Your Score:</Text>
                <Text style={{ fontSize: 50 }}>{score}</Text>
                {!submitted && <View style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                gap: 10,
                alignItems: "center"
               }}><Text style={{ fontSize: 20, marginTop: 10 }}>Input Nickname:</Text>
                <TextInput onChangeText={setNickname} value={nickname} style={{
                    display: "flex",
                    width: "75%",
                    backgroundColor: "#C8C8C8",
                    borderRadius: 10,
                    textAlign: "center"
                }}></TextInput>
                <Pressable onPress={() => submitAnswers()} disabled={nickname.length <= 0} style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: "#3D5AFE"
                }}>
                    <Text style={{ color: "white" }}>Submit</Text>
                </Pressable></View>}
                <Text style={{ marginTop: 10, fontSize: 20 }}>Leaderboard</Text>
                <View style={{
                    display:"flex",
                    width: "100%",
                    flexDirection: "column",
                    gap: 10
                }}>
                    {ranks.map((rank, index) => <RankItem key={index} rank={rank} position={index + 1} />)}
                </View>
               </View>
            </View>
        )
    }
}