export const SERVICE_CATALOG = [
  // Consultations
  { id: 'S001', category: 'Consultation',  name: 'OPD Consultation',          rate: 500  },
  { id: 'S002', category: 'Consultation',  name: 'Follow-up Consultation',    rate: 300  },
  { id: 'S003', category: 'Consultation',  name: 'Emergency Consultation',    rate: 800  },
  // Ultrasound
  { id: 'S010', category: 'Ultrasound',    name: 'Dating Scan',               rate: 1200 },
  { id: 'S011', category: 'Ultrasound',    name: 'NT Scan',                   rate: 1800 },
  { id: 'S012', category: 'Ultrasound',    name: 'TIFFA / Anomaly Scan',      rate: 2500 },
  { id: 'S013', category: 'Ultrasound',    name: 'Growth Scan',               rate: 1200 },
  { id: 'S014', category: 'Ultrasound',    name: 'Follicular Study',          rate: 800  },
  { id: 'S015', category: 'Ultrasound',    name: 'Doppler Study',             rate: 1500 },
  // Procedures
  { id: 'S020', category: 'Procedure',     name: 'IUI Procedure',             rate: 8000 },
  { id: 'S021', category: 'Procedure',     name: 'Pap Smear',                 rate: 600  },
  { id: 'S022', category: 'Procedure',     name: 'Colposcopy',                rate: 2000 },
  { id: 'S023', category: 'Procedure',     name: 'Copper-T Insertion',        rate: 1500 },
  { id: 'S024', category: 'Procedure',     name: 'Laser Vaginal Tightening',  rate: 15000},
  { id: 'S025', category: 'Procedure',     name: 'PRP Therapy',               rate: 12000},
  /*
  // Lab
  { id: 'S030', category: 'Lab',           name: 'CBC',                       rate: 300  },
  { id: 'S031', category: 'Lab',           name: 'TSH',                       rate: 400  },
  { id: 'S032', category: 'Lab',           name: 'LH / FSH',                  rate: 600  },
  { id: 'S033', category: 'Lab',           name: 'AMH',                       rate: 1800 },
  { id: 'S034', category: 'Lab',           name: 'Urine Routine',             rate: 150  },
  */
]

export const PACKAGES = [
  { id: 'PKG001', name: 'ANC Package',              price: 8000,  includes: ['Dating Scan','NT Scan','TIFFA Scan','Growth Scan','4 OPD Consultations'] },
  // { id: 'PKG002', name: 'Fertility Cycle Package',  price: 12000, includes: ['3 Follicular Studies','IUI Procedure','Hormone Tests','2 Consultations'] },
  { id: 'PKG003', name: 'Laser Rejuvenation Pkg',   price: 35000, includes: ['3 Laser Sessions','Pre-procedure Consult','Follow-up Visit'] },
]

export const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'NEFT / Bank Transfer', 'Insurance', 'Cheque']

export const GST_RATE = 0 // Healthcare is GST exempt in India, set to 5 for taxable items

export const INVOICE_STATUS = {
  paid:        { label: 'Paid',        variant: 'success' },
  partial:     { label: 'Partial',     variant: 'warning' },
  pending:     { label: 'Pending',     variant: 'danger'  },
  cancelled:   { label: 'Cancelled',   variant: 'default' },
}