import { type SchemaTypeDefinition } from 'sanity';
import { categoryType } from './categoryType';
import { addressType } from './addressType';
import { authorType } from './authorType';
import { blockContentType } from './blockContentType';
import { blogCategoryType } from './blogCategoryType';
import { blogType } from './blogType';
import { brandType } from './brandTypes';
import { productType } from './productType';
import { orderType } from './orderType';
import { franchise } from './franchise';
import { messageType } from './message';
import subscriber from './subscriber';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType,
    productType,
    orderType,
    blogCategoryType,
    brandType,
    blogType,
    authorType,
    addressType,
    franchise,
    messageType,
    subscriber,
  ],
}