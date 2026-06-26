import { useEffect, useState } from \"react\";
import { useParams, Link } from \"react-router-dom\";
import { apiClient, formatPrice, statusLabel } from \"@/lib/api\";
import { Bed, Bath, Sofa, MapPin, ArrowLeft, Mail, Phone, Check } from \"lucide-react\";

export default function PropertyDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [active, setActive] = useState(0);
  const [form, setForm] = useState({ full_name: \"\", email: \"\", phone: \"\", message: \"I'd like to arrange a viewing.\" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    apiClient.get(`/properties/${id}`).then((r) => setData(r.data)).catch(() => setData({ error: true }));
  }, [id]);

  const submitEnquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(\"/enquiries\", {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        subject: `Enquiry: ${data.property.title}`,
        message: form.message,
        property_id: id,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!data) {
    return <div className=\"pt-32 text-center text-[#475569]\">Loading…</div>;
  }
  if (data.error) {
    return <div className=\"pt-32 text-center text-[#475569]\">Property not found.</div>;
  }

  const { property, agent } = data;
  const badge = statusLabel(property.status, property.listing_type);

  return (
    <div data-testid=\"property-detail\" className=\"pt-28 pb-24\">
      <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16\">
        <Link to=\"/properties\" className=\"inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#475569] hover:text-[#7A1A2A] mb-6\" data-testid=\"back-to-list\">
          <ArrowLeft size={14} strokeWidth={1.5} /> Back to listings
        </Link>

        {/* Gallery */}
        <div className=\"grid grid-cols-1 md:grid-cols-12 gap-3 mb-10\">
          <div className=\"md:col-span-8 relative\">
            <img src={property.images[active]} alt={property.title} className=\"w-full h-[260px] md:h-[560px] object-cover\" />
            <div className=\"absolute top-4 left-4 bg-[#0F172A] text-[#F9F8F6] text-[11px] tracking-[0.22em] uppercase px-3 py-1.5\">
              {badge}
            </div>
          </div>
          <div className=\"md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3\">
            {property.images.slice(0, 4).map((src, i) => (
              <button
                key={i}
                data-testid={`gallery-thumb-${i}`}
                onClick={() => setActive(i)}
                className={`relative overflow-hidden border-2 ${i === active ? \"border-[#7A1A2A]\" : \"border-transparent\"}`}
              >
                <img src={src} alt={`view ${i}`} className=\"w-full h-[125px] md:h-[133px] object-cover\" />
              </button>
            ))}
          </div>
        </div>

        <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-12\">
          {/* Details */}
          <div className=\"lg:col-span-8\">
            <p className=\"overline text-[#7A1A2A]\">{property.area} · {property.postcode}</p>
            <h1 className=\"font-serif text-4xl md:text-5xl mt-3 tracking-tight text-[#0F172A]\">{property.title}</h1>
            <p className=\"text-[#475569] mt-2 flex items-center gap-2 text-sm\"><MapPin size={14} strokeWidth={1.5} />{property.address}, Cambridge {property.postcode}</p>

            <div className=\"flex items-baseline gap-6 mt-6\">
              <p className=\"font-serif text-5xl text-[#0F172A]\" data-testid=\"property-price\">{formatPrice(property.price, property.listing_type)}</p>
              {property.tenure && <p className=\"text-xs uppercase tracking-[0.18em] text-[#475569]\">{property.tenure}</p>}
            </div>

            <div className=\"mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D1CDCA] border border-[#D1CDCA]\">
              {[
                { i: Bed, l: \"Bedrooms\", v: property.bedrooms },
                { i: Bath, l: \"Bathrooms\", v: property.bathrooms },
                { i: Sofa, l: \"Receptions\", v: property.receptions },
                { i: Check, l: \"EPC Rating\", v: property.epc },
              ].map((s, idx) => {
                const I = s.i;
                return (
                  <div key={idx} className=\"bg-[#F9F8F6] p-6\">
                    <I size={20} strokeWidth={1.3} className=\"text-[#7A1A2A]\" />
                    <p className=\"font-serif text-3xl text-[#0F172A] mt-2\">{s.v}</p>
                    <p className=\"text-[11px] uppercase tracking-[0.2em] text-[#475569] mt-1\">{s.l}</p>
                  </div>
                );
              })}
            </div>

            <div className=\"mt-12\">
              <p className=\"overline text-[#7A1A2A] mb-3\">Description</p>
              <p className=\"font-serif text-xl md:text-2xl leading-relaxed text-[#0F172A] max-w-2xl\">{property.description}</p>
            </div>

            <div className=\"mt-12\">
              <p className=\"overline text-[#7A1A2A] mb-5\">Key Features</p>
              <ul className=\"grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8\">
                {property.features.map((f, i) => (
                  <li key={i} className=\"flex items-center gap-3 text-sm text-[#0F172A]\">
                    <Check size={16} strokeWidth={1.5} className=\"text-[#7A1A2A]\" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className=\"mt-12\">
              <p className=\"overline text-[#7A1A2A] mb-5\">Location</p>
              <div className=\"border border-[#D1CDCA] aspect-[16/9] overflow-hidden bg-[#EFECE6]\">
                <iframe
                  title=\"map\"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.01}%2C${property.latitude - 0.005}%2C${property.longitude + 0.01}%2C${property.latitude + 0.005}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`}
                  className=\"w-full h-full\"
                />
              </div>
            </div>
          </div>

          {/* Sticky enquiry */}
          <div className=\"lg:col-span-4\">
            <div className=\"sticky top-28 space-y-6\">
              {agent && (
                <div className=\"border border-[#D1CDCA] bg-white p-6 flex items-center gap-4\">
                  <img src={agent.image} alt={agent.name} className=\"w-16 h-16 object-cover\" />
                  <div>
                    <p className=\"overline text-[#7A1A2A]\">Your Agent</p>
                    <p className=\"font-serif text-xl text-[#0F172A] mt-1\">{agent.name}</p>
                    <p className=\"text-xs text-[#475569]\">{agent.role}</p>
                  </div>
                </div>
              )}

              <div className=\"border border-[#D1CDCA] bg-white p-7\">
                <p className=\"overline text-[#7A1A2A] mb-4\">Make an Enquiry</p>
                {submitted ? (
                  <div data-testid=\"enquiry-success\" className=\"text-center py-8\">
                    <Check size={36} strokeWidth={1.2} className=\"text-[#7A1A2A] mx-auto\" />
                    <p className=\"font-serif text-2xl mt-4 text-[#0F172A]\">Message sent.</p>
                    <p className=\"text-sm text-[#475569] mt-2\">A member of our team will be in touch within the next working hour.</p>
                  </div>
                ) : (
                  <form onSubmit={submitEnquiry} className=\"space-y-4\">
                    <div>
                      <label className=\"field-label\">Full Name</label>
                      <input required className=\"field-input\" data-testid=\"enq-name\" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                    </div>
                    <div>
                      <label className=\"field-label\">Email</label>
                      <input required type=\"email\" className=\"field-input\" data-testid=\"enq-email\" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div>
                      <label className=\"field-label\">Phone</label>
                      <input className=\"field-input\" data-testid=\"enq-phone\" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className=\"field-label\">Message</label>
                      <textarea rows={4} className=\"field-input\" data-testid=\"enq-message\" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <button disabled={submitting} type=\"submit\" className=\"btn-primary w-full justify-center\" data-testid=\"enq-submit\">
                      {submitting ? \"Sending…\" : \"Request Viewing\"}
                    </button>
                  </form>
                )}
                <div className=\"divider-rule my-6\" />
                <div className=\"space-y-3 text-sm\">
                  <a href=\"tel:+441223785791\" className=\"flex items-center gap-3 text-[#0F172A] hover:text-[#7A1A2A]\" data-testid=\"enq-call\">
                    <Phone size={14} strokeWidth={1.5} /> 01223 785 791
                  </a>
                  <a href=\"mailto:cambridge@haart.co.uk\" className=\"flex items-center gap-3 text-[#0F172A] hover:text-[#7A1A2A]\" data-testid=\"enq-mail\">
                    <Mail size={14} strokeWidth={1.5} /> cambridge@haart.co.uk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
