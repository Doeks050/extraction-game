export function DeployButton() {
  return (
    <button
      type="button"
      className="h-14 w-full border border-orange-500/70 bg-orange-500/20 text-center shadow-[0_0_18px_rgba(249,115,22,0.22)] active:scale-[0.99]"
    >
      <p className="text-2xl font-black uppercase tracking-[0.22em] text-orange-200">
        Deploy
      </p>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
        Location select comes next
      </p>
    </button>
  );
}
