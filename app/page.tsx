import HomePage from "@/components/pages/home-page";
import Footer from "@/components/templates/footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen pt-8 gap-16 sm:pt-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full flex items-center justify-center flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}
