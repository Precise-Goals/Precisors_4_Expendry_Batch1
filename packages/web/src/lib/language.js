export const SUPPORTED_LANGUAGES = ["en", "hi", "mr"];
export const DEFAULT_LANGUAGE = "en";

export const SARVAM_LANGUAGE_CODES = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  auto: "unknown",
};

export function normalizeLanguage(lang, fallback = DEFAULT_LANGUAGE) {
  if (!lang || typeof lang !== "string") return fallback;
  const clean = lang.toLowerCase().trim();
  if (clean === "auto") return "auto";
  if (clean === "hi" || clean.startsWith("hi-") || clean.startsWith("hi_")) return "hi";
  if (clean === "mr" || clean.startsWith("mr-") || clean.startsWith("mr_")) return "mr";
  if (clean === "en" || clean.startsWith("en-") || clean.startsWith("en_")) return "en";
  return SUPPORTED_LANGUAGES.includes(clean) ? clean : fallback;
}

/**
 * Automatically detects the language (en, hi, mr) of a user prompt or text snippet.
 * Supports Devanagari script (distinguishing Marathi vs Hindi) as well as
 * Romanized Devanagari (Hinglish / Romanized Marathi) and defaults to English.
 */
export function detectLanguage(text) {
  if (!text || typeof text !== "string") return DEFAULT_LANGUAGE;
  const trimmed = text.trim();
  if (!trimmed) return DEFAULT_LANGUAGE;

  // 1. Check for Devanagari Unicode block (\u0900 - \u097F)
  const devanagariMatches = trimmed.match(/[\u0900-\u097F]/g);
  if (devanagariMatches && devanagariMatches.length > 0) {
    // Unique Marathi character: ळ (Devanagari Letter LLA - \u0933)
    if (/[\u0933]/.test(trimmed)) {
      return "mr";
    }

    // Common distinctive Marathi words in Devanagari
    const marathiWords = [
      "आहे", "आहेत", "नाही", "नाहीत", "होते", "होती", "होता", "करावे", "करावा",
      "करावी", "कसा", "कशी", "कसे", "काय", "कशा", "कोण", "केले", "केली", "केला",
      "झाले", "झाला", "झाली", "पाहिजे", "मधे", "मध्ये", "वरून", "यांचा", "त्यांचा",
      "आमचा", "तुमचा", "याच्या", "त्याच्या", "माहिती", "सांगा", "द्या", "येतो",
      "येते", "येतात", "शकतो", "शकते", "शकतात", "म्हणून", "आणि", "किंवा", "असेल",
      "असतील", "असू", "असे", "अशा", "अशी", "असा", "खूप", "फार", "काही", "करायचे",
      "बघायचे", "विचारा", "नको", "लागेल", "करायचं", "करायचा", "चालवायची", "चालवायचा",
      "मशीनवर", "मजला", "लेथवर", "व्हायब्रेशन"
    ];

    // Common distinctive Hindi words in Devanagari
    const hindiWords = [
      "है", "हैं", "था", "थी", "थे", "होगा", "होगी", "होंगे", "करना", "करिए",
      "करें", "करते", "करता", "करती", "किया", "किए", "की", "का", "के", "को",
      "से", "में", "पर", "लिए", "और", "या", "लेकिन", "किन्तु", "परन्तु",
      "क्योंकि", "अगर", "यदि", "तो", "भी", "नहीं", "मत", "क्या", "क्यों",
      "कैसे", "कब", "कहाँ", "कहां", "कौन", "कितना", "कितने", "कितनी", "चाहिए",
      "सकता", "सकती", "सकते", "बताइए", "दीजिए", "होता", "होती", "होते", "मुझे",
      "आपको", "इसका", "उसका", "इनका", "उनका", "रहा", "रही", "रहे", "हुआ", "हुई", "हुए"
    ];

    let marathiScore = 0;
    for (const w of marathiWords) {
      const reg = new RegExp(`(^|[\\s,।!?-])${w}([\\s,।!?-]|$)`, "i");
      if (reg.test(trimmed)) marathiScore += 2;
    }

    let hindiScore = 0;
    for (const w of hindiWords) {
      const reg = new RegExp(`(^|[\\s,।!?-])${w}([\\s,।!?-]|$)`, "i");
      if (reg.test(trimmed)) hindiScore += 2;
    }

    if (marathiScore > hindiScore) return "mr";
    if (hindiScore > marathiScore) return "hi";

    // If balanced or no specific markers matched, check suffixes or default Devanagari to Hindi
    return "hi";
  }

  // 2. Check for Romanized text (Hinglish vs Romanized Marathi)
  const lower = trimmed.toLowerCase();

  const marathiLatinMarkers = [
    "kasa", "kashi", "kase", "karave", "karava", "karavi", "pahije", "madhe",
    "baddal", "mahiti", "sanga", "chalwaycha", "chalwaychi", "karaycha", "karaychi",
    "ahe", "ahet", "kinva", "khup", "tapasaycha", "kiti", "lethvar"
  ];

  const hindiLatinMarkers = [
    "kaise", "kare", "karen", "karein", "karna", "karo", "karega", "karegi",
    "hota", "hoti", "hote", "hai", "hain", "nahin", "kyun", "kyu", "batao",
    "bataye", "batayein", "chahiye", "raha", "rahi", "rahe", "mujhe", "aapko",
    "apko", "mera", "meri", "mere", "iska", "iski", "iske", "lekin", "kripya",
    "kya", "karu", "karoon", "karege", "kiya", "kiye", "karte", "karta", "karti",
    "nahi", "kab", "kahan", "kaha", "kidhar", "kaun", "kitna", "kitne", "kitni",
    "bataiye", "bata", "bolo", "mujhko", "uska", "uski", "uske", "magar",
    "bhai", "yaar", "namaste", "shukriya", "dhanyawad", "theek", "thik",
    "kaam", "madad", "chalao", "chalana", "milta", "milega", "samjhao", "sikhao"
  ];

  let marathiLatinScore = 0;
  for (const m of marathiLatinMarkers) {
    const reg = new RegExp(`\\b${m}\\b`, "i");
    if (reg.test(lower)) marathiLatinScore += 2;
  }

  let hindiLatinScore = 0;
  for (const m of hindiLatinMarkers) {
    const reg = new RegExp(`\\b${m}\\b`, "i");
    if (reg.test(lower)) hindiLatinScore += 2;
  }

  if (marathiLatinScore > hindiLatinScore && marathiLatinScore > 0) return "mr";
  if (hindiLatinScore > marathiLatinScore && hindiLatinScore > 0) return "hi";

  return DEFAULT_LANGUAGE;
}
