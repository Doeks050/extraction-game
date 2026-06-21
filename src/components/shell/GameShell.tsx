import { SaveStatusPill } from "../state/SaveStatusPill";
import { BottomNav } from "./BottomNav";

type GameShellProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  showSaveStatus?: boolean;
  compactHeader?: boolean;
  titleClassName?: string;
};

export function GameShell({
  title,
  eyebrow = "Operator OS",
  children,
  showSaveStatus = true,
  compactHeader = false,
  titleClassName = "text-zinc-100",
}: GameShellProps) {
  const headerClassName = compactHeader
    ? "h-11 border-b border-zinc-800 bg-zinc-950 px-3 py-2"
    : "h-16 border-b border-zinc-800 bg-zinc-950 px-3 py-2";

  return (
    <main className="game-screen grid-bg flex items-center justify-center text-zinc-100">
      <div className="flex h-full w-full max-w-md flex-col border-x border-zinc-900 bg-black/72">
        <header className={headerClassName}>
          {eyebrow ? (
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-orange-400">
              {eyebrow}
            </p>
          ) : null}
          <div
            className={
              eyebrow
                ? "mt-1 flex items-end justify-between gap-3"
                : "flex h-full items-center justify-between gap-3"
            }
          >
            <h1
              className={`text-xl font-black uppercase leading-none tracking-tight ${titleClassName}`}
            >
              {title}
            </h1>
            {showSaveStatus ? <SaveStatusPill /> : null}
          </div>
        </header>

        <section className="min-h-0 flex-1 overflow-hidden p-3">{children}</section>

        <BottomNav />
      </div>
    </main>
  );
}
