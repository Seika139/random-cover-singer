"use client";

import { useState, useEffect, Suspense } from "react";
import { generateSetlist, SetlistResult } from "@/utils/generator";
import { useRouter, useSearchParams } from "next/navigation";
import { ALL_MEMBERS, SONGS, MEMBERS_GROUP_A, MEMBERS_GROUP_B, Member } from "@/data/master";

// 最大メンバー数を考慮した高さを定義 (例: 5人分の高さ + 隙間)
// メンバー名の表示エリアの高さ固定のために使用
const MAX_MEMBER_COUNT = 5;
const MEMBER_ITEM_HEIGHT_CLASS = 'h-8'; // メンバー名1人分の高さ (px-4 py-1 text-lg で約 h-8)
const MEMBER_GAP_CLASS = 'gap-2'; // メンバー間の隙間 (gap-2)

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
        // 1人からMAX_MEMBER_COUNT人まで
        const memberCount = Math.floor(Math.random() * MAX_MEMBER_COUNT) + 1;
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
        ? `#MOIW2025セトリ予想メーカー の予想結果！\n\n🎵 ${result.song}\n🎤 ${result.members.map(m => m.name.replace(/\s+/g, '')).join('、')} \n\n#MOIW2025セトリ予想\n\n`
        : "";

    // Helper to determine text color based on background luminance
    const getTextColor = (hexColor: string) => {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? "black" : "white";
    };

    // メンバーリストの固定高さを計算: (高さ * 最大数) + (隙間 * (最大数 - 1))
    // tailwind.config.js で h-48 があればそれを使用するか、カスタム値が必要
    // h-8 * 5 + gap-2 * 4 = 40px * 5 + 8px * 4 = 200px + 32px = 232px
    // tailwind の h-60 (240px) くらいに設定して余裕を持たせる
    const MEMBER_LIST_HEIGHT_CLASS = 'h-60';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                MOIW2025
                {/* 狭い画面でのみ改行を強制する */}
                <br className="sm:hidden" />
                {/* 広い画面でのみ半角スペースを挿入する */}
                <span className="hidden sm:inline">&nbsp;</span>
                セトリ予想メーカー
            </h1>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl w-full max-w-md border border-white/20">
                {/* 1. UIの縦の長さの一定化と中央表示のための固定高さとflexの設定 */}
                <div
                    className={`mb-8 transition-all duration-300 ${isAnimating ? 'scale-95' : 'animate-in fade-in zoom-in duration-500'
                        } flex flex-col justify-center h-[340px]`} // 適切な高さ(例: h-[340px])を設定
                >
                    {displayResult ? (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-gray-200 uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                歌唱する曲は...
                            </p>
                            {/* 3. 歌唱する曲が2行に折り返す場合への対応: min-h-とフォントサイズ変更 */}
                            <h2 className="text-2xl min-h-[56px] flex items-center justify-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                {displayResult.song}
                            </h2>

                            <div className="my-3 h-px bg-white/20 w-3/4" />

                            <p className="text-gray-200 uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                歌唱メンバーは...
                            </p>
                            {/* メンバーリストの固定高さと、中央寄せのflex設定 */}
                            <div className={`flex flex-col items-center ${MEMBER_GAP_CLASS} w-full ${MEMBER_LIST_HEIGHT_CLASS} justify-center`}>
                                {/* メンバー数が少ない場合、上に詰まるのを防ぐために、固定数の空のダミー要素を追加 */}
                                {displayResult.members.map((member, i) => (
                                    <span
                                        key={i}
                                        // 4. 歌唱メンバーの UI で文字の周りのpadding を若干小さく
                                        className={`px-4 py-1 rounded-full font-bold text-lg shadow-md w-full max-w-[240px] ${MEMBER_ITEM_HEIGHT_CLASS}`}
                                        style={{
                                            backgroundColor: member.color,
                                            color: getTextColor(member.color)
                                        }}
                                    >
                                        {member.name}
                                    </span>
                                ))}
                                {/* メンバー数がMAX_MEMBER_COUNT未満の場合、空の要素で埋めて高さを一定に保ち、歌唱メンバーを中央寄せにする */}
                                {Array.from({ length: MAX_MEMBER_COUNT - displayResult.members.length }).map((_, i) => (
                                    <div key={`dummy-${i}`} className={`w-full max-w-[240px] ${MEMBER_ITEM_HEIGHT_CLASS} invisible`}>
                                        {/* ダミーのスペース */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // 結果がない場合の領域も高さを一定に保つ
                        <div className="p-8 border-2 border-dashed border-white/30 rounded-lg h-full flex items-center justify-center">
                            <p className="text-gray-400">ボタンを押して予想しよう！</p>
                        </div>
                    )}
                </div>

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
                        {/* 2. Twitter でシェアするボタンを抽選中は押下できないように: aタグをbuttonに変更しdisabledを適用 */}
                        <button
                            onClick={() => {
                                // 抽選中でなければシェアURLに遷移
                                if (!isAnimating) {
                                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener noreferrer');
                                }
                            }}
                            disabled={isAnimating}
                            className={`w-full py-2 bg-black text-white rounded-lg font-bold transition-colors ${isAnimating
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gray-900 hover:scale-105 active:bg-gray-800'
                                }`}
                        >
                            X (Twitter) でシェア
                        </button>
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
