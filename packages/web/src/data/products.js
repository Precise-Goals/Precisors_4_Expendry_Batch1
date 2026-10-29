/**
 * Tooling & Precision Medical Implant Marketplace Catalog
 *
 * 9 high-precision implants, surgical tools, and metrology devices
 * manufactured by Biorad Medisys (Pune). Every listed product is fully
 * paired with an interactive 3D GLB model and on-chain verification specs.
 */

export const CATEGORIES = [
  "All",
  "Orthopedic Knees",
  "Hip Arthroplasty",
  "Endosurgical & Urology",
  "Cutting Tools",
  "Measuring Instruments",
  "Workholding",
];

export const PRODUCTS = [
  {
    id: "prod-001",
    name: "Excel Medial Pivot Knee (MPK) Femoral Component",
    description:
      "Precision-machined CoCrMo femoral knee component featuring medial pivot kinematics for anatomical stability, physiological rollback, and deep flexion wear reduction.",
    price: 850.0,
    category: "Orthopedic Knees",
    imageUrl: "/images/products/end-mill.png",
    specs: {
      material: "CoCrMo Alloy (ISO 5832-4)",
      kinematics: "Medial Pivot Asymmetric",
      surfaceFinish: "Mirror Electropolished Ra < 0.02 µm",
      femoralSize: "Size 3 Anatomical",
      tolerance: "±0.005 mm 5-Axis CNC Profile",
    },
    has3DModel: true,
    modelId: "excel-mpk",
    inStock: true,
    rating: 4.9,
    reviewsCount: 42,
  },
  {
    id: "prod-002",
    name: "Genius Cruciate Retaining (CR) Knee System",
    description:
      "Bone-conserving total knee arthroplasty femoral prosthesis engineered with physiological radius of curvature for optimal PCL retention.",
    price: 790.0,
    category: "Orthopedic Knees",
    imageUrl: "/images/products/insert-set.png",
    specs: {
      material: "Medical Grade CoCrMo ASTM F75",
      stability: "Cruciate Retaining (PCL Retained)",
      bearingInterface: "UHMWPE Articulation",
      tolerance: "ISO 7207-2 Compliant",
    },
    has3DModel: true,
    modelId: "genius-cr",
    inStock: true,
    rating: 4.8,
    reviewsCount: 38,
  },
  {
    id: "prod-003",
    name: "Genius Posterior Stabilized (PS) High-Flexion Knee",
    description:
      "Posterior stabilized knee arthroplasty component equipped with a high-efficiency cam-and-post mechanism accommodating up to 145° deep flexion.",
    price: 820.0,
    category: "Orthopedic Knees",
    imageUrl: "/images/products/drill-set.png",
    specs: {
      material: "Forged CoCrMo Multi-Axis Milled",
      camGeometry: "Rounded Anti-Jump Spine Contact",
      flexionAngle: "Up to 145° Safe Flexion",
      patellarGroove: "Deep Anatomical Sulcus",
    },
    has3DModel: true,
    modelId: "genius-ps",
    inStock: true,
    rating: 5.0,
    reviewsCount: 56,
  },
  {
    id: "prod-004",
    name: "Ouro Posterior Stabilized High-Flexion Asian-Fit Knee",
    description:
      "Ergonomically contoured Asian-fit femoral knee component tailored for high-demand lifestyle activities including deep kneeling and squatting.",
    price: 890.0,
    category: "Orthopedic Knees",
    imageUrl: "/images/products/boring-bars.png",
    specs: {
      material: "Forged CoCrMo ASTM F75",
      specialization: "High Flexion Lifestyle Adaptation",
      trochleaAngle: "7° Lateralized Sulcus",
      certification: "CE Marked & CDSCO Approved",
    },
    has3DModel: true,
    modelId: "ouro-ps",
    inStock: true,
    rating: 4.9,
    reviewsCount: 29,
  },
  {
    id: "prod-005",
    name: "Signature Cementless Porous Titanium Hip Stem",
    description:
      "Taper-wedge femoral stem precision turn-milled from Ti-6Al-4V ELI with proximal plasma-sprayed titanium and hydroxyapatite dual coating.",
    price: 950.0,
    category: "Hip Arthroplasty",
    imageUrl: "/images/products/tap-die-set.png",
    specs: {
      substrate: "Ti-6Al-4V ELI (ASTM F136)",
      coating: "Porous Ti Mesh + Hydroxyapatite",
      taper: "12/14 Eurotaper Spindle",
      surfaceRoughness: "Ra 50-70 µm in Porous Zone",
    },
    has3DModel: true,
    modelId: "signature-stem",
    inStock: true,
    rating: 4.9,
    reviewsCount: 34,
  },
  {
    id: "prod-006",
    name: "Signature Duo Dual-Mobility Acetabular Cup System",
    description:
      "Dual mobility spherical press-fit acetabular shell designed to eliminate hip dislocation in active patients through dual articulation biomechanics.",
    price: 680.0,
    category: "Hip Arthroplasty",
    imageUrl: "/images/products/collet-set.png",
    specs: {
      shellMaterial: "Stainless Steel / CoCrMo Dual Coating",
      innerBore: "Mirror Finish Ra < 0.015 µm",
      fixation: "Press-fit Equatorial Macro-Grooves",
      outerDiameters: "44mm to 62mm",
    },
    has3DModel: true,
    modelId: "signature-duo-cup",
    inStock: true,
    rating: 4.8,
    reviewsCount: 22,
  },
  {
    id: "prod-007",
    name: "Signature NX Cup with BIOLOX Delta Ceramic Head",
    description:
      "Ultra-low-wear ceramic-on-ceramic/UHMWPE articulation pairing BIOLOX Delta alumina-zirconia composite ceramic head with press-fit Signature NX shell.",
    price: 1250.0,
    category: "Hip Arthroplasty",
    imageUrl: "/images/products/vise.png",
    specs: {
      headMaterial: "BIOLOX delta Alumina Composite Ceramic",
      cupMaterial: "Titanium Porous Plasma Shell",
      headDiameters: "28mm, 32mm, 36mm, 40mm",
      wearRate: "< 0.5 mm³ / million cycles",
    },
    has3DModel: true,
    modelId: "signature-nx-cup",
    inStock: true,
    rating: 5.0,
    reviewsCount: 47,
  },
  {
    id: "prod-008",
    name: "Hydrophilic Double-J Ureteral Stent Assembly",
    description:
      "Precision-extruded biocompatible polyurethane ureteral drainage stent with coiled pigtail anchors, side drainage eyes, and lubricious coating.",
    price: 145.0,
    category: "Endosurgical & Urology",
    imageUrl: "/images/products/coolant-kit.png",
    specs: {
      polymer: "Medical Grade Radiopaque Polyurethane",
      gauge: "4.5 Fr / 6.0 Fr / 7.0 Fr",
      length: "26 cm / 28 cm Dual Pigtail",
      radiopacity: "Barium Sulfate Blend",
    },
    has3DModel: true,
    modelId: "dj-stent",
    inStock: true,
    rating: 4.7,
    reviewsCount: 19,
  },
  {
    id: "prod-009",
    name: "Indoscope Sleek Semi-Rigid Fiber-Optic Endoscope",
    description:
      "Compact semi-rigid ureterorenoscope engineered with German fiber-optic bundles and laser-welded stainless steel instrument channel.",
    price: 1480.0,
    category: "Endosurgical & Urology",
    imageUrl: "/images/products/dial-indicator.png",
    specs: {
      outerSheath: "Seamless 316L Stainless Steel",
      distalTip: "Tapered 6.5 Fr Atraumatic Bevel",
      optics: "50,000 Pixel High-Resolution Fiber Bundle",
      workingChannel: "3.4 Fr Laser Fiber Channel",
    },
    has3DModel: true,
    modelId: "indoscope-sleek",
    inStock: true,
    rating: 4.9,
    reviewsCount: 31,
  },
];

/**
 * Filters the product catalog based on category, price range, search keyword,
 * and enforces 3D model availability (only products with 3D models shown).
 */
export function filterProducts(
  products = PRODUCTS,
  { category, minPrice, maxPrice, search, onlyWith3D = true } = {}
) {
  let list = [...products];

  // Restrict to products that have active 3D models if requested (default: true)
  if (onlyWith3D) {
    list = list.filter((p) => p.has3DModel && p.modelId);
  }

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
