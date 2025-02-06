import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { event } from "./event";
import { location } from "./location";
import { person } from "./person";
import { session, sessionSeries } from "./session";
import { siteSettings } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    siteSettings,
    event,
    session,
    sessionSeries,
    person,
    location,
  ],
};
