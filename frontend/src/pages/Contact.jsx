import { useState } from \"react\";
import { apiClient } from \"@/lib/api\";
import { Mail, Phone, MapPin, Clock, Check } from \"lucide-react\";

export default function Contact() {
  const [form, setForm] = useState({ full_name: \"\", email: \"\", phone: \"\", subject: \"General enquiry\", message: \"\" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(\"/enquiries\", form);
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid=\"contact-page\" className=\"pt-28 pb-24\">
      <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16\">
        <div className=\"lg:col-span-5\">
          <p className=\"overline text-[#7A1A2A] mb-3\">Visit the Branch</p>
          <h1 className=\"font-serif text-4xl md:text-6xl tracking-tight text-[#0F172A] leading-[0.95]\">
            Pop in. <span className=\"italic\">The kettle is always on.</span>
          </h1>
          <p className=\"mt-6 text-[#475569] leading-relaxed\">
            Right on Regent Street, our office is a short walk from Parker's Piece and the city centre. Come in for a coffee and a chat about Cambridge property.
          </p>

          <div className=\"mt-10 space-y-5 text-sm\">
            <div className=\"flex gap-3 items-start\">
              <MapPin size={18} strokeWidth={1.5} className=\"text-[#7A1A2A] mt-0.5\" />
              <span>64 Regent St, Cambridge CB2 1DP, United Kingdom</span>
            </div>
            <a href=\"tel:+441223785791\" className=\"flex gap-3 items-center text-[#0F172A] hover:text-[#7A1A2A]\" data-testid=\"contact-phone\">
              <Phone size={18} strokeWidth={1.5} className=\"text-[#7A1A2A]\" /> 01223 785 791
            </a>
            <a href=\"mailto:cambridge@haart.co.uk\" className=\"flex gap-3 items-center text-[#0F172A] hover:text-[#7A1A2A]\" data-testid=\"contact-email\">
              <Mail size={18} strokeWidth={1.5} className=\"text-[#7A1A2A]\" /> cambridge@haart.co.uk
            </a>
            <div className=\"flex gap-3 items-start\">
              <Clock size={18} strokeWidth={1.5} className=\"text-[#7A1A2A] mt-0.5\" />
              <div>
                <p>Mon – Fri · 08:30 – 18:30</p>
                <p>Saturday · 09:00 – 17:00</p>
                <p className=\"text-[#94A3B8]\">Sunday · Closed</p>
              </div>
            </div>
          </div>

          <div className=\"mt-10 border border-[#D1CDCA] overflow-hidden aspect-[16/12]\">
            <iframe
              title=\"Office Map\"
              className=\"w-full h-full\"
              src=\"https://www.openstreetmap.org/export/embed.html?bbox=0.118%2C52.198%2C0.128%2C52.207&layer=mapnik&marker=52.2026%2C0.1218\"
            />
          </div>
        </div>

        <div className=\"lg:col-span-7\">
          <div className=\"bg-white border border-[#D1CDCA] p-8 md:p-12\">
            {done ? (
              <div data-testid=\"contact-success\" className=\"text-center py-12\">
                <Check size={48} strokeWidth={1} className=\"text-[#7A1A2A] mx-auto\" />
                <h2 className=\"font-serif text-4xl mt-6 text-[#0F172A]\">Message received.</h2>
                <p className=\"mt-3 text-[#475569]\">We'll respond within the next working hour.</p>
              </div>
            ) : (
              <form onSubmit={submit} className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                <div className=\"md:col-span-2\">
                  <p className=\"overline text-[#475569]\">Send us a message</p>
                </div>
                <div>
                  <label className=\"field-label\">Full Name</label>
                  <input required className=\"field-input\" data-testid=\"contact-name\" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div>
                  <label className=\"field-label\">Email</label>
                  <input required type=\"email\" className=\"field-input\" data-testid=\"contact-email-input\" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className=\"field-label\">Phone</label>
                  <input className=\"field-input\" data-testid=\"contact-phone-input\" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className=\"field-label\">Subject</label>
                  <select className=\"field-input\" data-testid=\"contact-subject\" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                    <option>General enquiry</option>
                    <option>Buying a property</option>
                    <option>Selling a property</option>
                    <option>Renting a property</option>
                    <option>Becoming a landlord</option>
                    <option>Mortgage advice</option>
                  </select>
                </div>
                <div className=\"md:col-span-2\">
                  <label className=\"field-label\">Message</label>
                  <textarea required rows={6} className=\"field-input\" data-testid=\"contact-message\" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <div className=\"md:col-span-2\">
                  <button disabled={submitting} type=\"submit\" className=\"btn-primary\" data-testid=\"contact-submit\">
                    {submitting ? \"Sending…\" : \"Send Message\"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
