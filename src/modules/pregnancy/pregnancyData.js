export const ANC_SYMPTOMS = [
  'Nausea / vomiting', 'Headache', 'Blurred vision',
  'Swelling of feet', 'Reduced fetal movement', 'Vaginal bleeding',
  'Abdominal pain', 'Fever', 'Dysuria', 'Breathlessness',
  'Constipation', 'Heartburn', 'Back pain', 'No complaints',
]

export const RISK_FLAGS = [
  { key: 'gestationalDiabetes', label: 'Gestational Diabetes',  color: 'warning' },
  { key: 'preEclampsia',        label: 'Pre-eclampsia',          color: 'danger'  },
  { key: 'anaemia',             label: 'Anaemia',                color: 'warning' },
  { key: 'pretermRisk',         label: 'Preterm Risk',           color: 'danger'  },
  { key: 'placentaPrevia',      label: 'Placenta Previa',        color: 'danger'  },
  { key: 'hypothyroidism',      label: 'Hypothyroidism',         color: 'default' },
  { key: 'rh_negative',         label: 'Rh Negative',            color: 'warning' },
]

export const ANC_INVESTIGATIONS = [
  'CBC', 'Blood Group & Rh', 'Urine Routine',
  'Blood Sugar (Fasting)', 'HbA1c', 'TSH',
  'HIV / HBsAg / VDRL', 'Serum Ferritin',
  'Vitamin D', 'Anomaly Scan (TIFFA)',
  'NT Scan', 'Growth Scan', 'Doppler',
  'GCT (Glucose Challenge Test)', 'GTT (Glucose Tolerance Test)',
]

export const DELIVERY_MODES = ['Normal Vaginal', 'LSCS', 'Instrumental (Forceps)', 'Instrumental (Ventouse)', 'Emergency LSCS']

export const MILESTONE_SCANS = [
  { week: '6-8',   scan: 'Viability / Dating Scan'    },
  { week: '11-14', scan: 'NT Scan'                    },
  { week: '18-22', scan: 'Anomaly / TIFFA Scan'       },
  { week: '28-32', scan: 'Growth Scan'                },
  { week: '36+',   scan: 'Delivery Preparedness Scan' },
]

export const VACCINES = [
  'TT1 (Tetanus Toxoid)', 'TT2 / TT Booster',
  'Tdap (after 27 weeks)', 'Flu vaccine',
]