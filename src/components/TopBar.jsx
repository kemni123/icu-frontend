export default function TopBar({ filledFields, totalFields, progress }) {
  return (
    <div className="bg-gradient-to-br from-primary via-primary-2 to-blue-500 text-white sticky top-0 z-50 shadow-xl shadow-primary/30">
      <div className="max-w-5xl mx-auto px-8 py-4 flex justify-between items-center gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shrink-0 shadow-inner">
            🏥
          </div>
          <div>
            <div className="text-[17px] font-bold tracking-tight leading-tight">
              AURA
            </div>
            <div className="text-[11.5px] text-white/75 mt-0.5 font-normal">
            Analytics for Urgent Risk Assessment
            
            </div>
          </div>
        </div>

        {/* Progress pill */}
        <div className="bg-white/15 backdrop-blur border border-white/25 rounded-xl px-4 py-2 text-right min-w-[155px]">
          <div className="text-[11px] text-white/85 mb-1.5 font-medium">
            {filledFields} / {totalFields} fields &nbsp;·&nbsp;
            <span className="text-[13px] font-bold">{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-teal-300 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}