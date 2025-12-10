import { SONGS, MEMBERS } from "../data/master";

export function generateSetlist() {
    const song = SONGS[Math.floor(Math.random() * SONGS.length)];

    // Pick 1 to 3 random members
    const memberCount = Math.floor(Math.random() * 3) + 1;
    const shuffledMembers = [...MEMBERS].sort(() => 0.5 - Math.random());
    const selectedMembers = shuffledMembers.slice(0, memberCount);

    return {
        song,
        members: selectedMembers,
        text: `${song} / ${selectedMembers.join(", ")}`
    };
}
