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
          <span className={styles.topBarDot} aria-hidden="true" />
          <p className={styles.topBarText}>Openfi Documentation</p>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
