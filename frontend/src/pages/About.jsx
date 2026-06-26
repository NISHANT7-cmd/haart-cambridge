import { useEffect, useState } from \"react\";
import { Link } from \"react-router-dom\";
import { apiClient } from \"@/lib/api\";
import { Mail, Phone, ArrowRight } from \"lucide-react\";

export default function About() {
  const [agents, setAgents] = useState([]);
  useEffect(() => {
    apiClient.get(\"/agents\").then((r) => setAgents(r.data || []));
  }, []);

  return (
    <div data-testid=\"about-page\" className=\"pt-28 pb-24\">
      <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16\">
        <div className=\"max-w-3xl\">
          <p className=\"overline text-[#7A1A2A] mb-3\">About haart Cambridge</p>
          <h1 className=\"font-serif text-4xl md:text-6xl tracking-tight text-[#0F172A] leading-[0.95]\">
            A Regent Street institution — <span className=\"italic\">moving Cambridge forward.</span>
          </h1>
          <p className=\"mt-7 text-[#475569] leading-relaxed text-lg max-w-2xl\">
            For more than two decades, haart Cambridge has helped families, investors, students and downsizers find — and finance — their next home. We are proudly local, with a national network behind us.
          </p>
        </div>

        <div className=\"mt-20\">
          <div className=\"flex items-end justify-between mb-12 flex-wrap gap-4\">
            <h2 className=\"font-serif text-3xl md:text-4xl text-[#0F172A]\">Meet the Cambridge Team</h2>
            <Link to=\"/contact\" className=\"btn-secondary\" data-testid=\"about-contact-link\">
              Contact the Branch <ArrowRight size={14} strokeWidth={1.7} />
            </Link>
          </div>
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D1CDCA] border border-[#D1CDCA]\">
            {agents.map((a, i) => (
              <div key={a.id} data-testid={`agent-card-${i}`} className=\"bg-[#F9F8F6] p-8\">
                <div className=\"card-image-wrap aspect-[3/4] bg-[#EFECE6]\">
                  <img src={a.image} alt={a.name} className=\"w-full h-full object-cover\" />
                </div>
                <p className=\"overline text-[#7A1A2A] mt-5\">{a.role}</p>
                <h3 className=\"font-serif text-2xl mt-2 text-[#0F172A]\">{a.name}</h3>
                <p className=\"text-sm text-[#475569] mt-3 leading-relaxed\">{a.bio}</p>
                <div className=\"mt-5 space-y-2 text-xs\">
                  <a className=\"flex items-center gap-2 text-[#0F172A] hover:text-[#7A1A2A]\" href={`mailto:${a.email}`}><Mail size={12} strokeWidth={1.5} />{a.email}</a>
                  <a className=\"flex items-center gap-2 text-[#0F172A] hover:text-[#7A1A2A]\" href={`tel:${a.phone}`}><Phone size={12} strokeWidth={1.5} />{a.phone}</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className=\"mt-24 grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#D1CDCA] border border-[#D1CDCA]\">
          {[
            { k: \"1,984\", v: \"Verified Google Reviews\" },
            { k: \"4.8 / 5\", v: \"Average Customer Rating\" },
            { k: \"20+ yrs\", v: \"On Regent Street\" },
          ].map((s) => (
            <div key={s.v} className=\"bg-[#F9F8F6] p-10 text-center\">
              <p className=\"font-serif text-5xl text-[#0F172A]\">{s.k}</p>
              <p className=\"overline text-[#475569] mt-3\">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
