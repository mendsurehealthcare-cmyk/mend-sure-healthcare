import countryData from '../data/countries.json';
import cityData from '../data/india-cities.json';

// The upstream dataset lists only current official names, but our patients are
// mostly writing from the US, UK, and Gulf, where the older names are still the
// ones in common use. Without these, someone typing "Bangalore" or "Bombay" —
// which is most of them — gets an empty dropdown and assumes the site is
// broken. Keyed canonical -> the alternates people actually type.
const CITY_ALIASES = {
  Bengaluru: ['Bangalore'],
  Mumbai: ['Bombay'],
  Chennai: ['Madras'],
  Kolkata: ['Calcutta'],
  Gurugram: ['Gurgaon'],
  // Note the direction: the key must be the name as it appears in the dataset,
  // which is not always the current official spelling. Kerala's Kochi is filed
  // as "Cochin" upstream, and Karnataka's Kalaburagi as "Kalaburgi".
  Cochin: ['Kochi', 'Ernakulam'],
  Thiruvananthapuram: ['Trivandrum'],
  Mysuru: ['Mysore'],
  Puducherry: ['Pondicherry', 'Pondy'],
  Vadodara: ['Baroda'],
  'Prayagraj (Allahabad)': ['Prayagraj', 'Allahabad'],
  Varanasi: ['Benares', 'Banaras'],
  Kanpur: ['Cawnpore'],
  Visakhapatnam: ['Vizag'],
  Thrissur: ['Trichur'],
  Tiruchirappalli: ['Trichy'],
  Hubballi: ['Hubli'],
  Belagavi: ['Belgaum'],
  Shimoga: ['Shivamogga'],
  Kalaburgi: ['Kalaburagi', 'Gulbarga'],
};

// Same problem at country level: almost nobody types "United States of
// America" in full, and this audience overwhelmingly abbreviates.
const COUNTRY_ALIASES = {
  'United States': ['USA', 'US', 'America'],
  'United Kingdom': ['UK', 'Britain', 'Great Britain', 'England', 'Scotland', 'Wales'],
  'United Arab Emirates': ['UAE', 'Dubai', 'Abu Dhabi'],
  'Saudi Arabia': ['KSA'],
  Netherlands: ['Holland'],
  'South Korea': ['Korea'],
  Myanmar: ['Burma'],
  Eswatini: ['Swaziland'],
  'Czech Republic': ['Czechia'],
  Turkey: ['Turkiye', 'Türkiye'],
  'Democratic Republic of the Congo': ['DRC', 'Congo-Kinshasa'],
  'Ivory Coast': ["Côte d'Ivoire", 'Cote d Ivoire'],
  'Cape Verde': ['Cabo Verde'],
};

// Strips accents and case so "Ānand" is reachable by typing "anand". Many
// entries in the dataset carry macrons the average keyboard can't produce.
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Builds the searchable form of each entry once, rather than re-normalising
// four thousand strings on every keystroke.
function buildIndex(entries, aliases) {
  return entries.map((entry) => {
    const name = typeof entry === 'string' ? entry : entry.name;
    const alternates = aliases[name] || [];

    return {
      value: name,
      flag: typeof entry === 'string' ? null : entry.flag,
      normalized: normalize(name),
      alternates: alternates.map((alt) => ({ label: alt, normalized: normalize(alt) })),
    };
  });
}

export const COUNTRY_INDEX = buildIndex(countryData, COUNTRY_ALIASES);
export const INDIA_CITY_INDEX = buildIndex(cityData, CITY_ALIASES);

// Match quality tiers, lower is better. A name that starts with what you typed
// is almost always what you meant, and a match that only landed through an
// alternate name sorts just below the equivalent hit on the real name.
const EXACT_NAME = -2;
const EXACT_ALIAS = -1;
const PREFIX_NAME = 0;
const PREFIX_ALIAS = 1;
const SUBSTRING_NAME = 2;
const SUBSTRING_ALIAS = 3;
// Cities we have partner hospitals in are the answers that lead somewhere, so
// they edge ahead of an equally good match we can't act on — but only within
// a tier, never enough to jump a better match.
const PRIORITY_BOOST = 0.5;
function rank(item, query, isPriority) {
  let score = null;
  let via = null;
  let matchIndex = -1;

  const direct = item.normalized.indexOf(query);
  if (item.normalized === query) {
    score = EXACT_NAME;
    matchIndex = 0;
  } else if (direct === 0) {
    score = PREFIX_NAME;
    matchIndex = 0;
  } else if (direct > 0) {
    score = SUBSTRING_NAME;
    matchIndex = direct;
  }

  for (const alt of item.alternates) {
    const altIndex = alt.normalized.indexOf(query);
    if (altIndex === -1) continue;

    // An exact hit on an alternate name outranks a merely incidental prefix
    // match elsewhere: typing "uk" means United Kingdom, not Ukraine, and
    // "usa" means the United States, not Usakos.
    let altScore = SUBSTRING_ALIAS;
    if (alt.normalized === query) altScore = EXACT_ALIAS;
    else if (altIndex === 0) altScore = PREFIX_ALIAS;

    if (score === null || altScore < score) {
      score = altScore;
      via = alt.label;
      matchIndex = -1; // highlight the alias hint instead of the name itself
    }
  }

  if (score === null) return null;

  return { score: isPriority ? score - PRIORITY_BOOST : score, via, matchIndex };
}

/**
 * Filters a prebuilt index down to the best matches for what the user typed.
 *
 * @param {Array}  index     One of COUNTRY_INDEX / INDIA_CITY_INDEX.
 * @param {string} query     Raw text from the input.
 * @param {object} [options]
 * @param {number} [options.limit=8]      Max suggestions to return.
 * @param {string[]} [options.priority=[]] Values to surface first (e.g. cities
 *                                         where we have partner hospitals).
 * @returns {Array} Matches with highlight offsets, ready to render.
 */
export function searchLocations(index, query, { limit = 8, priority = [] } = {}) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const prioritySet = new Set(priority.map(normalize));
  const matches = [];

  for (const item of index) {
    const result = rank(item, normalizedQuery, prioritySet.has(item.normalized));
    if (result) {
      matches.push({
        value: item.value,
        flag: item.flag,
        via: result.via,
        isPriority: prioritySet.has(item.normalized),
        matchIndex: result.matchIndex,
        matchLength: result.matchIndex === -1 ? 0 : normalizedQuery.length,
        score: result.score,
      });
    }
  }

  matches.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    // Shorter names first: typing "delhi" should offer Delhi before
    // Delhi Cantonment.
    if (a.value.length !== b.value.length) return a.value.length - b.value.length;
    return a.value.localeCompare(b.value);
  });

  return matches.slice(0, limit);
}
