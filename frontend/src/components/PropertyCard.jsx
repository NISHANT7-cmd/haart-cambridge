import { Link } from \"react-router-dom\";
import { Bed, Bath, Square, MapPin } from \"lucide-react\";
import { formatPrice, statusLabel } from \"@/lib/api\";

export default function PropertyCard({ property, index = 0 }) {
  const badge = statusLabel(property.status, property.listing_type);
  return (
    <Link
      to={`/property/${property.id}`}
      data-testid={`property-card-${property.id}`}
      className=\"group block fade-up\"
      style={{ animationDelay: `${0.05 * (index % 6)}s` }}
    >
      <div className=\"card-image-wrap relative bg-[#EFECE6] aspect-[4/3]\">
        <img
          src={property.images?.[0]}
          alt={property.title}
          className=\"w-full h-full object-cover\"
          loading=\"lazy\"
        />
        <div className=\"absolute top-4 left-4 bg-[#0F172A] text-[#F9F8F6] text-[10px] tracking-[0.2em] uppercase px-3 py-1.5\">
          {badge}
        </div>
        {property.featured && (
          <div className=\"absolute top-4 right-4 bg-[#7A1A2A] text-[#F9F8F6] text-[10px] tracking-[0.2em] uppercase px-3 py-1.5\">
            Featured
          </div>
        )}
      </div>

      <div className=\"pt-5 border-t border-[#D1CDCA] mt-[-1px] bg-transparent\">
        <p className=\"overline text-[#7A1A2A]\">{property.area}</p>
        <h3 className=\"font-serif text-2xl mt-2 text-[#0F172A] leading-tight group-hover:text-[#7A1A2A] transition-colors duration-300\">
          {property.title}
        </h3>
        <p className=\"text-xs text-[#475569] mt-1 flex items-center gap-1\">
          <MapPin size={12} strokeWidth={1.5} /> {property.address}, {property.postcode}
        </p>

        <div className=\"mt-4 flex items-baseline justify-between\">
          <p className=\"font-serif text-2xl text-[#0F172A]\">
            {formatPrice(property.price, property.listing_type)}
          </p>
          <p className=\"text-[11px] uppercase tracking-[0.18em] text-[#475569]\">
            {property.property_type}
          </p>
        </div>

        <div className=\"mt-4 flex items-center gap-5 text-xs text-[#475569]\">
          <span className=\"flex items-center gap-1.5\"><Bed size={14} strokeWidth={1.5} /> {property.bedrooms} bed</span>
          <span className=\"flex items-center gap-1.5\"><Bath size={14} strokeWidth={1.5} /> {property.bathrooms} bath</span>
          <span className=\"flex items-center gap-1.5\"><Square size={14} strokeWidth={1.5} /> {property.receptions} recep</span>
          <span className=\"ml-auto text-[10px] tracking-[0.18em] uppercase border border-[#D1CDCA] px-2 py-0.5\">EPC {property.epc}</span>
        </div>
      </div>
    </Link>
  );
}
