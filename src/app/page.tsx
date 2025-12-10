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
    ? `Setlist: ${song} by ${members.split(',').length} members`
    : "Setlist Predictor";

  const description = "Predict the next live setlist and performers!";

  // Constuct absolute URL for OG image
  // In production, use process.env.NEXT_PUBLIC_URL or similar. 
  // For local/preview, relative URL might work if supported or use vercel url.
  // We'll assume relative for now or standard next metadata resolution.
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
