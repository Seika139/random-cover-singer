import { SONGS, MEMBERS, Member } from "../data/master";

export interface SetlistResult {
    song: string;
    members: Member[];
    text: string;
}

export function generateSetlist(): SetlistResult {
    const song = SONGS[Math.floor(Math.random() * SONGS.length)];

    // Pick 1 to 5 random members
    const memberCount = Math.floor(Math.random() * 5) + 1;
    const shuffledMembers = [...MEMBERS].sort(() => 0.5 - Math.random());
    const selectedMembers = shuffledMembers.slice(0, memberCount);

    return {
        song,
        members: selectedMembers,
        text: `${song} / ${selectedMembers.map(m => m.name).join(", ")}`
    };
}
