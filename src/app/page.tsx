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

  const description = "次のライブのセトリと歌唱メンバーを勝手に予想します！";

  // Constuct absolute URL for OG image
  const ogUrl = new URL("/api/og", "http://localhost:3000"); // Fallback base
  if (process.env.VERCEL_URL) {
    ogUrl.hostname = process.env.VERCEL_URL;
    ogUrl.protocol = "https";
  }

  if (song) ogUrl.searchParams.set("s", song);
  if (members) ogUrl.searchParams.set("m", members);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      <ClientPage />
    </main>
  );
}
