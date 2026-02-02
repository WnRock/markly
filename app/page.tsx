import packageJson from "@/package.json";
import ThemeToggle from "./components/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight">Markly</span>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Markly
          </h1>
          <a
            href="/start"
            className="rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition hover:opacity-90"
          >
            Start
          </a>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-6 py-6 text-sm text-foreground/60">
        Version {packageJson.version}
      </footer>
    </div>
  );
}
