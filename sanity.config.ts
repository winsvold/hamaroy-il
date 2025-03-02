"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/cms/[[...tool]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { StudioLayout } from "@/sanity/StudioLayout";
import { linkToFrontpage } from "@/sanity/tools/linkToFrontpage";

export default defineConfig({
  title: "Hamarøy IL",
  basePath: "/cms",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    unsplashImageAsset(),
  ],
  tools: [linkToFrontpage()],
  studio: {
    components: {
      layout: StudioLayout,
    },
  },
  document: {
    comments: {
      enabled: false,
    },
  },
  announcements: {
    enabled: false, // Hides "Whats new"-toast
  },
  beta: {
    create: {
      startInCreateEnabled: false, // Hides Sanity-Create banner
    },
  },
});
