export const SONGS = [
    "アイドル",
    "可愛くてごめん",
    "KICK BACK",
    "怪獣の花唄",
    "酔いどれ知らず",
    "唱",
    "青のすみか",
    "オトナブルー",
    "強風オールバック",
    "粛聖!! ロリ神レクイエム☆",
];

export interface Member {
    name: string;
    color: string;
}

// グループA: アイドルマスター
export const MEMBERS_GROUP_A: Member[] = [
    { name: "如月 千早", color: "#2743d2ff" },
    { name: "星井 美希", color: "#b4e04bff" },
    { name: "四条 貴音", color: "#a6126aff" },
    { name: "三浦 あずさ", color: "#9238beff" },
];

// グループB: その他
export const MEMBERS_GROUP_B: Member[] = [
    { name: "イブ", color: "#c084fc" },
    { name: "フランク", color: "#fb923c" },
    { name: "グレース", color: "#f472b6" },
    { name: "ハイジ", color: "#2dd4bf" },
    { name: "アイバン", color: "#9ca3af" },
    { name: "ジュディ", color: "#a3e635" },
];

// すべてのメンバー（OGP生成時の検索用）
export const ALL_MEMBERS: Member[] = [...MEMBERS_GROUP_A, ...MEMBERS_GROUP_B];
