import { type SchemaTypeDefinition } from "sanity";
import { event } from "./event";
import { location } from "./location";
import { person } from "./person";
import { session, sessionSeries } from "./session";
import { siteSettings } from "./siteSettings";
import { paymentInfo } from "./paymentInfo";
import { infoPage } from "./infoPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettings,
    event,
    session,
    sessionSeries,
    person,
    location,
    paymentInfo,
    infoPage,
  ],
};
