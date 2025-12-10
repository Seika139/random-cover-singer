import { ImageResponse } from 'next/og';
import { MEMBERS } from '@/data/master';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // ?s=...&m=...
        const song = searchParams.get('s') || searchParams.get('title');
        const membersParam = searchParams.get('m');
        let members = membersParam ? membersParam.split(',') : [];

        // Helper to get text color based on background
        const getTextColor = (hexColor: string) => {
            // Simple heuristic: if color starts with certain letters it might be dark/light? 
            // Edge runtime has limitations, so let's do a simple hex parsing if valid.
            // Assuming valid 6-char hex like #afeeee
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
                            backgroundColor: '#1a103d', // Dark purple background
                            color: 'white',
                        }}
                    >
                        <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 20 }}>セトリ予想メーカー</div>
                        <div style={{ fontSize: 30, opacity: 0.8 }}>次のライブのセトリを予想しよう！</div>
                    </div>
                ),
                {
                    width: 1200,
                    height: 630,
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
                        backgroundColor: '#1a103d', // Match the app theme
                        backgroundImage: 'linear-gradient(to bottom right, #111827, #581c87, #4c1d95)',
                        color: 'white',
                        padding: '40px 80px',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 24,
                            letterSpacing: 4,
                            color: '#e2e8f0',
                            marginBottom: 30,
                        }}
                    >
                        今回の曲は...
                    </div>
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 900,
                            background: 'linear-gradient(to right, #22d3ee, #e879f9)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: 50,
                            lineHeight: 1.1,
                            textShadow: '0 4px 10px rgba(0,0,0,0.5)',
                        }}
                    >
                        {song.length > 20 ? song.substring(0, 20) + '...' : song}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20 }}>
                        {members.map((member, i) => {
                            const masterMember = MEMBERS.find(m => m.name === member);
                            const bgColor = masterMember ? masterMember.color : 'rgba(255,255,255,0.2)';
                            const textColor = masterMember ? getTextColor(masterMember.color) : 'white';

                            return (
                                <div
                                    key={i}
                                    style={{
                                        padding: '10px 30px',
                                        backgroundColor: bgColor,
                                        color: textColor,
                                        borderRadius: 50,
                                        fontSize: 30,
                                        fontWeight: 600,
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
            },
        );
    } catch (e: any) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
