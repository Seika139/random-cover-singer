"use client";

import { useState, useEffect, Suspense } from "react";
import { generateSetlist, SetlistResult } from "@/utils/generator";
import { useRouter, useSearchParams } from "next/navigation";
import { ALL_MEMBERS, SONGS, MEMBERS_GROUP_A, MEMBERS_GROUP_B, Member } from "@/data/master";

function ClientPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [result, setResult] = useState<SetlistResult | null>(null);
    const [displayResult, setDisplayResult] = useState<SetlistResult | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const s = searchParams.get("s");
        const m = searchParams.get("m");

        if (s && m) {
            const memberNames = m.split(",");
            // Reconstruct members with colors from master data
            const resultMembers = memberNames.map(name => {
                const found = ALL_MEMBERS.find(mem => mem.name === name);
                return found || { name, color: "#666" }; // Fallback color
            });

            const newResult = {
                song: s,
                members: resultMembers,
                text: `${s} / ${memberNames.join(", ")}`
            };
            setResult(newResult);
            setDisplayResult(newResult);
        }
    }, [searchParams]);

    // ランダムなメンバーを生成するヘルパー関数
    const generateRandomMembers = (): Member[] => {
        const selectedGroup = Math.random() < 0.5 ? MEMBERS_GROUP_A : MEMBERS_GROUP_B;
        const memberCount = Math.floor(Math.random() * 5) + 1;
        const shuffledMembers = [...selectedGroup].sort(() => 0.5 - Math.random());
        return shuffledMembers.slice(0, memberCount);
    };

    // スロットマシンアニメーション
    const runSlotAnimation = (finalResult: SetlistResult) => {
        const intervals = [30, 30, 30, 30, 50, 50, 80, 80, 120, 200]; // 減速パターン
        let currentStep = 0;
        let animationFrameId: NodeJS.Timeout;

        const animate = () => {
            if (currentStep >= intervals.length) {
                // アニメーション終了
                setDisplayResult(finalResult);
                setResult(finalResult);
                setIsAnimating(false);

                // URL更新
                const params = new URLSearchParams();
                params.set("s", finalResult.song);
                params.set("m", finalResult.members.map(m => m.name).join(","));
                router.replace(`/?${params.toString()}`);
                return;
            }

            // ランダムな曲とメンバーを表示
            const randomSong = SONGS[Math.floor(Math.random() * SONGS.length)];
            const randomMembers = generateRandomMembers();

            setDisplayResult({
                song: randomSong,
                members: randomMembers,
                text: `${randomSong} / ${randomMembers.map(m => m.name).join(", ")}`
            });

            // 次のステップへ
            animationFrameId = setTimeout(() => {
                currentStep++;
                animate();
            }, intervals[currentStep]);
        };

        animate();
    };

    const handlePredict = () => {
        if (isAnimating) return; // 既にアニメーション中なら無視

        setIsAnimating(true);

        // 最終結果を先に生成
        const finalResult = generateSetlist();

        // アニメーション実行
        runSlotAnimation(finalResult);
    };

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = result
        ? `#MOIW2025セトリ予想メーカー の予想結果！\n\n🎵 ${result.song}\n🎤 ${result.members.map(m => m.name.replace(/\s+/g, '')).join('、')} \n\n#MOIW2025セトリ予想\n`
        : "";

    // Helper to determine text color based on background luminance
    const getTextColor = (hexColor: string) => {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? "black" : "white";
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                MOIW2025 セトリ予想メーカー
            </h1>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl w-full max-w-md border border-white/20">
                {displayResult ? (
                    <div
                        className={`mb-8 transition-all duration-300 ${isAnimating ? 'scale-95' : 'animate-in fade-in zoom-in duration-500'
                            }`}
                    >
                        <p className="text-gray-200 uppercase tracking-wider mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            歌唱する曲は...
                        </p>
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            {displayResult.song}
                        </h2>

                        <div className="my-6 h-px bg-white/20" />

                        <p className="text-gray-200 uppercase tracking-wider mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            歌唱メンバーは...
                        </p>
                        <div className="flex flex-col items-center gap-3 w-full">
                            {displayResult.members.map((member, i) => (
                                <span
                                    key={i}
                                    className="px-6 py-2 rounded-full font-bold text-lg shadow-md w-full max-w-[240px]"
                                    style={{
                                        backgroundColor: member.color,
                                        color: getTextColor(member.color)
                                    }}
                                >
                                    {member.name}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-8 p-8 border-2 border-dashed border-white/30 rounded-lg">
                        <p className="text-gray-400">ボタンを押して予想しよう！</p>
                    </div>
                )}

                <button
                    onClick={handlePredict}
                    disabled={isAnimating}
                    className={`w-full py-4 text-xl font-bold text-white transition-all transform rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-pink-500/50 ${isAnimating
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-105 active:scale-95 hover:shadow-lg'
                        }`}
                >
                    {isAnimating ? '抽選中...' : 'セトリ予想を生成！'}
                </button>

                {result && (
                    <div className="mt-6 flex flex-col gap-3">
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-900 transition-colors"
                        >
                            X (Twitter) でシェア
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ClientPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-xl">読み込み中...</div>
            </div>
        }>
            <ClientPageContent />
        </Suspense>
    );
}
