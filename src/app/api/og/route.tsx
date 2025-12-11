import { ImageResponse } from 'next/og';
import { ALL_MEMBERS } from '@/data/master';

// Edge Runtimeを使用（推奨）
export const runtime = 'edge';

function splitMembers(members: string[]) {
    const MAX_PER_ROW = 4;
    const total = members.length;

    if (total <= MAX_PER_ROW) return [members];

    const rows = Math.ceil(total / MAX_PER_ROW);

    const base = Math.floor(total / rows);
    let extra = total % rows;

    const result: string[][] = [];
    let index = 0;

    for (let i = 0; i < rows; i++) {
        const count = base + (extra > 0 ? 1 : 0);
        extra = Math.max(0, extra - 1);

        result.push(members.slice(index, index + count));
        index += count;
    }

    return result;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // ?s=...&m=...
        const song = searchParams.get('s') || searchParams.get('title');
        const membersParam = searchParams.get('m');
        let members = membersParam ? membersParam.split(',') : [];

        // 背景画像をfetchで読み込み（Edge Runtime対応）
        const bgUrl = new URL('/bg.png', request.url).toString();
        let bgBase64 = '';

        try {
            const bgResponse = await fetch(bgUrl);
            if (bgResponse.ok) {
                const bgBuffer = await bgResponse.arrayBuffer();
                const base64 = Buffer.from(bgBuffer).toString('base64');
                bgBase64 = `data:image/png;base64,${base64}`;
            }
        } catch (error) {
            console.warn('Background image not found, using fallback color');
        }

        // Helper to get text color based on background
        const getTextColor = (hexColor: string) => {
            if (!hexColor || !hexColor.startsWith('#')) return 'white';

            try {
                // アルファチャンネル付き（9文字）と通常（7文字）の両方に対応
                const hex = hexColor.length === 9 ? hexColor.slice(1, 7) : hexColor.slice(1, 7);

                const r = parseInt(hex.slice(0, 2), 16);
                const g = parseInt(hex.slice(2, 4), 16);
                const b = parseInt(hex.slice(4, 6), 16);

                // YIQ計算式で明るさを判定
                const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                return (yiq >= 128) ? 'black' : 'white';
            } catch (e) {
                return 'white';
            }
        };

        if (!song) {
            // Fallback for default OGP
            return new ImageResponse(
                (
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            position: 'relative',
                            backgroundImage: bgBase64 ? `url(${bgBase64})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* グラデーションオーバーレイ */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(234, 186, 102, 0.85) 0%, rgba(142, 162, 75, 0.85) 25%, rgba(75, 147, 162, 0.85) 50%, rgba(169, 59, 177, 0.85) 75%, rgba(229, 34, 128, 0.75) 100%)',
                            display: 'flex',
                        }} />

                        {/* コンテンツ */}
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                        }}>
                            {/* 装飾的な円形要素 */}
                            <div style={{
                                position: 'absolute',
                                top: '-100px',
                                right: '-100px',
                                width: '400px',
                                height: '400px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                display: 'flex',
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: '-150px',
                                left: '-150px',
                                width: '500px',
                                height: '500px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                            }} />

                            {/* テキストコンテンツ */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                zIndex: 10,
                            }}>
                                <div style={{
                                    display: 'flex',
                                    fontSize: 70,
                                    fontWeight: 900,
                                    marginBottom: 20,
                                    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                    letterSpacing: '2px',
                                }}>#MOIW2025セトリ予想メーカー</div>
                                <div style={{
                                    display: 'flex',
                                    fontSize: 32,
                                    opacity: 0.95,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                                    letterSpacing: '1px',
                                }}>MOIW2025のセトリを予想しよう！</div>
                            </div>
                        </div>
                    </div>
                ),
                {
                    width: 1200,
                    height: 630,
                    emoji: 'twemoji',
                    headers: {
                        'Cache-Control': 'public, max-age=31536000, immutable',
                    },
                },
            );
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        position: 'relative',
                        backgroundImage: bgBase64 ? `url(${bgBase64})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* グラデーションオーバーレイ */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(234, 186, 102, 0.85) 0%, rgba(142, 162, 75, 0.85) 25%, rgba(75, 147, 162, 0.85) 50%, rgba(169, 59, 177, 0.85) 75%, rgba(229, 34, 128, 0.75) 100%)',
                        display: 'flex',
                    }} />

                    {/* コンテンツ */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        padding: '40px 80px',
                    }}>
                        {/* 装飾的な円形要素 */}
                        <div style={{
                            position: 'absolute',
                            top: '-100px',
                            right: '-100px',
                            width: '400px',
                            height: '400px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '-150px',
                            left: '-150px',
                            width: '500px',
                            height: '500px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                        }} />

                        {/* テキストとメンバー */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 10,
                            width: '100%',
                            maxHeight: '100%',
                        }}>
                            <div
                                style={{
                                    display: 'flex',
                                    fontSize: members.length > 4 ? 24 : 28,
                                    letterSpacing: members.length > 4 ? 4 : 6,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    marginBottom: members.length > 4 ? 20 : 30,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                                }}
                            >
                                #MOIW2025セトリ予想メーカー
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    fontSize: members.length > 4 ? 60 : 80,
                                    fontWeight: 900,
                                    color: 'white',
                                    marginBottom: members.length > 4 ? 30 : 50,
                                    lineHeight: 1.1,
                                    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                    textAlign: 'center',
                                    letterSpacing: '2px',
                                }}
                            >
                                {song.length > 20 ? song.substring(0, 20) + '...' : song}
                            </div>

                            {/* メンバー一覧（行分割版） */}
                            {(() => {
                                const limited = members.slice(0, 9); // 最大9人まで OGP に反映
                                const rows = splitMembers(limited);

                                return (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 20,
                                        width: '100%',
                                    }}>
                                        {rows.map((row, rowIndex) => (
                                            <div key={rowIndex} style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: 20,
                                            }}>
                                                {row.map((member, i) => {
                                                    const masterMember = ALL_MEMBERS.find(m => m.name === member);
                                                    const bgColor = masterMember ? masterMember.color : 'rgba(255,255,255,0.25)';
                                                    const textColor = masterMember ? getTextColor(masterMember.color) : 'white';

                                                    return (
                                                        <div
                                                            key={i}
                                                            style={{
                                                                padding: '12px 45px',
                                                                backgroundColor: bgColor,
                                                                color: textColor,
                                                                borderRadius: 50,
                                                                fontSize: 38,
                                                                fontWeight: 700,
                                                                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                                                border: '2px solid rgba(255,255,255,0.3)',
                                                            }}
                                                        >
                                                            {member}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}

                                        {/* 10人目以降は "+X人" 表示 */}
                                        {members.length > limited.length && (
                                            <div style={{
                                                marginTop: 10,
                                                padding: '8px 30px',
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                borderRadius: 50,
                                                fontSize: 28,
                                                fontWeight: 700,
                                                border: '2px solid rgba(255,255,255,0.3)',
                                            }}>
                                                +{members.length - limited.length} 人
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                emoji: 'twemoji',
                headers: {
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            },
        );
    } catch (e: any) {
        console.error('OG Image generation error:', e);
        return new Response(`Failed to generate the image: ${e.message}`, {
            status: 500,
        });
    }
}
