/**
 * Calculate BMI from height (cm) and weight (kg)
 */
export function calcBMI(height, weight) {
  const h = parseFloat(height);
  const w = parseFloat(weight);
  if (h > 0 && w > 0) return (w / ((h / 100) ** 2)).toFixed(1);
  return "";
}

/**
 * Estimate ICU mortality risk from form data (local scoring)
 * Returns { pct, risk, color, label, icon, advice }
 */
export function estimateMortality(d) {
  let score = 0;
  const n = (k) => parseFloat(d[k]) || 0;

  const apache = n("apache_ii");
  if (apache >= 35)      score += 40;
  else if (apache >= 25) score += 28;
  else if (apache >= 15) score += 15;
  else if (apache >= 10) score += 7;

  const sofa = n("sofa");
  if (sofa >= 12)     score += 20;
  else if (sofa >= 8) score += 12;
  else if (sofa >= 4) score += 6;

  const lac = n("lactate");
  if (lac >= 4)      score += 15;
  else if (lac >= 2) score += 7;

  const pf = n("pf_ratio");
  if (pf > 0 && pf < 100)      score += 12;
  else if (pf > 0 && pf < 200) score += 6;

  const cr = n("creatinine");
  if (cr >= 3.5)    score += 8;
  else if (cr >= 2) score += 4;

  const hr = n("hr");
  if (hr >= 140 || (hr > 0 && hr < 40)) score += 5;

  const sys = n("bp_systolic");
  if (sys > 0 && sys < 70)      score += 10;
  else if (sys > 0 && sys < 90) score += 5;

  const age = n("age");
  if (age >= 80)      score += 8;
  else if (age >= 65) score += 4;

  const plt = n("platelet");
  if (plt > 0 && plt < 50) score += 7;

  const inr = n("inr");
  if (inr >= 3) score += 6;

  const pct = Math.min(Math.round(score), 100);

  if (pct <= 15) return {
    pct, risk: "Low", color: "#00b894", label: "Low Risk", icon: "✅",
    advice: "Clinical parameters are within acceptable range. Continue standard ICU monitoring and reassess as indicated."
  };
  if (pct <= 35) return {
    pct, risk: "Moderate", color: "#f59e0b", label: "Moderate Risk", icon: "⚠️",
    advice: "Elevated risk indicators detected. Close monitoring and timely reassessment are recommended."
  };
  if (pct <= 60) return {
    pct, risk: "High", color: "#e17055", label: "High Risk", icon: "🔶",
    advice: "Multiple critical parameters are abnormal. Escalation of care and specialist consultation should be considered urgently."
  };
  return {
    pct, risk: "Critical", color: "#c0392b", label: "Critical Risk", icon: "🚨",
    advice: "Severe derangement detected across multiple organ systems. Immediate intervention and senior clinical review are warranted."
  };
}

/**
 * Call XGBoost model API + save to MongoDB
 * Returns { prediction: 0|1, probability: 0.0-1.0, patient_id }
 */
export async function predictFromModel(formData) {
  const response = await fetch('https://icu-backend.onrender.com/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error('API error');
  return await response.json();
}