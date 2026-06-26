import { useState } from \"react\";
import { apiClient } from \"@/lib/api\";
import { Check, ArrowRight } from \"lucide-react\";

const initial = {
  full_name: \"\",
  email: \"\",
  phone: \"\",
  address: \"\",
  postcode: \"\",
  property_type: \"semi-detached\",
  bedrooms: 3,
  purpose: \"selling\",
  notes: \"\",
};

export default function Valuation() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(\"/valuations\", { ...form, bedrooms: Number(form.bedrooms) });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid=\"valuation-page\" className=\"pt-28 pb-24 min-h-screen\">
      <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16\">
        <div className=\"lg:col-span-5\">
          <p className=\"overline text-[#7A1A2A] mb-3\">Free Valuation</p>
          <h1 className=\"font-serif text-4xl md:text-6xl tracking-tight text-[#0F172A] leading-[0.95]\">
            A clear, honest figure — <span className=\"italic\">at your front door.</span>
          </h1>
          <p className=\"mt-6 text-[#475569] leading-relaxed\">
            Our Cambridge partners come to you with twenty years of sold-price data, comparable evidence, and a marketing plan tailored to your home. No obligation, ever.
          </p>

          <ul className=\"mt-10 space-y-4\">
            {[
              \"In-person visit by a Cambridge local\",
              \"Sale & lettings valuation in one appointment\",
              \"Honest price guidance, never inflated\",
              \"Free guidance on dressing & photography\",
            ].map((t) => (
              <li key={t} className=\"flex gap-3 items-center text-[#0F172A]\">
                <Check size={16} strokeWidth={1.5} className=\"text-[#7A1A2A]\" />
                <span className=\"text-sm\">{t}</span>
              </li>
            ))}
          </ul>

          <div className=\"mt-12 border-t border-[#D1CDCA] pt-8\">
            <p className=\"overline text-[#7A1A2A] mb-2\">Prefer to chat?</p>
            <p className=\"font-serif text-2xl text-[#0F172A]\">01223 785 791</p>
            <p className=\"text-xs uppercase tracking-[0.2em] text-[#475569] mt-1\">Mon–Fri · 08:30 – 18:30</p>
          </div>
        </div>

        <div className=\"lg:col-span-7\">
          <div className=\"bg-white border border-[#D1CDCA] p-8 md:p-12\">
            {done ? (
              <div data-testid=\"valuation-success\" className=\"text-center py-12\">
                <Check size={48} strokeWidth={1} className=\"text-[#7A1A2A] mx-auto\" />
                <h2 className=\"font-serif text-4xl mt-6 text-[#0F172A]\">Booking received.</h2>
                <p className=\"mt-3 text-[#475569] max-w-md mx-auto\">
                  Thank you {form.full_name.split(\" \")[0]}. A Cambridge partner will call you within one working hour to confirm the appointment.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                <div className=\"md:col-span-2\">
                  <p className=\"overline text-[#475569]\">Your Details</p>
                </div>
                <div>
                  <label className=\"field-label\">Full Name</label>
                  <input required className=\"field-input\" data-testid=\"val-name\" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div>
                  <label className=\"field-label\">Email</label>
                  <input required type=\"email\" className=\"field-input\" data-testid=\"val-email\" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className=\"field-label\">Phone</label>
                  <input required className=\"field-input\" data-testid=\"val-phone\" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className=\"field-label\">Purpose</label>
                  <select className=\"field-input\" data-testid=\"val-purpose\" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}>
                    <option value=\"selling\">Selling</option>
                    <option value=\"letting\">Letting</option>
                    <option value=\"both\">Both — Selling & Letting</option>
                  </select>
                </div>

                <div className=\"md:col-span-2 pt-4\">
                  <p className=\"overline text-[#475569]\">The Property</p>
                </div>
                <div className=\"md:col-span-2\">
                  <label className=\"field-label\">Property Address</label>
                  <input required className=\"field-input\" data-testid=\"val-address\" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div>
                  <label className=\"field-label\">Postcode</label>
                  <input required className=\"field-input\" data-testid=\"val-postcode\" value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} />
                </div>
                <div>
                  <label className=\"field-label\">Property Type</label>
                  <select className=\"field-input\" data-testid=\"val-type\" value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })}>
                    <option value=\"detached\">Detached</option>
                    <option value=\"semi-detached\">Semi-detached</option>
                    <option value=\"terraced\">Terraced</option>
                    <option value=\"apartment\">Apartment</option>
                    <option value=\"cottage\">Cottage</option>
                    <option value=\"bungalow\">Bungalow</option>
                  </select>
                </div>
                <div>
                  <label className=\"field-label\">Bedrooms</label>
                  <input required type=\"number\" min=\"0\" className=\"field-input\" data-testid=\"val-beds\" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
                </div>
                <div className=\"md:col-span-2\">
                  <label className=\"field-label\">Notes (optional)</label>
                  <textarea rows={3} className=\"field-input\" data-testid=\"val-notes\" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>

                <div className=\"md:col-span-2 pt-2\">
                  <button disabled={submitting} type=\"submit\" className=\"btn-primary\" data-testid=\"val-submit\">
                    {submitting ? \"Sending…\" : \"Book My Valuation\"} <ArrowRight size={14} strokeWidth={1.7} />
                  </button>
                  <p className=\"text-[11px] uppercase tracking-[0.18em] text-[#94A3B8] mt-4\">
                    By submitting, you agree to be contacted about your valuation.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
