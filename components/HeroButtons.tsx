import Link from "next/link";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <Link
        href="/docs"
        className="inline-flex min-h-14 min-w-[178px] items-center justify-center rounded-full border border-white/40 bg-white/18 px-8 py-4 text-base font-semibold tracking-[0.01em] text-white shadow-[0_10px_30px_rgba(2,20,58,0.2)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e4db8]"
      >
        Install / Docs
      </Link>
      <Link
        href="/demo"
        className="inline-flex min-h-14 min-w-[150px] items-center justify-center rounded-full border border-[#f4f1eb] bg-[#f4f1eb] px-8 py-4 text-base font-semibold tracking-[0.01em] text-[#0e4db8] shadow-[0_12px_26px_rgba(9,27,66,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e4db8]"
      >
        Demo
      </Link>
    </div>
  );
}
