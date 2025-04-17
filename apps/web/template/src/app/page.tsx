import styles from "./page.module.css";
import Link from 'next/link';
import SidebarPreview from "./chat/components/SidebarPreview";
import { useEffect } from "react";

function Home() {
  return (
    <div className={styles.page}>
      <p>Integrate here, guyss!</p>
      <Link href="/chat">
        <button>Go to Chat</button>
      </Link>
      {/* trying akenaha fel feed */}
      <SidebarPreview />
    </div>
  );
}

export default Home;