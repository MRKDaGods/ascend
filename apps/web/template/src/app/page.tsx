import styles from "./page.module.css";
import Link from 'next/link';


function Home() {
  return (
    <div className={styles.page}>
      <p>Integrate here, guyss!</p>
      <Link href="/chat">
                <button>Go to Chat</button>
            </Link>
      
    </div>
  );
}

export default Home;