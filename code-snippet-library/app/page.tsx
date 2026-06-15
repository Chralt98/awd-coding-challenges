import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Code Snippet Library</h1>
      <p>
        Explore a collection of useful code snippets for various programming
        languages and frameworks.
      </p>
      <Link href="/snippets">Browse Snippets</Link>
    </div>
  );
}
