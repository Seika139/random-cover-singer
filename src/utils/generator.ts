import { SONGS, MEMBERS_GROUP_A, MEMBERS_GROUP_B, Member } from "../data/master";

export interface SetlistResult {
    song: string;
    members: Member[];
    text: string;
}

export function generateSetlist(): SetlistResult {
    const song = SONGS[Math.floor(Math.random() * SONGS.length)];

    // ランダムにグループAまたはグループBを選択
    const selectedGroup = Math.random() < 0.5 ? MEMBERS_GROUP_A : MEMBERS_GROUP_B;

    // Pick 1 to 5 random members from the selected group
    const memberCount = Math.floor(Math.random() * 5) + 1;
    const shuffledMembers = [...selectedGroup].sort(() => 0.5 - Math.random());
    const selectedMembers = shuffledMembers.slice(0, memberCount);

    return {
        song,
        members: selectedMembers,
        text: `${song} / ${selectedMembers.map(m => m.name).join(", ")}`
    };
}
