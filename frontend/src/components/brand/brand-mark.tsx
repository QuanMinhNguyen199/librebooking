export function BrandMark({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return <div className="flex items-center gap-3">
    <div className="relative grid h-10 w-10 place-items-center bg-[#df1f2d] text-sm font-black text-white [clip-path:polygon(50%_0,95%_24%,82%_82%,50%_100%,18%_82%,5%_24%)]">TG</div>
    {!compact && <div><p className={`brand-font text-lg font-bold tracking-wide ${inverse ? "text-white" : "text-[#171717]"}`}>THEHE<span className="text-[#df1f2d]">GEO</span></p><p className={`text-[11px] ${inverse ? "text-white/45" : "text-slate-400"}`}>Resource workspace</p></div>}
  </div>;
}
