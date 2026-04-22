import { useState } from "react";
import SECTIONS from '../constants/sections';
import NORMAL_VALUES from '../constants/normalValues';
import { calcBMI, estimateMortality, predictFromModel } from '../utils/calculations';
import TopBar from './TopBar.jsx';
import SectionCard from './SectionCard';
import ResultPanel from './ResultPanel';

const REQUIRED = ["age", "gender"];

export default function ICUPatientForm() {
  const [formData, setFormData]         = useState({ age_unit: "Years" });
  const [errors, setErrors]             = useState({});
  const [openSections, setOpenSections] = useState(
    Object.fromEntries(SECTIONS.map(s => [s.id, true]))
  );
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [fillNotice, setFillNotice] = useState(false);

  // ── Handlers ──────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    if (name === "height_cm" || name === "weight_kg") {
      updated.bmi = calcBMI(
        name === "height_cm" ? value : formData.height_cm,
        name === "weight_kg" ? value : formData.weight_kg
      );
    }
    setFormData(updated);
    if (errors[name]) setErrors(p => { const e = { ...p }; delete e[name]; return e; });
    setResult(null);
  };

  const handleFillNormal = () => {
    const updated = { ...formData };
    let filled = 0;
    Object.entries(NORMAL_VALUES).forEach(([key, val]) => {
      if (!updated[key] || updated[key] === "") {
        updated[key] = val;
        filled++;
      }
    });
    if (updated.height_cm && updated.weight_kg) {
      updated.bmi = calcBMI(updated.height_cm, updated.weight_kg);
    }
    setFormData(updated);
    setResult(null);
    if (filled > 0) {
      setFillNotice(true);
      setTimeout(() => setFillNotice(false), 3500);
    }
  };

  const handleClear = () => {
    setFormData({ age_unit: "Years" });
    setErrors({});
    setResult(null);
    setFillNotice(false);
  };

  const toggleSection = (id) =>
    setOpenSections(p => ({ ...p, [id]: !p[id] }));

  const validate = () => {
    const e = {};
    if (!formData.age)    e.age    = "Age is required";
    if (!formData.gender) e.gender = "Gender is required";
    return e;
  };

  // ── Submit — calls XGBoost model + saves to MongoDB ───────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    try {
      const localResult = estimateMortality(formData);

      // Pass risk info to backend so it saves with prediction
      const payload = {
        ...formData,
        risk_level:    localResult.risk,
        risk_score_pct: localResult.pct,
      };

      const modelResult = await predictFromModel(payload);

      setResult({
        ...localResult,
        modelPrediction:  modelResult.prediction,
        modelProbability: modelResult.probability,
        patientId:        modelResult.patient_id,
      });
    } catch (err) {
      console.error('Model API error:', err);
      // Fallback to local scoring if backend is unreachable
      setResult(estimateMortality(formData));
    }

    setLoading(false);
    setTimeout(() =>
      document.getElementById("result-panel")?.scrollIntoView({ behavior: "smooth" }), 120
    );
  };

  // ── Progress ───────────────────────────────────────────────
  const totalFields  = SECTIONS.flatMap(s => s.fields).filter(f => !f.readOnly).length;
  const filledFields = Object.keys(formData).filter(
    k => k !== "age_unit" && k !== "bmi" && k !== "risk_level" && k !== "risk_score_pct" && formData[k] !== ""
  ).length;
  const progress = Math.min(Math.round((filledFields / totalFields) * 100), 100);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="font-sans bg-icu-bg min-h-screen">

      <TopBar filledFields={filledFields} totalFields={totalFields} progress={progress} />

      <div className="max-w-5xl mx-auto px-5 pt-7 pb-24">

        {/* Fill notice toast */}
        {fillNotice && (
          <div className="animate-slide-in mb-4 flex items-center gap-2 px-4 py-3
                          bg-gradient-to-r from-emerald-50 to-teal-50
                          border border-accent/40 rounded-xl
                          text-[12.5px] font-semibold text-emerald-700">
            ✨ Normal reference values filled for empty fields. Review before submitting.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {SECTIONS.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isOpen={openSections[section.id]}
              onToggle={() => toggleSection(section.id)}
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
          ))}

          {/* ── Action row ── */}
          <div className="flex flex-wrap justify-between items-center mt-6 px-0.5 gap-3">
            <div className="flex gap-2.5 flex-wrap">
              <button type="button" className="btn-clear" onClick={handleClear}>
                🗑 Clear All
              </button>
              <button
                type="button" className="btn-fill" onClick={handleFillNormal}
                title="Fills unfilled fields with typical normal/average reference values"
              >
                <span className="text-base">🧪</span>
                Fill Normal Values
              </button>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-fast shrink-0" />
                  Analysing...
                </>
              ) : (
                <>⚡ Predict Mortality Risk</>
              )}
            </button>
          </div>

          {/* ── Info note ── */}
          <div className="mt-3 flex items-start gap-2 px-3.5 py-3 bg-white border border-icu-border
                          rounded-xl text-[11.5px] text-icu-muted leading-relaxed">
            <span className="text-sm shrink-0 mt-0.5">💡</span>
            <span>
              <strong className="text-icu-label">Fill Normal Values</strong> — Automatically
              populates any empty fields with standard ICU reference averages (healthy adult baseline).
              Fields you've already filled remain unchanged. Auto-filled values are highlighted in{" "}
              <span className="text-accent font-semibold">green</span> with an "avg" badge.
            </span>
          </div>

        </form>

        {result && <ResultPanel result={result} formData={formData} />}

      </div>
    </div>
  );
}