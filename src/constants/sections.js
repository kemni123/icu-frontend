import C from './colors';

const SECTIONS = [
  {
    id: "demographics", title: "Patient Demographics", icon: "👤", color: C.primary, bg: "#e3f0fb",
    fields: [
      { name: "patient_name",  label: "Patient Name",   type: "text",   placeholder: "Optional", span: 2 },
      { name: "age",           label: "Age",            type: "number", placeholder: "e.g. 45", unitOptions: ["Years","Months","Days"] },
      { name: "gender",        label: "Gender",         type: "select", options: [{value:"",label:"Select"},{value:"1",label:"Male"},{value:"0",label:"Female"}] },
      { name: "height_cm",     label: "Height",         type: "number", placeholder: "100 – 220", unit_label: "cm" },
      { name: "weight_kg",     label: "Weight",         type: "number", placeholder: "20 – 200",  unit_label: "kg" },
      { name: "bmi",           label: "BMI",            type: "number", placeholder: "Auto-calculated", readOnly: true, unit_label: "kg/m²" },
    ],
  },
  {
    id: "severity", title: "Severity Scores", icon: "📊", color: C.purple, bg: "#f0eeff",
    fields: [
      { name: "apache_ii", label: "APACHE II Score",  type: "number", placeholder: "0 – 71",  unit_label: "score" },
      { name: "sofa",      label: "SOFA Score",       type: "number", placeholder: "0 – 24",  unit_label: "score" },
      { name: "pf_ratio",  label: "P/F Ratio (ARDS)", type: "number", placeholder: "50 – 500",unit_label: "mmHg"  },
    ],
  },
  {
    id: "vitals", title: "Vital Signs", icon: "❤️", color: "#c0392b", bg: "#fdecea",
    fields: [
      { name: "hr",           label: "Heart Rate",   type: "number", placeholder: "20 – 200", unit_label: "bpm"  },
      { name: "bp_systolic",  label: "BP Systolic",  type: "number", placeholder: "50 – 250", unit_label: "mmHg" },
      { name: "bp_diastolic", label: "BP Diastolic", type: "number", placeholder: "30 – 150", unit_label: "mmHg" },
      { name: "temperature",  label: "Temperature",  type: "number", placeholder: "30 – 45",  unit_label: "°C"   },
    ],
  },
  {
    id: "renal", title: "Renal Function", icon: "🩺", color: C.teal, bg: "#e0f7fa",
    fields: [
      { name: "urea",         label: "Urea",         type: "number", placeholder: "5 – 300",   unit_label: "mg/dL"  },
      { name: "creatinine",   label: "Creatinine",   type: "number", placeholder: "0.3 – 15",  unit_label: "mg/dL"  },
      { name: "urine_output", label: "Urine Output", type: "number", placeholder: "0 – 500",   unit_label: "mL/hr"  },
    ],
  },
  {
    id: "inflammatory", title: "Inflammatory Markers", icon: "🔬", color: "#b5651d", bg: "#fef3e2",
    fields: [
      { name: "pct",    label: "PCT",        type: "number", placeholder: "0 – 1000",  unit_label: "ng/mL" },
      { name: "il6",    label: "IL-6",       type: "number", placeholder: "0 – 5000",  unit_label: "pg/mL" },
      { name: "hs_crp", label: "HS-CRP/CRP", type: "number", placeholder: "0 – 500",   unit_label: "mg/L"  },
    ],
  },
  {
    id: "coagulation", title: "Coagulation Profile", icon: "🩸", color: "#9c2a3a", bg: "#fce8eb",
    fields: [
      { name: "pt",   label: "PT",   type: "number", placeholder: "9 – 60",   unit_label: "sec" },
      { name: "aptt", label: "aPTT", type: "number", placeholder: "20 – 120", unit_label: "sec" },
      { name: "inr",  label: "INR",  type: "number", placeholder: "0.8 – 10", unit_label: ""    },
    ],
  },
  {
    id: "hematology", title: "Hematology", icon: "🔴", color: C.primary, bg: "#e3f0fb",
    fields: [
      { name: "hb",       label: "Haemoglobin (Hb)", type: "number", placeholder: "3 – 20",    unit_label: "g/dL"    },
      { name: "platelet", label: "Platelet Count",   type: "number", placeholder: "10 – 800",  unit_label: "×10³/μL" },
      { name: "tlc_dlc",  label: "TLC / DLC",        type: "number", placeholder: "1 – 50",    unit_label: "×10³/μL" },
    ],
  },
  {
    id: "biochemistry", title: "Biochemistry", icon: "⚗️", color: "#2e7d52", bg: "#e8f5ed",
    fields: [
      { name: "s_albumin",     label: "Serum Albumin",   type: "number", placeholder: "1 – 6",    unit_label: "g/dL"  },
      { name: "total_protein", label: "Total Protein",   type: "number", placeholder: "3 – 10",   unit_label: "g/dL"  },
      { name: "s_calcium",     label: "Serum Calcium",   type: "number", placeholder: "5 – 15",   unit_label: "mg/dL" },
      { name: "s_magnesium",   label: "Serum Magnesium", type: "number", placeholder: "0.5 – 5",  unit_label: "mg/dL" },
    ],
  },
  {
    id: "abg", title: "Arterial Blood Gas (ABG)", icon: "💨", color: C.primary2, bg: "#dceefb",
    fields: [
      { name: "pao2",    label: "PaO₂",   type: "number", placeholder: "30 – 500",  unit_label: "mmHg"   },
      { name: "paco2",   label: "PaCO₂",  type: "number", placeholder: "10 – 100",  unit_label: "mmHg"   },
      { name: "hco3",    label: "HCO₃",   type: "number", placeholder: "5 – 45",    unit_label: "mEq/L"  },
      { name: "lactate", label: "Lactate", type: "number", placeholder: "0.3 – 20",  unit_label: "mmol/L" },
    ],
  },
  {
    id: "electrolytes", title: "Electrolytes", icon: "⚡", color: C.purple, bg: "#f0eeff",
    fields: [
      { name: "na", label: "Sodium (Na)",   type: "number", placeholder: "110 – 170", unit_label: "mEq/L" },
      { name: "k",  label: "Potassium (K)", type: "number", placeholder: "1.5 – 9",   unit_label: "mEq/L" },
    ],
  },
  {
    id: "icu_stay", title: "ICU Stay", icon: "🏥", color: "#374f5c", bg: "#e8ecf0",
    fields: [
      { name: "days_icu",        label: "Days in ICU",        type: "number", placeholder: "0 – 365", unit_label: "days" },
      { name: "days_ventilator", label: "Days on Ventilator", type: "number", placeholder: "0 – 365", unit_label: "days" },
    ],
  },
];

export default SECTIONS;
