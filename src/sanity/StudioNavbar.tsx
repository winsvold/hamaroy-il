import { StudioComponentsPluginOptions } from "sanity";
import { StudioCSSOverrides } from "./StudioCSSOverrides";
import { useState } from "react";
import { Button, Flex, Heading, Box } from "@sanity/ui";

export const StudioNavbar: StudioComponentsPluginOptions["navbar"] = (
  props,
) => {
  const [simpleNavbar, setSimpleNavbar] = useState(true);

  return (
    <Flex style={{ borderBottom: "1px solid #ccc" }}>
      {simpleNavbar ? (
        <Flex gap={2} padding={2} align="center">
          <Heading as="h1" size={1}>
            Hamarøy IL - Redaktørverktøy
          </Heading>
          <StudioCSSOverrides />
          <Button padding={1} as="a" href="/">
            Gå til forsiden
          </Button>
        </Flex>
      ) : (
        props.renderDefault(props)
      )}
      <Box padding={2} style={{ marginLeft: "auto" }}>
        <Button padding={1} onClick={() => setSimpleNavbar(!simpleNavbar)}>
          {simpleNavbar ? "Avansert" : "Skru av avansert"}
        </Button>
      </Box>
    </Flex>
  );
};
