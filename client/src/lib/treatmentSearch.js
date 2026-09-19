import { buildIndex } from './locations';
import { TREATMENT_COST_GUIDES, ALL_GUIDE_SPECIALTIES } from '../data/treatmentCostGuides';

// Same cardiac-surgery procedure list as CardiacSurgeryCostGuide.jsx's
// INDIA_COSTS, reproduced here rather than imported — that table isn't
// exported, and homePopularTreatments.js already handles the same one-off
// duplication the same way rather than exporting it just for this.
const CARDIAC_SURGERY_PROCEDURES = [
  'Heart bypass surgery',
  'Valve repair or replacement',
  'TAVI',
  'TMVI',
  'Angioplasty',
  'Pacemaker',
  'ICD implantation',
  'EPS/RFA',
  'Glenn procedure',
  'Fontan procedure',
  'ASD',
  'VSD',
  'Cardiac tumour removal surgery',
  'Pericardiectomy',
  'Pulmonary thromboendarterectomy',
  'Coronary endarterectomy',
  'Bentall surgery',
  'Heart transplant surgery',
];

// The Home hero's "Find a treatment or specialty" field suggests both the
// nine specialties with a cost guide and every named procedure/condition
// inside those guides' own tables — the same content the Treatments page
// renders, so a suggestion here can never mention something that page
// doesn't actually cover. Deduplicated: a few procedure names repeat across
// specialties (e.g. "Minimally Invasive Surgery").
const names = new Set(ALL_GUIDE_SPECIALTIES);
for (const name of CARDIAC_SURGERY_PROCEDURES) names.add(name);
for (const tables of Object.values(TREATMENT_COST_GUIDES)) {
  for (const table of tables) {
    for (const row of table.rows) names.add(row[0]);
  }
}

export const TREATMENT_INDEX = buildIndex([...names], {});
