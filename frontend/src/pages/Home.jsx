import { useEffect, useState } from \"react\";
import { Link } from \"react-router-dom\";
import { apiClient } from \"@/lib/api\";
import SearchBar from \"@/components/SearchBar\";
import PropertyCard from \"@/components/PropertyCard\";
import {
  Star,
  ArrowRight,
  Home as HomeIcon,
  Key,
  Calculator,
  ScrollText,
  ShieldCheck,
  LandPlot,
} from \"lucide-react\";

const HERO_IMG =
  \"https://images.pexels.com/photos/36155657/pexels-photo-36155657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600\";
const ABOUT_IMG =
  \"https://images.unsplash.com/photo-1627411437849-4bc5a9b9341d?w=1400&q=85\";

const SERVICES = [
  { icon: HomeIcon, title: \"Property Sales\", desc: \"From terraces to townhouses — bespoke marketing that achieves the best price.\" },
  { icon: Key, title: \"Residential Lettings\", desc: \"Full management or let-only, with award-winning tenant matching across Cambridge.\" },
  { icon: Calculator, title: \"Mortgage Advice\", desc: \"Whole-of-market mortgage brokers helping you secure the right rate, fast.\" },
  { icon: ScrollText, title: \"Conveyancing\", desc: \"Trusted legal partners to take your transaction from acceptance to completion.\" },
  { icon: ShieldCheck, title: \"Property Management\", desc: \"LetTrack-powered landlord portal, inspections, repairs and tenant care.\" },
  { icon: LandPlot, title: \"Land & Investments\", desc: \"Discreet acquisition and sale of development sites and investment portfolios.\" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    apiClient.get(\"/properties\", { params: { featured: true, limit: 6 } })
      .then((r) => setFeatured(r.data || []))
      .catch(() => {});
    apiClient.get(\"/reviews\")
      .then((r) => setReviews((r.data || []).slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <div data-testid=\"home-page\">
      {/* HERO */}
      <section className=\"relative min-h-[100svh] flex flex-col\">
        <div className=\"absolute inset-0\">
          <img src={HERO_IMG} alt=\"Cambridge architecture\" className=\"w-full h-full object-cover\" />
          <div className=\"absolute inset-0 hero-overlay\" />
        </div>

        <div className=\"relative z-10 flex-1 flex flex-col justify-end pb-12 md:pb-20\">
          <div className=\"max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-16\">
            <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-12 items-end\">
              <div className=\"lg:col-span-7 text-[#F9F8F6] fade-up\">
                <p className=\"overline text-[#F9F8F6]/80 mb-5\">Cambridge · 64 Regent Street</p>
                <h1 className=\"font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance\">
                  Cambridge homes, <br />
                  <span className=\"italic text-[#E2C29A]\">handled with heart.</span>
                </h1>
                <p className=\"mt-7 max-w-xl text-[#F9F8F6]/85 text-base md:text-lg font-light leading-relaxed\">
                  Sales, lettings, mortgage and conveyancing — delivered by a Cambridge team that locals have trusted for over two decades.
                </p>
                <div className=\"mt-9 flex flex-wrap gap-4\">
                  <Link to=\"/properties?type=sale\" className=\"btn-primary\" data-testid=\"hero-cta-browse\">
                    Browse Properties <ArrowRight size={14} strokeWidth={1.7} />
                  </Link>
                  <Link to=\"/valuation\" className=\"btn-secondary border-white text-white hover:bg-white hover:text-[#0F172A]\" data-testid=\"hero-cta-valuation\">
                    Free Valuation
                  </Link>
                </div>

                <div className=\"mt-10 flex items-center gap-3 text-[#F9F8F6]/90\">
                  <div className=\"flex\">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className=\"fill-[#E2C29A] text-[#E2C29A]\" strokeWidth={1} />
                    ))}
                  </div>
                  <span className=\"text-sm\">
                    <strong>4.8</strong> · 1,984 Google reviews
                  </span>
                </div>
              </div>

              <div className=\"lg:col-span-5 fade-up delay-2\">
                <SearchBar variant=\"hero\" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className=\"py-20 md:py-32\">
        <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16\">
          <div className=\"flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14\">
            <div className=\"max-w-xl\">
              <p className=\"overline text-[#7A1A2A] mb-3\">Selected Homes</p>
              <h2 className=\"font-serif text-4xl md:text-5xl tracking-tight text-[#0F172A]\">
                A current selection of Cambridge properties.
              </h2>
            </div>
            <Link to=\"/properties\" className=\"btn-secondary self-start md:self-end\" data-testid=\"view-all-properties\">
              View All <ArrowRight size={14} strokeWidth={1.7} />
            </Link>
          </div>

          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10\">
            {featured.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / CAMBRIDGE */}
      <section className=\"bg-[#EFECE6] py-20 md:py-32\">
        <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center\">
          <div className=\"lg:col-span-6\">
            <img src={ABOUT_IMG} alt=\"Cambridge architecture\" className=\"w-full h-[520px] object-cover\" />
          </div>
          <div className=\"lg:col-span-6\">
            <p className=\"overline text-[#7A1A2A] mb-3\">The Cambridge Branch</p>
            <h2 className=\"font-serif text-4xl md:text-5xl tracking-tight text-[#0F172A]\">
              A name Cambridge has trusted for generations.
            </h2>
            <p className=\"mt-6 text-[#475569] text-base leading-relaxed max-w-xl\">
              From our office on Regent Street, we have helped thousands of Cambridge households move — across colleges, villages and the city's most coveted postcodes. Our partners know each road, each school catchment, each conservation rule.
            </p>
            <div className=\"mt-10 grid grid-cols-3 gap-6 max-w-md\">
              {[
                { n: \"1,984\", l: \"Google Reviews\" },
                { n: \"4.8\", l: \"Average Rating\" },
                { n: \"20+\", l: \"Years on Regent St\" },
              ].map((s) => (
                <div key={s.l}>
                  <p className=\"font-serif text-4xl text-[#0F172A]\">{s.n}</p>
                  <p className=\"text-xs uppercase tracking-[0.18em] text-[#475569] mt-1\">{s.l}</p>
                </div>
              ))}
            </div>
            <Link to=\"/about\" data-testid=\"home-about-link\" className=\"btn-primary mt-10\">
              Meet the Team <ArrowRight size={14} strokeWidth={1.7} />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className=\"py-20 md:py-32\">
        <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16\">
          <div className=\"max-w-2xl mb-14\">
            <p className=\"overline text-[#7A1A2A] mb-3\">What We Do</p>
            <h2 className=\"font-serif text-4xl md:text-5xl tracking-tight text-[#0F172A]\">
              Every move, under one roof.
            </h2>
          </div>
          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D1CDCA] border border-[#D1CDCA]\">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className=\"bg-[#F9F8F6] p-10 hover:bg-white transition-colors duration-300\"
                  data-testid={`service-${i}`}
                >
                  <Icon size={28} strokeWidth={1.2} className=\"text-[#7A1A2A]\" />
                  <h3 className=\"font-serif text-2xl mt-5 text-[#0F172A]\">{s.title}</h3>
                  <p className=\"mt-3 text-sm text-[#475569] leading-relaxed\">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className=\"bg-[#0F172A] text-[#F9F8F6] py-20 md:py-32\">
        <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16\">
          <div className=\"max-w-2xl mb-14\">
            <p className=\"overline text-[#E2C29A] mb-3\">Client Voices</p>
            <h2 className=\"font-serif text-4xl md:text-5xl tracking-tight\">
              Loved across Cambridge — and verified on Google.
            </h2>
          </div>
          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8\">
            {reviews.map((r, i) => (
              <div
                key={r.id}
                data-testid={`review-${i}`}
                className=\"border border-white/15 p-8 hover:border-[#E2C29A] transition-colors duration-300\"
              >
                <div className=\"flex\">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={14} className=\"fill-[#E2C29A] text-[#E2C29A]\" strokeWidth={1} />
                  ))}
                </div>
                <p className=\"mt-5 font-serif text-xl italic leading-snug text-[#F9F8F6]\">“{r.text}”</p>
                <div className=\"mt-6 flex items-center justify-between text-xs\">
                  <span className=\"text-[#F9F8F6]/80 font-medium\">{r.author}</span>
                  <span className=\"text-[#F9F8F6]/40 uppercase tracking-[0.2em]\">{r.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className=\"py-20 md:py-32 bg-[#F9F8F6]\">
        <div className=\"max-w-[1100px] mx-auto px-6 md:px-12 text-center\">
          <p className=\"overline text-[#7A1A2A]\">Free, no-obligation</p>
          <h2 className=\"font-serif text-4xl md:text-6xl tracking-tight mt-4 text-[#0F172A]\">
            Curious what your home is worth?
          </h2>
          <p className=\"mt-6 text-[#475569] max-w-xl mx-auto\">
            Our Cambridge valuers visit in person — armed with twenty years of local sold-price data and a clear, honest figure.
          </p>
          <Link to=\"/valuation\" className=\"btn-primary mt-9\" data-testid=\"cta-book-valuation\">
            Book a Free Valuation <ArrowRight size={14} strokeWidth={1.7} />
          </Link>
        </div>
      </section>
    </div>
  );
}
