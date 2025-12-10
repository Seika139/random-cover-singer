import ClientPage from "@/components/ClientPage";
import { Metadata } from "next";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const params = await searchParams;
  const song = params.s as string;
  const members = params.m as string;

  const title = song && members
    ? `セトリ予想: ${song} / ${members.split(',').length}人`
    : "セトリ予想メーカー";

  const description = "MOIW2025のセトリと歌唱メンバーを勝手に予想します！";

  // Construct absolute URL for OG image
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const ogUrl = new URL("/api/og", baseUrl);

  if (song) ogUrl.searchParams.set("s", song);
  if (members) ogUrl.searchParams.set("m", members);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: {
        url: ogUrl.toString(),
        alt: title,
      },
    },
  };
}

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="min-h-screen w-full bg-black/50"> {/* Overlay for readability */}
        <ClientPage />
      </div>
    </main>
  );
}
