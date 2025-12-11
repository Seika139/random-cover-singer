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

        // 日本語フォントを読み込み
        const fontData = await fetch(
            new URL('https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEi75vY0rw-oME.woff', request.url)
        ).then((res) => res.arrayBuffer());

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
                            backgroundColor: '#1a103d',
                            backgroundImage: bgBase64 ? `url(${bgBase64})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            color: 'white',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            fontSize: 60,
                            fontWeight: 'bold',
                            marginBottom: 20,
                            textShadow: '0 4px 8px rgba(0,0,0,0.8)',
                        }}>セトリ予想メーカー</div>
                        <div style={{
                            display: 'flex',
                            fontSize: 30,
                            opacity: 0.9,
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                        }}>MOIW2025のセトリを予想しよう！</div>
                    </div>
                ),
                {
                    width: 1200,
                    height: 630,
                    headers: {
                        'Cache-Control': 'public, max-age=31536000, immutable',
                    },
                    fonts: [
                        {
                            name: 'Noto Sans JP',
                            data: fontData,
                            style: 'normal',
                            weight: 700,
                        },
                    ],
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
                        backgroundColor: '#1a103d',
                        backgroundImage: bgBase64 ? `url(${bgBase64})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: 'white',
                        padding: '40px 80px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 24,
                            letterSpacing: 4,
                            color: '#e2e8f0',
                            marginBottom: 30,
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        歌唱する曲は...
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 80,
                            fontWeight: 900,
                            color: 'white',
                            marginBottom: 50,
                            lineHeight: 1.1,
                            textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.5)',
                            textAlign: 'center',
                        }}
                    >
                        {song.length > 20 ? song.substring(0, 20) + '...' : song}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
                        {members.map((member, i) => {
                            const masterMember = ALL_MEMBERS.find(m => m.name === member);
                            const bgColor = masterMember ? masterMember.color : 'rgba(255,255,255,0.2)';
                            const textColor = masterMember ? getTextColor(masterMember.color) : 'white';

                            return (
                                <div
                                    key={i}
                                    style={{
                                        padding: '10px 40px',
                                        backgroundColor: bgColor,
                                        color: textColor,
                                        borderRadius: 50,
                                        fontSize: 36,
                                        fontWeight: 700,
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                        textAlign: 'center',
                                        minWidth: 300,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {member}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                headers: {
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
                fonts: [
                    {
                        name: 'Noto Sans JP',
                        data: fontData,
                        style: 'normal',
                        weight: 700,
                    },
                ],
            },
        );
    } catch (e: any) {
        console.error('OG Image generation error:', e);
        return new Response(`Failed to generate the image: ${e.message}`, {
            status: 500,
        });
    }
}
