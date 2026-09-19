import { CardGrid } from "@/components/CardGrid";
import { LinkCard, LinkCardTitle } from "@/components/LinkCard";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Box } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import { LocationsQueryResult } from "../../../../sanity.types";
import { PageContent } from "../layout/PageContent";
import { PageHeader } from "../layout/PageHeader";

const locationsQuery = defineQuery(`*[_type == "location"] | order(name asc) {
  _id,
  name,
  slug,
  "image": images[defined(asset)][0],
}`);

const Page = async () => {
  const locations = await sanityFetch(locationsQuery);

  return (
    <>
      <PageHeader title="Lokaler og steder" />
      <PageContent>
        <CardGrid>
          {locations.map((location) => (
            <LocationTile key={location._id} location={location} />
          ))}
        </CardGrid>
      </PageContent>
    </>
  );
};

const LocationTile = ({
  location,
}: {
  location: LocationsQueryResult[number];
}) => (
  <LinkCard display="flex" alignItems="center" gap="1rem" padding="1rem">
    {location.image && (
      <Box asChild flexShrink={0} boxSize="4.5rem" objectFit="cover">
        <Image
          alt=""
          src={urlFor(location.image).size(300, 300).url()}
          width={300}
          height={300}
        />
      </Box>
    )}
    <LinkCardTitle
      as="h2"
      href={`/lokaler/${location.slug?.current}`}
      fontSize="md"
    >
      {location.name}
    </LinkCardTitle>
  </LinkCard>
);

export default Page;
