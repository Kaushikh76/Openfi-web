import Image from "next/image";
import HeroButtons from "@/components/HeroButtons";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.logoWrap}>
          <Image
            src="/openfi-logo.svg"
            alt="Openfi logo"
            width={420}
            height={190}
            priority
            className={styles.logo}
          />
        </div>
        <p className={styles.tagline}>
          Open framework to build realtime web3 agents not skills
        </p>
        <div className={styles.buttonsWrap}>
          <HeroButtons />
        </div>
      </div>
      <div className={styles.flowerWrap} aria-hidden="true">
        <Image
          src="/flower.svg"
          alt="Openfi flower"
          fill
          className={styles.flower}
          priority
        />
      </div>
    </main>
  );
}
