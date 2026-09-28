import { isValidPhoneNumber } from 'libphonenumber-js';

/*
  Whether an E.164 value (e.g. "+919876543210") is a valid phone number.

  Uses libphonenumber-js (Google's libphonenumber rules) rather than a
  digit-count check against react-international-phone's display masks: those
  masks assume one fixed length per country, which rejected real numbers in
  countries whose lengths vary — German mobiles, UAE landlines, and so on.
*/
export function isValidPhone(phone) {
  if (!phone) return false;
  try {
    return isValidPhoneNumber(phone);
  } catch {
    return false;
  }
}
