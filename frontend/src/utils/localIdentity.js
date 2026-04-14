/**
 * Device-scoped identities (no login). Users keep the same browser profile to stay "the same" donor/volunteer/etc.
 */

const KEYS = {
  DONOR_REF: 'h2o_donor_ref',
  SOCIAL_WORKER_ID: 'h2o_social_worker_id',
  VOLUNTEER_ID: 'h2o_volunteer_id',
  BENEFICIARY_ID: 'h2o_beneficiary_id',
};

function randomRef() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `h2o_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export function getOrCreateDonorRef() {
  let v = localStorage.getItem(KEYS.DONOR_REF);
  if (!v) {
    v = randomRef();
    localStorage.setItem(KEYS.DONOR_REF, v);
  }
  return v;
}

export function getSocialWorkerId() {
  return localStorage.getItem(KEYS.SOCIAL_WORKER_ID);
}

export function setSocialWorkerId(id) {
  if (id == null || id === '') localStorage.removeItem(KEYS.SOCIAL_WORKER_ID);
  else localStorage.setItem(KEYS.SOCIAL_WORKER_ID, String(id));
}

export function getVolunteerId() {
  return localStorage.getItem(KEYS.VOLUNTEER_ID);
}

export function setVolunteerId(id) {
  if (id == null || id === '') localStorage.removeItem(KEYS.VOLUNTEER_ID);
  else localStorage.setItem(KEYS.VOLUNTEER_ID, String(id));
}

export function getBeneficiaryId() {
  return localStorage.getItem(KEYS.BENEFICIARY_ID);
}

export function setBeneficiaryId(id) {
  if (id == null || id === '') localStorage.removeItem(KEYS.BENEFICIARY_ID);
  else localStorage.setItem(KEYS.BENEFICIARY_ID, String(id));
}
