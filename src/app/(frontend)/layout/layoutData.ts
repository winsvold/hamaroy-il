import { sanityFetch } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { cache } from "react";

const layoutQuery = defineQuery(`{
  "siteSettings": *[_type == "siteSettings"][0]{ logo, footerText, contactEmail },
  "infoPages": *[_type == "infoPage"] | order(orderRank asc, title asc) {
    title,
    slug,
    menuPlacement,
  },
  "clubs": *[_type == "club"] | order(name asc) { name, slug }
}`);

/** Felles for metadata, toppmeny og bunntekst, så det blir ett kall per side */
export const getLayoutData = cache(() => sanityFetch(layoutQuery));
