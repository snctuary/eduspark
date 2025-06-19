export function shuffle(word: string) {
    return Array.from(word).map((str) => ({ index: Math.random(), str })).sort((a, b) => a.index - b.index).map((str) => str.str).join("")
}