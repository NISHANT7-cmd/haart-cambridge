import { Link } from \"react-router-dom\";
import { MapPin, Phone, Mail, Clock } from \"lucide-react\";

export default function Footer() {
  return (
    <footer
      data-testid=\"site-footer\"
      className=\"bg-[#0F172A] text-[#F9F8F6] mt-24\"
    >
      <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12\">
        <div>
          <div className=\"font-serif text-3xl\">
            haart<span className=\"text-[#C49B6A]\">.</span>
          </div>
          <p className=\"overline mt-1 opacity-80\">Cambridge Branch</p>
          <p className=\"mt-6 text-sm leading-relaxed text-[#F9F8F6]/70 max-w-xs\">
            Trusted Cambridge estate and lettings agents on Regent Street since the start. Sales, lettings, mortgages and conveyancing under one elegant roof.
          </p>
        </div>

        <div>
          <p className=\"overline opacity-70 mb-5\">Visit Us</p>
          <ul className=\"space-y-4 text-sm text-[#F9F8F6]/80\">
            <li className=\"flex gap-3\"><MapPin size={16} strokeWidth={1.5} className=\"mt-0.5 flex-shrink-0\" />64 Regent St,<br/>Cambridge CB2 1DP</li>
            <li className=\"flex gap-3\"><Phone size={16} strokeWidth={1.5} className=\"mt-0.5\" /><a href=\"tel:+441223785791\" data-testid=\"footer-phone\">01223 785 791</a></li>
            <li className=\"flex gap-3\"><Mail size={16} strokeWidth={1.5} className=\"mt-0.5\" /><a href=\"mailto:cambridge@haart.co.uk\" data-testid=\"footer-email\">cambridge@haart.co.uk</a></li>
          </ul>
        </div>

        <div>
          <p className=\"overline opacity-70 mb-5\">Services</p>
          <ul className=\"space-y-3 text-sm text-[#F9F8F6]/80\">
            <li><Link to=\"/properties?type=sale\" data-testid=\"footer-link-buy\">Properties for Sale</Link></li>
            <li><Link to=\"/properties?type=rent\" data-testid=\"footer-link-rent\">Properties to Rent</Link></li>
            <li><Link to=\"/valuation\" data-testid=\"footer-link-valuation\">Free Valuation</Link></li>
            <li><Link to=\"/about\" data-testid=\"footer-link-mortgage\">Mortgage Advice</Link></li>
            <li><Link to=\"/about\" data-testid=\"footer-link-conveyancing\">Conveyancing</Link></li>
          </ul>
        </div>

        <div>
          <p className=\"overline opacity-70 mb-5\">Opening Hours</p>
          <ul className=\"space-y-2 text-sm text-[#F9F8F6]/80\">
            <li className=\"flex items-start gap-3\"><Clock size={16} strokeWidth={1.5} className=\"mt-0.5\" /><span>Mon&ndash;Fri <span className=\"float-right ml-6\">08:30 – 18:30</span></span></li>
            <li className=\"ml-7\">Saturday <span className=\"float-right\">09:00 – 17:00</span></li>
            <li className=\"ml-7 opacity-60\">Sunday <span className=\"float-right\">Closed</span></li>
          </ul>
        </div>
      </div>

      <div className=\"border-t border-white/10\">
        <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-[#F9F8F6]/50\">
          <p>© {new Date().getFullYear()} haart Estate and Lettings Agents — Cambridge.</p>
          <p className=\"tracking-[0.18em] uppercase\">Rated 4.8 / 5 from 1,984 Google reviews</p>
        </div>
      </div>
    </footer>
  );
}
