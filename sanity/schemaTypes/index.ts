import { type SchemaTypeDefinition } from 'sanity';
import productType from './productType';
import orderType from './orderType';
import brandType from './brandType';
import blogType from './blogType';
import blogCategoryType from './blogCategoryType';
import { categoryType } from './categoryType';
import { addressType } from './addressType';
import { authorType } from './authorType';
import { blockContentType } from './blockContentType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType
    productType,
    orderType,
    brandType,
    blogType,
    blogCategoryType,
    authorType,
    addressType,
  ],
}
