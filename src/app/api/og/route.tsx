import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // ?s=...&m=...
        const song = searchParams.get('s') || searchParams.get('title');
        const membersParam = searchParams.get('m');
        const members = membersParam ? membersParam.split(',') : [];

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
                        <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 20 }}>Setlist Predictor</div>
                        <div style={{ fontSize: 30, opacity: 0.8 }}>What song will they play?</div>
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
                            textTransform: 'uppercase',
                            letterSpacing: 4,
                            color: '#e2e8f0',
                            marginBottom: 30,
                        }}
                    >
                        Tonight's Setlist
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
                        {members.map((member, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '10px 30px',
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 50,
                                    fontSize: 30,
                                    fontWeight: 600,
                                }}
                            >
                                {member}
                            </div>
                        ))}
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
