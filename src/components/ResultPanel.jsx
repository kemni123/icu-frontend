const KEY_PARAMS = [
  { k: "apache_ii",   l: "APACHE II",   u: ""       },
  { k: "sofa",        l: "SOFA",        u: ""       },
  { k: "lactate",     l: "Lactate",     u: "mmol/L" },
  { k: "pf_ratio",    l: "P/F Ratio",   u: "mmHg"   },
  { k: "creatinine",  l: "Creatinine",  u: "mg/dL"  },
  { k: "bp_systolic", l: "BP Systolic", u: "mmHg"   },
];

export default function ResultPanel({ result, formData }) {
  const usedParams    = KEY_PARAMS.filter(x => formData[x.k]);
  const circumference = 2 * Math.PI * 38;

  return (
    <div id="result-panel" className="mt-8 animate-fade-up">
      <div className="result-card" style={{ border: `2px solid ${result.color}33` }}>

        {/* Top colour stripe */}
        <div
          className="h-1.5"
          style={{ background: `linear-gradient(90deg, ${result.color}, ${result.color}88)` }}
        />

        <div className="p-7">

          {/* ── Header row ── */}
          <div className="flex justify-between items-start flex-wrap gap-5">
            <div>
              <p className="text-[11px] font-bold text-icu-muted uppercase tracking-widest mb-2">
                Clinical Scoring Estimate
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{result.icon}</span>
                <h2 className="text-3xl font-bold leading-none" style={{ color: result.color }}>
                  {result.label}
                </h2>
              </div>
              {formData.patient_name && (
                <div className="mt-2 text-[13px] text-icu-muted bg-icu-bg px-3 py-1.5 rounded-lg inline-block">
                  Patient: <strong className="text-icu-text">{formData.patient_name}</strong>
                </div>
              )}
              {result.patientId && (
                <div className="mt-1.5 text-[11px] text-icu-muted bg-icu-bg px-3 py-1 rounded-lg inline-block">
                  🗄️ Saved to DB &nbsp;·&nbsp;
                  <span className="font-mono text-[10px]">{result.patientId}</span>
                </div>
              )}
            </div>

            {/* Circular gauge */}
            <div className="text-center shrink-0">
              <svg width="92" height="92" viewBox="0 0 92 92">
                <circle cx="46" cy="46" r="38" fill="none" stroke="#eef1f4" strokeWidth="9" />
                <circle
                  cx="46" cy="46" r="38" fill="none"
                  stroke={result.color} strokeWidth="9"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - result.pct / 100)}
                  strokeLinecap="round"
                  style={{
                    transform: "rotate(-90deg)", transformOrigin: "center",
                    transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)",
                    filter: `drop-shadow(0 0 6px ${result.color}55)`,
                  }}
                />
                <text x="46" y="51" textAnchor="middle"
                  fontSize="18" fontWeight="700" fill={result.color}
                  fontFamily="'DM Mono', monospace">
                  {result.pct}%
                </text>
              </svg>
              <p className="text-[11px] text-icu-muted mt-1 font-medium">Risk Score</p>
            </div>
          </div>

          {/* ── Risk bar ── */}
          <div className="mt-5">
            <div className="flex justify-between text-[11px] text-icu-muted mb-1 font-medium">
              <span>🟢 Low</span>
              <span>🟡 Moderate</span>
              <span>🟠 High</span>
              <span>🔴 Critical</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-[1200ms] ease-out"
                style={{
                  width: `${result.pct}%`,
                  background: `linear-gradient(90deg, #00b894, ${result.color})`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10.5px] text-slate-300 mt-1">
              <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
            </div>
          </div>

          {/* ── Advisory box ── */}
          <div
            className="mt-5 px-4 py-3.5 rounded-r-xl text-sm text-icu-text leading-relaxed"
            style={{
              background:  `${result.color}0d`,
              borderLeft:  `4px solid ${result.color}`,
            }}
          >
            {result.advice}
          </div>

          {/* ── XGBoost Model Prediction ── */}
          {result.modelPrediction !== undefined && (
            <div
              className="mt-5 p-4 rounded-xl border"
              style={{
                background:  result.modelPrediction === 1 ? '#fdecea' : '#e0faf4',
                borderColor: result.modelPrediction === 1 ? '#c0392b44' : '#00b89444',
              }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-wider mb-1"
                style={{ color: result.modelPrediction === 1 ? '#c0392b' : '#00b894' }}
              >
                🤖 XGBoost Model Prediction
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: result.modelPrediction === 1 ? '#c0392b' : '#00b894' }}
              >
                {result.modelPrediction === 1 ? '⚠️ High Mortality Risk' : '✅ Likely to Survive'}
              </p>

              {result.modelProbability !== null && result.modelProbability !== undefined && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-icu-muted mb-1">
                    <span>Mortality Probability</span>
                    <span
                      className="font-bold"
                      style={{ color: result.modelPrediction === 1 ? '#c0392b' : '#00b894' }}
                    >
                      {(result.modelProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${result.modelProbability * 100}%`,
                        background: result.modelPrediction === 1
                          ? 'linear-gradient(90deg, #e17055, #c0392b)'
                          : 'linear-gradient(90deg, #00b894, #00836a)',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Key params ── */}
          {usedParams.length > 0 && (
            <div className="mt-5">
              <p className="text-[11px] font-bold text-icu-muted uppercase tracking-wider mb-2.5">
                Key Parameters Used
              </p>
              <div className="flex flex-wrap gap-2">
                {usedParams.map(x => (
                  <span
                    key={x.k}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium
                               bg-primary-10/60 text-primary border border-primary/15
                               hover:scale-[1.03] transition-transform cursor-default"
                  >
                    <span className="font-normal text-icu-muted text-[11px]">{x.l}</span>
                    <strong className="font-mono text-[12.5px]">
                      {formData[x.k]}{x.u ? ` ${x.u}` : ""}
                    </strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Disclaimer + Footer ── */}
        <div className="text-[11.5px] text-icu-muted bg-slate-50 px-7 py-4 border-t border-icu-border leading-relaxed">
          ⚠️ &nbsp;This is a <strong>clinical decision support tool</strong> only.
          Estimates are derived from entered parameters and do not replace clinical judgement.
          Always adhere to institutional protocols and consult the appropriate specialist team.

          {/* ── Footer credits ── */}
          <div className="mt-3 pt-3 border-t border-icu-border text-center space-y-1">
            <p className="text-[11px] font-medium text-icu-label">
              🏛️ This project is sponsored by <strong>UP CST</strong>
            </p>
            <p className="text-[11px] font-medium text-icu-label">
              🎓 Work Dedicated to <strong>DS Yadav Sir</strong>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}