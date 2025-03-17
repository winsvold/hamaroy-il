import { StudioComponentsPluginOptions } from "sanity";
import { StudioCSSOverrides } from "./StudioCSSOverrides";
import { useState } from "react";
import { Button, Link, Flex, Heading } from "@chakra-ui/react";

export const StudioNavbar: StudioComponentsPluginOptions["navbar"] = (
  props,
) => {
  const [simpleNavbar, setSimpleNavbar] = useState(true);

  return (
    <Flex borderBottom="1px solid" borderColor="gray.200">
      {simpleNavbar ? (
        <Flex gap=".5rem" padding=".25rem">
          <Heading as="h1" padding=".25rem">
            Hamarøy IL - Redaktørverktøy
          </Heading>
          <StudioCSSOverrides />
          <Button asChild>
            <Link href="/">Gå til forsiden</Link>
          </Button>
        </Flex>
      ) : (
        props.renderDefault(props)
      )}
      <Button
        margin=".25rem"
        marginLeft="auto"
        onClick={() => setSimpleNavbar(!simpleNavbar)}
      >
        {simpleNavbar ? "Avansert" : "Skru av avansert"}
      </Button>
    </Flex>
  );
};
