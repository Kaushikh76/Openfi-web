"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLink({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === `/docs/${slug}`;

  return (
    <Link
      href={`/docs/${slug}`}
      className={`block rounded-xl px-3.5 py-2.5 text-[13px] leading-snug transition-all duration-150 ${
        isActive
          ? "bg-[#e7f0ff] text-[#0e4db8] font-semibold shadow-[inset_3px_0_0_#0e4db8,0_5px_16px_rgba(18,62,134,0.08)]"
          : "text-slate-700 hover:bg-[#edf4ff] hover:text-[#0e4db8]"
      }`}
    >
      {title}
    </Link>
  );
}
