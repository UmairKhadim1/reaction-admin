
import { Products } from "/lib/collections";
import Reaction from "/imports/plugins/core/core/server/Reaction";
import { check } from "meteor/check";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";

/**
 * @name accounts/setActiveShopId
 * @memberof Accounts/Methods
 * @method
 * @param {String} args Shop ID to make active for the current user
 * @summary Sets users profile currency
 * @returns {Object} Account document
 */
export default function updateProduct(args) {
  try {
    check(args, Object)
    const {productId,field,value}=args;
    console.log("admin update",productId,field,value)
    const userId = Reaction.getUserId();
    if (userId) {
      const _productId = decodeOpaqueId(productId)?.id
      // console.log("productId",_productId)
      const doc = Products.findOne({ _id:_productId });
      const { type } = doc;

      console.log("updating media for custom meteor", doc);
     const updateProduct= Products.update({ _id: _productId }, { $set: { media: value} }, {
      selector: { type }
    });
     console.log("updateProduct",updateProduct)
    }
  }
  catch (err) { console.log(err) }
}
