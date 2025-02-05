import { DocumentDefinition } from "sanity";
import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { siteSettings } from "./schemaTypes/siteSettings";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innhold")
    .items([
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "siteSettings",
      ),
      S.divider(),
      singeltonDocument(S, siteSettings),
    ]);

const singeltonDocument = (S: StructureBuilder, schema: DocumentDefinition) =>
  S.listItem()
    .id(schema.name)
    .schemaType(schema.name)
    .title(schema.title ?? schema.name)
    .child(
      S.editor()
        .id(schema.name)
        .schemaType(schema.name)
        .documentId(schema.name),
    );
