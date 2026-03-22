import { getDocGroups } from "@/lib/docs";
import SidebarLink from "@/components/SidebarLink";
import Image from "next/image";
import Link from "next/link";
import styles from "./docs.module.css";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const groups = getDocGroups();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logoHeader}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/openfi-logo.svg"
              alt="Openfi"
              width={115}
              height={34}
              className={styles.logo}
            />
          </Link>
          <span className={styles.docsTag}>Docs</span>
        </div>

        <nav className={styles.nav}>
          {groups.map((group) => (
            <div key={group.name} className={styles.group}>
              <p className={styles.groupTitle}>{group.name}</p>
              {group.docs.map((doc) => (
                <SidebarLink key={doc.slug} slug={doc.slug} title={doc.title} />
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.footer}>
          <Link href="/" className={styles.backLink}>
            ← Back to home
          </Link>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <div className={styles.topBarMeta}>
            <span className={styles.topBarDot} aria-hidden="true" />
            <div className={styles.topBarTitleWrap}>
              <p className={styles.topBarText}>Openfi Documentation</p>
              <p className={styles.topBarSubText}>Guides, APIs, standards, and examples</p>
            </div>
          </div>
          <div className={styles.topBarActions}>
            <Link href="/demo" className={styles.topBarLink}>
              Demo
            </Link>
            <Link href="/" className={styles.topBarLinkPrimary}>
              Home
            </Link>
          </div>
        </div>
        <div className={styles.content}>
          <section className={styles.articleShell}>
            <article className={styles.articleSurface}>{children}</article>
          </section>
        </div>
      </main>
    </div>
  );
}
