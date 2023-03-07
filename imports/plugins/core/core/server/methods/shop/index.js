import createTag from "./createTag";
import updateBrandAssets from "./updateBrandAssets";
import updateHeaderTags from "./updateHeaderTags";
import getOrders from "./getOrders";
import updateOrder from "./updateOrder";
/**
 * @file Meteor methods for Shop
 *
 *
 * @namespace Shop/Methods
*/

export default {
  "shop/createTag": createTag,
  "shop/updateBrandAssets": updateBrandAssets,
  "shop/updateHeaderTags": updateHeaderTags,
  "getOrders":getOrders,
  "updateOrderPayment":updateOrder
};
