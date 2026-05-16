import type { TextItem, FeatureSet } from "lib/parse-resume-from-pdf/types";

const isTextItemBold = (fontName: string) =>
  fontName.toLowerCase().includes("bold");
export const isBold = (item: TextItem) => isTextItemBold(item.fontName);
export const hasLetter = (item: TextItem) => /[a-zA-Z]/.test(item.text);
export const hasNumber = (item: TextItem) => /[0-9]/.test(item.text);
export const hasComma = (item: TextItem) => item.text.includes(",");
export const getHasText = (text: string) => (item: TextItem) =>
  item.text.includes(text);
export const hasOnlyLettersSpacesAmpersands = (item: TextItem) =>
  /^[A-Za-z\s&]+$/.test(item.text);
export const hasLetterAndIsAllUpperCase = (item: TextItem) =>
  hasLetter(item) && item.text.toUpperCase() === item.text;

// Date Features
const hasYear = (item: TextItem) => /(?:19|20)\d{2}/.test(item.text);
// prettier-ignore
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// prettier-ignore
const MONTH_ABBREVIATIONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const hasMonth = (item: TextItem) =>
  MONTHS.some(
    (month) =>
      item.text.includes(month) || item.text.includes(month.slice(0, 4))
  );
const hasMonthAbbr = (item: TextItem) =>
  MONTH_ABBREVIATIONS.some((abbr) =>
    new RegExp(`\\b${abbr}\\b`, "i").test(item.text)
  );
const SEASONS = ["Summer", "Fall", "Spring", "Winter"];
const hasSeason = (item: TextItem) =>
  SEASONS.some((season) => item.text.includes(season));
const hasPresent = (item: TextItem) =>
  /\b(Present|Current|Now|Ongoing)\b/i.test(item.text);
const hasDateRangeDash = (item: TextItem) =>
  /\d\s*[-–—]\s*(\d|Present|Current|Now)/i.test(item.text);
export const DATE_FEATURE_SETS: FeatureSet[] = [
  [hasYear, 2],
  [hasMonth, 2],
  [hasMonthAbbr, 2],
  [hasSeason, 1],
  [hasPresent, 2],
  [hasDateRangeDash, 3],
  [hasComma, -1],
];
