import HomePage from "@/components/templates/home-page";
import { Github, Globe, Twitter } from "lucide-react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <HomePage />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://lndev.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe />
          Built by LN
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://x.com/ln_dev7"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter />
          Twitter (X)
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/ln-dev7/cotocowind"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          GitHub
        </a>
      </footer>
    </div>
  );
}
