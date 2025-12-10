"use client";

import { useState, useEffect, Suspense } from "react";
import { generateSetlist, SetlistResult } from "@/utils/generator";
import { useRouter, useSearchParams } from "next/navigation";
import { ALL_MEMBERS } from "@/data/master";

function ClientPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [result, setResult] = useState<SetlistResult | null>(null);

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

            setResult({
                song: s,
                members: resultMembers,
                text: `${s} / ${memberNames.join(", ")}`
            });
        }
    }, [searchParams]);

    const handlePredict = () => {
        const newResult = generateSetlist();
        setResult(newResult);

        // Update URL without full reload
        const params = new URLSearchParams();
        params.set("s", newResult.song);
        params.set("m", newResult.members.map(m => m.name).join(","));
        router.replace(`/?${params.toString()}`);
    };

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = result ? `セトリを予想しました！ ${result.text} #セトリ予想` : "";

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
                {result ? (
                    <div className="mb-8 animate-in fade-in zoom-in duration-300">
                        <p className="text-gray-200 uppercase tracking-wider mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            歌唱する曲は...
                        </p>
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            {result.song}
                        </h2>

                        <div className="my-6 h-px bg-white/20" />

                        <p className="text-gray-200 uppercase tracking-wider mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            歌唱メンバーは...
                        </p>
                        <div className="flex flex-col items-center gap-3 w-full">
                            {result.members.map((member, i) => (
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
                    className="w-full py-4 text-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:shadow-lg shadow-pink-500/50"
                >
                    セトリ予想を生成！
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
