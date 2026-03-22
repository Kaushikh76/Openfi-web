import { getAllSlugs, getDocContent, getDocGroups } from "@/lib/docs";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const content = getDocContent(slug);
  if (!content) notFound();

  return (
    <article className="prose docs-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const groups = getDocGroups();
  const doc = groups.flatMap((g) => g.docs).find((d) => d.slug === slug);
  return { title: doc ? `${doc.title} — Openfi Docs` : "Openfi Docs" };
}
