import { sift } from "radash";

type Address = {
  address?: string | null;
  zip?: string | null;
  city?: string | null;
};

/** «Hamarøyhallen, 8294 Hamarøy» */
export const formatAddress = ({ address, zip, city }: Address) =>
  sift([address, sift([zip, city]).join(" ")]).join(", ");
