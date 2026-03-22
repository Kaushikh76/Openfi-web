import Image from "next/image";
import Link from "next/link";

// Replace this with your actual YouTube video ID
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";

export default function DemoPage() {
  return (
    <div
      className="w-screen h-screen flex overflow-hidden"
      style={{ backgroundColor: "#f5f4ef" }}
    >
      {/* Left panel */}
      <div
        className="flex flex-col items-center justify-center gap-6"
        style={{
          width: "40%",
          backgroundColor: "#1a55d4",
          padding: "3rem 3rem",
        }}
      >
        <Image
          src="/openfi-logo.svg"
          alt="Openfi logo"
          width={180}
          height={50}
          priority
          className="object-contain"
        />
        <p
          className="text-white text-sm font-medium tracking-widest uppercase"
          style={{ opacity: 0.75, letterSpacing: "0.2em" }}
        >
          demo
        </p>
        <Link
          href="/"
          className="mt-8 text-white text-xs underline opacity-50 hover:opacity-80 transition-opacity"
        >
          ← Back to home
        </Link>
      </div>

      {/* Right panel — YouTube embed */}
      <div
        className="flex items-center justify-center"
        style={{ width: "60%", padding: "2rem" }}
      >
        <div
          className="w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: "16/9", maxHeight: "70vh" }}
        >
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=0&rel=0`}
            title="Openfi Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
