import { ImageResponse } from 'next/og';
import { ALL_MEMBERS } from '@/data/master';

// Edge Runtimeを使用（推奨）
export const runtime = 'edge';

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
            // Simple heuristic
            if (!hexColor || !hexColor.startsWith('#') || hexColor.length !== 7) return 'white';

            try {
                const r = parseInt(hexColor.slice(1, 3), 16);
                const g = parseInt(hexColor.slice(3, 5), 16);
                const b = parseInt(hexColor.slice(5, 7), 16);
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
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                            position: 'relative',
                            color: 'white',
                        }}
                    >
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

                        {/* コンテンツ */}
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
                                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                letterSpacing: '2px',
                            }}>セトリ予想メーカー</div>
                            <div style={{
                                display: 'flex',
                                fontSize: 32,
                                opacity: 0.95,
                                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                letterSpacing: '1px',
                            }}>MOIW2025のセトリを予想しよう！</div>
                        </div>
                    </div>
                ),
                {
                    width: 1200,
                    height: 630,
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
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                        position: 'relative',
                        color: 'white',
                        padding: '40px 80px',
                    }}
                >
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

                    {/* コンテンツ */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 10,
                        width: '100%',
                    }}>
                        <div
                            style={{
                                display: 'flex',
                                fontSize: 28,
                                letterSpacing: 6,
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: 30,
                                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            }}
                        >
                            #MOIW2025セトリ予想メーカー
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                fontSize: 80,
                                fontWeight: 900,
                                color: 'white',
                                marginBottom: 50,
                                lineHeight: 1.1,
                                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                textAlign: 'center',
                                letterSpacing: '2px',
                            }}
                        >
                            {song.length > 20 ? song.substring(0, 20) + '...' : song}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
                            {members.map((member, i) => {
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
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                                            textAlign: 'center',
                                            minWidth: 320,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            border: '2px solid rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        {member}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
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
