type PanelProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Panel({ title, children, className = "" }: PanelProps) {
  return (
    <section className={`border border-zinc-800 bg-zinc-950/86 p-3 ${className}`}>
      {title ? (
        <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
          {title}
        </p>
      ) : null}
      {children}
    </section>
  );
}
