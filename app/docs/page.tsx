import { getFirstSlug } from "@/lib/docs";
import { redirect } from "next/navigation";

export default function DocsIndex() {
  const slug = getFirstSlug();
  if (slug) redirect(`/docs/${slug}`);
  return null;
}
