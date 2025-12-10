"use client";

import { useState, useEffect } from "react";
import { generateSetlist } from "@/utils/generator";
import { useRouter, useSearchParams } from "next/navigation";

export default function ClientPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [result, setResult] = useState<{ song: string; members: string[]; text: string } | null>(null);

    useEffect(() => {
        const s = searchParams.get("s");
        const m = searchParams.get("m");

        if (s && m) {
            const members = m.split(",");
            setResult({
                song: s,
                members,
                text: `${s} / ${members.join(", ")}`
            });
        }
    }, [searchParams]);

    const handlePredict = () => {
        const newResult = generateSetlist();
        setResult(newResult);

        // Update URL without full reload
        const params = new URLSearchParams();
        params.set("s", newResult.song);
        params.set("m", newResult.members.join(","));
        router.replace(`/?${params.toString()}`);
    };

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = result ? `I predicted the setlist! ${result.text}` : "";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-lg">
                Setlist Predictor
            </h1>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl w-full max-w-md border border-white/20">
                {result ? (
                    <div className="mb-8 animate-in fade-in zoom-in duration-300">
                        <p className="text-sm text-gray-300 uppercase tracking-wider mb-2">Tonight's Song</p>
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
                            {result.song}
                        </h2>

                        <div className="my-6 h-px bg-white/20" />

                        <p className="text-sm text-gray-300 uppercase tracking-wider mb-2">Performed By</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {result.members.map((member, i) => (
                                <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-white font-medium">
                                    {member}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-8 p-8 border-2 border-dashed border-white/30 rounded-lg">
                        <p className="text-gray-400">Press the button to reveal the setlist!</p>
                    </div>
                )}

                <button
                    onClick={handlePredict}
                    className="w-full py-4 text-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:shadow-lg shadow-pink-500/50"
                >
                    Predict Setlist!
                </button>

                {result && (
                    <div className="mt-6 flex flex-col gap-3">
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-900 transition-colors"
                        >
                            Share on X
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
