import NORMAL_VALUES from '../constants/normalValues';

const REQUIRED = ["age", "gender"];

export default function SectionCard({ section, isOpen, onToggle, formData, errors, onChange }) {
  const editableFields = section.fields.filter(f => !f.readOnly);
  const filled         = editableFields.filter(f => formData[f.name]).length;
  const allFilled      = filled === editableFields.length;

  const isAutoFilled = (name) =>
    formData[name] && NORMAL_VALUES[name] && formData[name] === NORMAL_VALUES[name];

  return (
    <div className="section-card">

      {/* ── Section Header ── */}
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex justify-between items-center px-5 py-4 cursor-pointer text-left
                    transition-colors duration-100 hover:bg-slate-50/80
                    ${isOpen ? "border-b border-icu-border" : ""}`}
      >
        <div className="flex items-center gap-3">
          {/* Icon badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: section.bg }}
          >
            {section.icon}
          </div>

          <div>
            <div className="text-sm font-semibold text-icu-text leading-tight">
              {section.title}
            </div>
            <div className="text-[11.5px] text-icu-muted mt-0.5 flex items-center gap-1.5">
              <span>{filled} of {editableFields.length} filled</span>
              {allFilled && (
                <span className="text-accent font-semibold">· Complete ✓</span>
              )}
            </div>
          </div>
        </div>

        {/* Right side: dot indicators + chevron */}
        <div className="flex items-center gap-3">
          {filled > 0 && (
            <div className="flex items-center gap-1">
              {editableFields.map((f, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                  style={{ background: formData[f.name] ? section.color : "#d4dce8" }}
                />
              ))}
            </div>
          )}
          <svg
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            className="text-icu-muted shrink-0 transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
          >
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* ── Fields Grid ── */}
      {isOpen && (
        <div className="grid grid-cols-3 gap-4 p-5 pb-6">
          {section.fields.map((field) => {
            const hasErr = !!errors[field.name];
            const isReq  = REQUIRED.includes(field.name);
            const autoF  = isAutoFilled(field.name);
            const inputClass = `field-input${hasErr ? " error" : ""}${autoF ? " auto-filled" : ""}`;

            return (
              <div
                key={field.name}
                className="flex flex-col gap-1.5 min-w-0"
                style={field.span ? { gridColumn: 'span 2' } : {}}
              >
                {/* Label row */}
                <label className="text-[11px] font-semibold text-icu-label uppercase tracking-wide flex items-center flex-wrap gap-1">
                  {field.label}
                  {isReq && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary-10 text-primary uppercase tracking-wider">
                      required
                    </span>
                  )}
                  {field.unit_label && (
                    <span className="text-[11px] text-icu-muted font-normal normal-case tracking-normal ml-0.5">
                      {field.unit_label}
                    </span>
                  )}
                  {autoF && !field.readOnly && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent-bg text-accent uppercase tracking-wider">
                      avg
                    </span>
                  )}
                </label>

                {/* Input */}
                {field.unitOptions ? (
                  <div className="flex gap-1.5">
                    <input
                      type="number" step="any" name={field.name}
                      value={formData[field.name] || ""} onChange={onChange}
                      placeholder={field.placeholder}
                      className={`${inputClass} flex-1`}
                    />
                    <select
                      name="age_unit"
                      value={formData.age_unit || "Years"} onChange={onChange}
                      className="px-2.5 py-2.5 border border-icu-border rounded-lg text-xs bg-slate-50
                                 text-icu-muted outline-none cursor-pointer font-sans shrink-0
                                 focus:border-primary-2 transition-colors"
                    >
                      {field.unitOptions.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                ) : field.type === "select" ? (
                  <select
                    name={field.name} value={formData[field.name] || ""}
                    onChange={onChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {field.options.map(o =>
                      <option key={o.value} value={o.value}>{o.label}</option>
                    )}
                  </select>
                ) : (
                  <input
                    type={field.type} step="any" name={field.name}
                    value={formData[field.name] || ""} onChange={onChange}
                    placeholder={field.placeholder}
                    className={inputClass}
                    readOnly={field.readOnly}
                  />
                )}

                {hasErr && (
                  <span className="text-[11px] text-danger flex items-center gap-1 mt-0.5">
                    ⚠ {errors[field.name]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}