/**
 * Tooling Marketplace Catalog & Seed Products
 *
 * 10 high-precision manufacturing, machining, and metrology products.
 * Includes complete specifications, pricing in USD/EXPEN, category classification,
 * and 3D showcase model associations.
 */

export const CATEGORIES = [
  "All",
  "Cutting Tools",
  "Measuring Instruments",
  "Workholding",
  "Tooling Accessories",
];

export const PRODUCTS = [
  {
    id: "prod-001",
    name: "CNC Indexable Carbide Turning Insert Set (10-Pack)",
    description:
      "Premium negative-rake CNMG 432 grade inserts with TiN multilayer PVD coating. Engineered for heavy roughing and interrupted cutting across medium carbon steel, cast iron, and stainless alloys.",
    price: 48.5,
    category: "Cutting Tools",
    imageUrl: "/images/products/insert-set.png",
    specs: {
      grade: "TiN Coated Carbide",
      insertType: "CNMG 432",
      rake: "Negative",
      cornerRadius: "0.8mm",
      recommendedSpeed: "180-240 m/min",
    },
    has3DModel: true,
    modelId: "lathe-body",
    inStock: true,
    rating: 4.9,
    reviewsCount: 38,
  },
  {
    id: "prod-002",
    name: "4-Flute Solid Carbide End Mill Ø12mm AlTiN",
    description:
      "Ultra-fine grain micrograin carbide substrate featuring an AlTiN high-thermal barrier coating. Excels in trochoidal side-milling and slotting at hardness levels up to HRC 55.",
    price: 78.0,
    category: "Cutting Tools",
    imageUrl: "/images/products/end-mill.png",
    specs: {
      diameter: "12mm",
      fluteCount: 4,
      coating: "AlTiN",
      hardness: "HRC 55",
      shankDiameter: "12mm",
      overallLength: "75mm",
    },
    has3DModel: true,
    modelId: "drill-bit",
    inStock: true,
    rating: 4.8,
    reviewsCount: 52,
  },
  {
    id: "prod-003",
    name: "Digital Vernier Caliper 0-150mm IP67 Coolant Proof",
    description:
      "Shop-floor hardened stainless steel caliper with IP67 liquid and particulate ingress protection. Resistant to coolant splash and metal chips with high-contrast LCD readout.",
    price: 125.0,
    category: "Measuring Instruments",
    imageUrl: "/images/products/caliper.png",
    specs: {
      range: "0-150mm",
      resolution: "0.01mm",
      protection: "IP67",
      accuracy: "±0.02mm",
      batteryType: "CR2032 Lithium",
    },
    has3DModel: false,
    modelId: null,
    inStock: true,
    rating: 5.0,
    reviewsCount: 29,
  },
  {
    id: "prod-004",
    name: "HSS-Co M35 Cobalt Drill Bit Set (1-13mm)",
    description:
      "25-piece industrial drill index crafted from 5% cobalt alloy steel. Split-point 135° geometry eliminates center-punching wandering in stainless steel and high-tensile alloys.",
    price: 64.9,
    category: "Cutting Tools",
    imageUrl: "/images/products/drill-set.png",
    specs: {
      material: "M35 5% Cobalt HSS",
      pointAngle: "135 deg split point",
      sizeIncrement: "0.5mm",
      storage: "Heavy-gauge indexed steel case",
    },
    has3DModel: true,
    modelId: "drill-bit",
    inStock: true,
    rating: 4.7,
    reviewsCount: 41,
  },
  {
    id: "prod-005",
    name: "Precision Modular CNC Milling Vise 150mm",
    description:
      "High-rigidity alloy steel vise with pull-down jaw mechanism to eliminate workpiece tilt under heavy roughing loads. Ground parallelism and squareness to 0.005mm.",
    price: 345.0,
    category: "Workholding",
    imageUrl: "/images/products/vise.png",
    specs: {
      jawWidth: "150mm",
      maxOpening: "200mm",
      clampingForce: "35 kN",
      bodyMaterial: "Ductile FCD-60 Iron",
      weight: "28 kg",
    },
    has3DModel: false,
    modelId: null,
    inStock: true,
    rating: 4.9,
    reviewsCount: 16,
  },
  {
    id: "prod-006",
    name: "Indexable Boring Bar Set 4-Piece (8mm to 16mm)",
    description:
      "Four internal turning tools featuring positive rake geometry and internal coolant thru-holes. Tuned to dampen chatter harmonics in bore depths up to 5x diameter.",
    price: 155.0,
    category: "Cutting Tools",
    imageUrl: "/images/products/boring-bars.png",
    specs: {
      shanks: "8mm, 10mm, 12mm, 16mm",
      direction: "Right Hand",
      insertFit: "CCMT 060204",
      reachRatio: "Up to 5xD",
    },
    has3DModel: true,
    modelId: "lathe-body",
    inStock: true,
    rating: 4.8,
    reviewsCount: 22,
  },
  {
    id: "prod-007",
    name: "Modular High-Pressure Coolant Hose & Nozzle Kit",
    description:
      "Engineered acetal polyoxymethylene interlocking segments that stay firmly aimed under high-pressure cutting fluid pumps. Includes fan and round high-velocity nozzles.",
    price: 32.5,
    category: "Tooling Accessories",
    imageUrl: "/images/products/coolant-kit.png",
    specs: {
      pressureRating: "50 PSI",
      thread: '1/4" NPT',
      segments: 16,
      chemicalResistance: "Solvents, synthetic emulsions, cutting oils",
    },
    has3DModel: false,
    modelId: null,
    inStock: true,
    rating: 4.6,
    reviewsCount: 34,
  },
  {
    id: "prod-008",
    name: "Magnetic Base Universal Dial Indicator Gauge 0.001mm",
    description:
      "Ultra-fine 1-micron resolution dial test indicator with articulated arm and 60kg high-flux neodymium magnetic base. Indispensable for spindle tramming and four-jaw lathe centering.",
    price: 92.0,
    category: "Measuring Instruments",
    imageUrl: "/images/products/dial-indicator.png",
    specs: {
      range: "0-10mm",
      resolution: "0.001mm",
      magneticHold: "60 kg",
      stemDiameter: "8mm",
    },
    has3DModel: false,
    modelId: null,
    inStock: true,
    rating: 4.9,
    reviewsCount: 45,
  },
  {
    id: "prod-009",
    name: "Titanium-Nitride HSS Tap and Die Set M3-M12 (32-Piece)",
    description:
      "Precision plug and bottoming hand taps paired with matching split dies in standard ISO metric pitches. Gold TiN coating reduces friction torque and galling in blind holes.",
    price: 112.0,
    category: "Cutting Tools",
    imageUrl: "/images/products/tap-die-set.png",
    specs: {
      sizes: "M3 to M12",
      coating: "TiN Golden",
      case: "Metal index",
      tapTypes: "Taper, Second, Bottoming",
    },
    has3DModel: false,
    modelId: null,
    inStock: true,
    rating: 4.7,
    reviewsCount: 19,
  },
  {
    id: "prod-010",
    name: "ER32 Precision Collet Chuck Set (18-Piece ISO15448)",
    description:
      "Balanced toolroom-grade spring collets covering diameters from 3mm to 20mm. Rigorously inspected for total indicated runout (TIR) under 0.005mm at 4x collet bore length.",
    price: 198.0,
    category: "Workholding",
    imageUrl: "/images/products/collet-set.png",
    specs: {
      colletSize: "ER32 (3-20mm)",
      runout: "< 0.005mm",
      collapseRange: "1.0mm per collet",
      balanceGrade: "G2.5 @ 20,000 RPM",
    },
    has3DModel: false,
    modelId: null,
    inStock: true,
    rating: 5.0,
    reviewsCount: 63,
  },
];

/**
 * Filters the product catalog based on category, price range, and search keyword.
 */
export function filterProducts(
  products = PRODUCTS,
  { category, minPrice, maxPrice, search } = {}
) {
  let list = [...products];

  if (category && category !== "All") {
    list = list.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  let min =
    typeof minPrice === "number" && !isNaN(minPrice)
      ? minPrice
      : minPrice
      ? parseFloat(minPrice)
      : 0;
  let max =
    typeof maxPrice === "number" && !isNaN(maxPrice)
      ? maxPrice
      : maxPrice
      ? parseFloat(maxPrice)
      : Infinity;

  if (isNaN(min)) min = 0;
  if (isNaN(max)) max = Infinity;

  // Handle inverted bounds gracefully
  if (min > max) {
    const tmp = min;
    min = max;
    max = tmp;
  }

  list = list.filter((p) => p.price >= min && p.price <= max);

  if (search && typeof search === "string") {
    const sanitized = search
      .replace(/<[^>]*>/g, "")
      .replace(/--+/g, " ")
      .replace(/['";]/g, "")
      .trim();

    const keywords = sanitized
      .toLowerCase()
      .split(/\s+/)
      .filter(
        (w) =>
          w.length >= 3 && !["and", "or", "1=1", "select", "where"].includes(w)
      );

    if (keywords.length > 0) {
      list = list.filter((p) => {
        const text = `${p.name} ${p.category} ${p.description}`.toLowerCase();
        return keywords.some((k) => text.includes(k));
      });
    }
  }

  return list;
}

/**
 * Returns a single product by ID or null.
 */
export function getProductById(id, products = PRODUCTS) {
  if (!id || typeof id !== "string") return null;
  return products.find((p) => p.id === id) || null;
}
