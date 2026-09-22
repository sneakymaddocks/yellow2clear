/* =====================================================================
   SITE CONFIG — edit this file to change business details and prices.
   Everything on the site that shows a name, phone number, price or
   area is read from here.
   ===================================================================== */

const BUSINESS = {
  name: "Yellow2Clear",
  tagline: "Mobile headlight restoration across Greater Manchester",
  // UK number as customers should read it:
  phoneDisplay: "07440 107515",
  // Same number in international format, digits only, for tel: and WhatsApp links:
  phoneIntl: "447440107515",
  email: "",                                     // optional; leave empty to hide the email link
  hours: "Mon–Sat 8am–7pm, Sun by appointment",
  baseArea: "Manchester",
  guaranteeMonths: 12,                           // TODO: confirm your guarantee
  // Used for SEO tags. Set to your live domain once deployed.
  siteUrl: "https://yellow2clear.co.uk",
};

const PRICES = {
  currency: "£",
  default: { single: 50, both: 80 },
  // Optional per-vehicle overrides. Key is "Make|Model". Example:
  // "Range Rover|Range Rover Sport": { single: 70, both: 110 },
  overrides: {},
};

const AREAS = {
  primary: [
    "Manchester", "Salford", "Stockport", "Trafford", "Bolton", "Bury",
    "Oldham", "Rochdale", "Tameside", "Wigan",
  ],
  extended: [
    "Warrington", "Macclesfield", "Wilmslow", "Altrincham", "Knutsford",
    "Northwich", "Glossop", "Bolton", "Chorley", "Leigh", "Preston",
    "Blackburn", "Burnley",
  ],
};

// Before/after photo pairs shown in the gallery. Add a line per pair.
// Put real photos in /images and reference them here (jpg/png/webp all fine).
const GALLERY = [
  { before: "images/placeholder-before-1.svg", after: "images/placeholder-after-1.svg", caption: "Audi A3 — both headlights, Didsbury" },
  { before: "images/placeholder-before-2.svg", after: "images/placeholder-after-2.svg", caption: "Ford Focus — both headlights, Salford" },
  { before: "images/placeholder-before-3.svg", after: "images/placeholder-after-3.svg", caption: "BMW 3 Series — single headlight, Stockport" },
];
