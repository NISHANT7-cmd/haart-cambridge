import { useState } from \"react\";
import { useNavigate } from \"react-router-dom\";
import { Search, ChevronDown } from \"lucide-react\";

export default function SearchBar({ variant = \"hero\" }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(\"sale\");
  const [area, setArea] = useState(\"\");
  const [minPrice, setMinPrice] = useState(\"\");
  const [maxPrice, setMaxPrice] = useState(\"\");
  const [beds, setBeds] = useState(\"\");

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set(\"type\", tab);
    if (area) params.set(\"area\", area);
    if (minPrice) params.set(\"min\", minPrice);
    if (maxPrice) params.set(\"max\", maxPrice);
    if (beds) params.set(\"beds\", beds);
    navigate(`/properties?${params.toString()}`);
  };

  const wrapClass =
    variant === \"hero\"
      ? \"bg-white/95 backdrop-blur-md border border-[#D1CDCA] shadow-2xl\"
      : \"bg-white border border-[#D1CDCA]\";

  return (
    <div data-testid=\"search-bar\" className={`${wrapClass} p-6 md:p-8`}>
      <div className=\"flex gap-0 mb-6 border-b border-[#D1CDCA]\">
        {[
          { v: \"sale\", label: \"Buy\" },
          { v: \"rent\", label: \"Rent\" },
        ].map((t) => (
          <button
            key={t.v}
            type=\"button\"
            onClick={() => setTab(t.v)}
            data-testid={`search-tab-${t.v}`}
            className={`px-6 py-3 text-xs uppercase tracking-[0.22em] font-medium border-b-2 -mb-px transition-colors ${
              tab === t.v
                ? \"border-[#7A1A2A] text-[#7A1A2A]\"
                : \"border-transparent text-[#475569] hover:text-[#0F172A]\"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className=\"grid grid-cols-1 md:grid-cols-12 gap-4 items-end\">
        <div className=\"md:col-span-4\">
          <label className=\"field-label\">Location</label>
          <input
            data-testid=\"search-area-input\"
            placeholder=\"e.g. Trumpington, Newnham\"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className=\"field-input\"
          />
        </div>
        <div className=\"md:col-span-2\">
          <label className=\"field-label\">Min Price</label>
          <input
            data-testid=\"search-min-price\"
            type=\"number\"
            value={minPrice}
            placeholder={tab === \"rent\" ? \"£800\" : \"£300k\"}
            onChange={(e) => setMinPrice(e.target.value)}
            className=\"field-input\"
          />
        </div>
        <div className=\"md:col-span-2\">
          <label className=\"field-label\">Max Price</label>
          <input
            data-testid=\"search-max-price\"
            type=\"number\"
            value={maxPrice}
            placeholder={tab === \"rent\" ? \"£2500\" : \"£1.5m\"}
            onChange={(e) => setMaxPrice(e.target.value)}
            className=\"field-input\"
          />
        </div>
        <div className=\"md:col-span-2 relative\">
          <label className=\"field-label\">Bedrooms</label>
          <select
            data-testid=\"search-beds-select\"
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className=\"field-input appearance-none pr-8\"
          >
            <option value=\"\">Any</option>
            <option value=\"1\">1+</option>
            <option value=\"2\">2+</option>
            <option value=\"3\">3+</option>
            <option value=\"4\">4+</option>
            <option value=\"5\">5+</option>
          </select>
          <ChevronDown size={14} strokeWidth={1.5} className=\"absolute right-3 bottom-4 text-[#475569] pointer-events-none\" />
        </div>
        <div className=\"md:col-span-2\">
          <button
            type=\"submit\"
            data-testid=\"search-submit-btn\"
            className=\"btn-primary w-full justify-center\"
          >
            <Search size={14} strokeWidth={1.7} /> Search
          </button>
        </div>
      </form>
    </div>
  );
}
