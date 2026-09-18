import { FooterPlacement, MenuPlacement } from "@/sanity/menuPlacements";

export type NavLink = { href: string; label: string };

/** Står alltid først i menyen og i bunnteksten */
export const fixedLinks: NavLink[] = [
  { href: "/kalender", label: "Kalender" },
  { href: "/faste-aktiviteter", label: "Faste aktiviteter" },
  { href: "/lokaler", label: "Lokaler" },
];

type InfoPage = {
  title: string | null;
  slug: { current?: string } | null;
  menuPlacement: string | null;
  footerPlacement: string | null;
};

const linksTo = (
  pages: InfoPage[],
  field: "menuPlacement" | "footerPlacement",
  placement: string,
): NavLink[] =>
  pages
    .filter((page) => page[field] === placement)
    .map((page) => ({
      href: `/info/${page.slug?.current}`,
      label: page.title ?? "",
    }));

export const menuLinks = (pages: InfoPage[], placement: MenuPlacement) =>
  linksTo(pages, "menuPlacement", placement);

export const footerLinks = (pages: InfoPage[], placement: FooterPlacement) =>
  linksTo(pages, "footerPlacement", placement);
