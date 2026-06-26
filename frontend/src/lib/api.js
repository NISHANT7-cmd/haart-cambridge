import axios from \"axios\";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const apiClient = axios.create({
  baseURL: API,
  headers: { \"Content-Type\": \"application/json\" },
});

export const formatPrice = (price, listingType) => {
  if (price == null) return \"\";
  const formatted = new Intl.NumberFormat(\"en-GB\", {
    style: \"currency\",
    currency: \"GBP\",
    maximumFractionDigits: 0,
  }).format(price);
  return listingType === \"rent\" ? `${formatted} pcm` : formatted;
};

export const statusLabel = (status, listingType) => {
  const map = {
    available: listingType === \"rent\" ? \"TO LET\" : \"FOR SALE\",
    under_offer: \"UNDER OFFER\",
    let_agreed: \"LET AGREED\",
    sold: \"SOLD\",
  };
  return map[status] || \"FOR SALE\";
};
