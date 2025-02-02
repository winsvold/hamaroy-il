import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType],
}
