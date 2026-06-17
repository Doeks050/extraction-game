import Link from "next/link";

const navItems = [
  { label: "Hideout", href: "/" },
  { label: "Stash", href: "/stash" },
  { label: "Loadout", href: "/loadout" },
  { label: "Market", href: "/market" },
  { label: "Tasks", href: "/tasks" },
];

export function BottomNav() {
  return (
    <nav className="grid h-16 grid-cols-5 border-t border-zinc-800 bg-black">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center justify-center border-r border-zinc-900 px-1 text-[9px] font-black uppercase tracking-[0.12em] text-zinc-500 last:border-r-0 active:bg-orange-500/10 active:text-orange-400"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
