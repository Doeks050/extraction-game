type PanelProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
};

export function Panel({
  title,
  children,
  className = "",
  titleClassName = "text-zinc-500",
}: PanelProps) {
  return (
    <section className={`border border-zinc-800 bg-zinc-950/86 p-3 ${className}`}>
      {title ? (
        <p
          className={`mb-2 text-[9px] font-black uppercase tracking-[0.2em] ${titleClassName}`}
        >
          {title}
        </p>
      ) : null}
      {children}
    </section>
  );
}
