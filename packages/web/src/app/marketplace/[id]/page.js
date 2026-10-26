import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PRODUCTS, getProductById } from "@/data/products";
import BuyButton from "@/components/marketplace/BuyButton";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzEyMTIxMiIvPjwvc3ZnPg==";

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return { title: "Product Not Found — Expendry" };
  }
  return {
    title: `${product.name} — Expendry Tooling Marketplace`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/marketplace" className="hover:text-neutral-200 transition">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-neutral-500">{product.category}</span>
          <span>/</span>
          <span className="text-neutral-200 font-medium truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-neutral-800">
          {/* Visual Showcase Panel */}
          <div className="lg:col-span-6 rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-8 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
            <div className="relative w-48 h-48 mb-6">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                priority={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-contain"
              />
            </div>

            {product.has3DModel ? (
              <Link
                href={`/showcase?model=${product.modelId}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#26d464]/10 border border-[#26d464]/30 text-[#26d464] hover:bg-[#26d464]/20 transition text-xs font-semibold"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                  />
                </svg>
                <span>Inspect in Interactive 3D Viewer</span>
              </Link>
            ) : (
              <span className="text-xs text-neutral-500">
                Standard 2D Tooling Model
              </span>
            )}
          </div>

          {/* Product Meta & Purchase Panel */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
                  {product.category}
                </span>
                <span className="text-xs text-[#26d464] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#26d464]"></span>
                  In Stock & Ready for Dispatch
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm font-mono text-[#26d464]">
                  {(product.price * 2).toFixed(0)} EXPEN Tokens
                </span>
              </div>

              <p className="mt-6 text-sm text-neutral-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <BuyButton product={product} />

              <Link
                href="/marketplace"
                className="px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-200 text-sm font-semibold transition text-center"
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="py-10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>Technical Specifications</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
              Verified Specs
            </span>
          </h2>

          <div className="rounded-xl border border-neutral-800 bg-[#0d0d0d] overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-800 text-left text-sm">
              <tbody className="divide-y divide-neutral-800/80">
                <tr className="bg-neutral-950/40">
                  <td className="px-6 py-4 font-medium text-neutral-400 w-1/3">
                    Product Identifier
                  </td>
                  <td className="px-6 py-4 text-neutral-200 font-mono text-xs">
                    {product.id}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-neutral-400">
                    Category Classification
                  </td>
                  <td className="px-6 py-4 text-neutral-200">
                    {product.category}
                  </td>
                </tr>
                {product.specs &&
                  Object.entries(product.specs).map(([specKey, specVal]) => (
                    <tr key={specKey} className="even:bg-neutral-950/40">
                      <td className="px-6 py-4 font-medium text-neutral-400 capitalize">
                        {specKey.replace(/([A-Z])/g, " $1")}
                      </td>
                      <td className="px-6 py-4 text-neutral-200 font-mono text-xs">
                        {specVal}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
