import Link from "next/link";

export function DeployButton() {
  return (
    <Link
      href="/deploy"
      className="block h-11 w-full border border-orange-500/70 bg-orange-500/20 text-center shadow-[0_0_18px_rgba(249,115,22,0.22)] active:scale-[0.99]"
    >
      <p className="pt-1.5 text-lg font-black uppercase tracking-[0.22em] text-orange-200">
        Deploy
      </p>
      <p className="text-[8px] font-black uppercase tracking-[0.18em] text-orange-500">
        Select raid location
      </p>
    </Link>
  );
}
