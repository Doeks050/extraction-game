type DevStatCardProps = {
  label: string;
  value: string | number;
};

export function DevStatCard({ label, value }: DevStatCardProps) {
  return (
    <div className="border border-zinc-800 bg-black/50 p-2 text-center">
      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-orange-400">{value}</p>
    </div>
  );
}
