import { MenuPlacement } from "@/sanity/menuPlacements";

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
  menuPlacement: string[] | null;
};

export const infoPageLinks = (
  pages: InfoPage[],
  placement: MenuPlacement,
): NavLink[] =>
  pages
    .filter((page) =>
      page.menuPlacement?.length
        ? page.menuPlacement.includes(placement)
        : // Sider uten plassering havner i sekundærmenyen
          placement === "sekundaermeny",
    )
    .map((page) => ({
      href: `/info/${page.slug?.current}`,
      label: page.title ?? "",
    }));
