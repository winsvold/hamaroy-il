import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { siteSettings } from "./siteSettings";
import { session, sessionSeries } from "./session";
import { event } from "./event";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, siteSettings, event, session, sessionSeries],
};
