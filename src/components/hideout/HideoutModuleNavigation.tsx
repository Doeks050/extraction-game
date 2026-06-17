import Link from "next/link";

export function HideoutModuleNavigation() {
  return (
    <Link
      href="/"
      className="block border border-zinc-800 bg-zinc-950 px-3 py-3 text-center text-[10px] font-black uppercase tracking-[0.18em] text-zinc-300 active:border-orange-500/60 active:text-orange-300"
    >
      Back to Hideout
    </Link>
  );
}
