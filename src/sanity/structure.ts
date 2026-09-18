import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { DocumentDefinition } from "sanity";
import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { infoPage, InfoPageIcon } from "./schemaTypes/infoPage";
import { siteSettings } from "./schemaTypes/siteSettings";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Innhold")
    .items([
      ...S.documentTypeListItems()
        .filter((item) => item.getId() !== siteSettings.name)
        .map((item) =>
          // Infosidene sorteres ved å dra dem, og menyene følger rekkefølgen
          item.getId() === infoPage.name
            ? orderableDocumentListDeskItem({
                id: infoPage.name,
                type: infoPage.name,
                title: infoPage.title,
                icon: InfoPageIcon,
                S,
                context,
              })
            : item,
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
