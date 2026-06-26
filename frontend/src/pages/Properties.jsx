import { useEffect, useMemo, useState } from \"react\";
import { useSearchParams } from \"react-router-dom\";
import { apiClient } from \"@/lib/api\";
import PropertyCard from \"@/components/PropertyCard\";
import { SlidersHorizontal, X } from \"lucide-react\";

export default function Properties() {
  const [params, setParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const listingType = params.get(\"type\") || \"sale\";
  const area = params.get(\"area\") || \"\";
  const minPrice = params.get(\"min\") || \"\";
  const maxPrice = params.get(\"max\") || \"\";
  const beds = params.get(\"beds\") || \"\";
  const propType = params.get(\"ptype\") || \"\";
  const sort = params.get(\"sort\") || \"newest\";

  useEffect(() => {
    apiClient.get(\"/properties/areas\").then((r) => setAreas(r.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = { listing_type: listingType };
    if (area) q.area = area;
    if (minPrice) q.min_price = minPrice;
    if (maxPrice) q.max_price = maxPrice;
    if (beds) q.bedrooms = beds;
    if (propType) q.property_type = propType;

    apiClient
      .get(\"/properties\", { params: q })
      .then((r) => setProperties(r.data || []))
      .finally(() => setLoading(false));
  }, [listingType, area, minPrice, maxPrice, beds, propType]);

  const sorted = useMemo(() => {
    const arr = [...properties];
    if (sort === \"price-asc\") arr.sort((a, b) => a.price - b.price);
    if (sort === \"price-desc\") arr.sort((a, b) => b.price - a.price);
    if (sort === \"beds-desc\") arr.sort((a, b) => b.bedrooms - a.bedrooms);
    return arr;
  }, [properties, sort]);

  const setParam = (k, v) => {
    const p = new URLSearchParams(params);
    if (v) p.set(k, v);
    else p.delete(k);
    setParams(p);
  };

  const clearAll = () => {
    setParams({ type: listingType });
  };

  return (
    <div data-testid=\"properties-page\" className=\"pt-28 pb-24 bg-[#F9F8F6] min-h-screen\">
      <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16\">
        {/* Heading */}
        <div className=\"flex items-end justify-between flex-wrap gap-6 mb-10\">
          <div>
            <p className=\"overline text-[#7A1A2A] mb-3\">{listingType === \"rent\" ? \"To Let\" : \"For Sale\"}</p>
            <h1 className=\"font-serif text-4xl md:text-5xl tracking-tight text-[#0F172A]\">
              Cambridge properties {listingType === \"rent\" ? \"to rent\" : \"for sale\"}
            </h1>
            <p className=\"mt-2 text-sm text-[#475569]\">{loading ? \"Loading…\" : `${sorted.length} homes available`}</p>
          </div>

          <div className=\"flex items-center gap-3\">
            {/* Tabs */}
            <div className=\"flex border border-[#0F172A]\">
              {[
                { v: \"sale\", label: \"Buy\" },
                { v: \"rent\", label: \"Rent\" },
              ].map((t) => (
                <button
                  key={t.v}
                  data-testid={`tab-${t.v}`}
                  onClick={() => setParam(\"type\", t.v)}
                  className={`px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                    listingType === t.v
                      ? \"bg-[#0F172A] text-[#F9F8F6]\"
                      : \"bg-transparent text-[#0F172A] hover:bg-[#0F172A]/5\"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              data-testid=\"toggle-filters-btn\"
              onClick={() => setShowFilters((v) => !v)}
              className=\"lg:hidden btn-secondary !px-4 !py-2\"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} /> Filters
            </button>
          </div>
        </div>

        <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-10\">
          {/* Filters */}
          <aside
            className={`lg:col-span-3 ${showFilters ? \"block\" : \"hidden lg:block\"}`}
            data-testid=\"filters-panel\"
          >
            <div className=\"bg-white border border-[#D1CDCA] p-6 sticky top-28\">
              <div className=\"flex items-center justify-between mb-6\">
                <h3 className=\"overline text-[#0F172A]\">Filters</h3>
                <button onClick={clearAll} data-testid=\"clear-filters-btn\" className=\"text-[11px] uppercase tracking-[0.2em] text-[#7A1A2A] hover:underline\">
                  Clear all
                </button>
              </div>

              <label className=\"field-label\">Area</label>
              <select className=\"field-input mb-5\" value={area} onChange={(e) => setParam(\"area\", e.target.value)} data-testid=\"filter-area\">
                <option value=\"\">All Cambridge</option>
                {areas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>

              <label className=\"field-label\">Min price (£)</label>
              <input type=\"number\" className=\"field-input mb-5\" value={minPrice} onChange={(e) => setParam(\"min\", e.target.value)} data-testid=\"filter-min\" />

              <label className=\"field-label\">Max price (£)</label>
              <input type=\"number\" className=\"field-input mb-5\" value={maxPrice} onChange={(e) => setParam(\"max\", e.target.value)} data-testid=\"filter-max\" />

              <label className=\"field-label\">Bedrooms</label>
              <select className=\"field-input mb-5\" value={beds} onChange={(e) => setParam(\"beds\", e.target.value)} data-testid=\"filter-beds\">
                <option value=\"\">Any</option>
                <option value=\"1\">1+</option>
                <option value=\"2\">2+</option>
                <option value=\"3\">3+</option>
                <option value=\"4\">4+</option>
                <option value=\"5\">5+</option>
              </select>

              <label className=\"field-label\">Property Type</label>
              <select className=\"field-input\" value={propType} onChange={(e) => setParam(\"ptype\", e.target.value)} data-testid=\"filter-ptype\">
                <option value=\"\">All types</option>
                <option value=\"detached\">Detached</option>
                <option value=\"semi-detached\">Semi-detached</option>
                <option value=\"terraced\">Terraced</option>
                <option value=\"apartment\">Apartment</option>
                <option value=\"cottage\">Cottage</option>
                <option value=\"studio\">Studio</option>
              </select>
            </div>
          </aside>

          {/* Listings */}
          <div className=\"lg:col-span-9\">
            <div className=\"flex items-center justify-end mb-6\">
              <label className=\"text-xs uppercase tracking-[0.2em] text-[#475569] mr-3\">Sort by</label>
              <select className=\"field-input w-auto\" value={sort} onChange={(e) => setParam(\"sort\", e.target.value)} data-testid=\"sort-select\">
                <option value=\"newest\">Newest</option>
                <option value=\"price-asc\">Price: Low to High</option>
                <option value=\"price-desc\">Price: High to Low</option>
                <option value=\"beds-desc\">Most Bedrooms</option>
              </select>
            </div>

            {loading ? (
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-8\">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className=\"aspect-[4/3] bg-[#EFECE6] animate-pulse\" />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className=\"border border-[#D1CDCA] bg-white p-16 text-center\">
                <p className=\"font-serif text-3xl text-[#0F172A]\">No properties match your filters.</p>
                <p className=\"mt-2 text-sm text-[#475569]\">Try removing some criteria, or contact us to register your requirements.</p>
                <button onClick={clearAll} className=\"btn-secondary mt-6\" data-testid=\"no-results-clear\">
                  <X size={14} strokeWidth={1.5} /> Clear Filters
                </button>
              </div>
            ) : (
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-10\">
                {sorted.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
