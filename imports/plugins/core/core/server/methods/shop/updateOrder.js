import { Orders } from "../../../../../../../lib/collections";
import { check, Match } from "meteor/check";
export default async function updateOrder(data) {
    check(data, Match.OneOf(Object, null));
    console.log("incomming data", data)
    try {
        // const updateOrderRes = await
        let updateResponse= await Orders.update({ _id:data.id }, {
            $set: {
              "payoutStatus": "paid",
              "payoutInfo":data.payoutTransId
            }
          });
          //, function(error){console.log("error",error)}
          return updateResponse;
        console.log("updateResponse", updateResponse);
    }
    catch (error) {return updateResponse }

}