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
      className={`block rounded-lg px-3 py-2 text-[13px] leading-snug transition-all ${
        isActive
          ? "bg-[#e8f0ff] text-[#0e4db8] font-semibold shadow-[inset_3px_0_0_#0e4db8]"
          : "text-slate-700 hover:bg-[#eff4ff] hover:text-[#0e4db8]"
      }`}
    >
      {title}
    </Link>
  );
}
