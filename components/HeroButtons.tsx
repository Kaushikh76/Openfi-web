import Link from "next/link";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <Link
        href="/docs"
        className="rounded-full border border-white/45 bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
      >
        Install / Docs
      </Link>
      <Link
        href="/demo"
        className="rounded-full border border-[#f4f1eb] bg-[#f4f1eb] px-6 py-3 text-sm font-semibold text-[#0e4db8] transition-colors hover:bg-white"
      >
        Demo
      </Link>
    </div>
  );
}
