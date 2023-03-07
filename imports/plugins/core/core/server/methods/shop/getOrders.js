
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import {Orders} from "../../../../../../../lib/collections";
export default async function getOrders(){
     const myOrders = await Orders.aggregate([ {  $lookup: {
        from: "Accounts",
        localField: "shipping.0.items.0.sellerId",
        foreignField: "_id",
        as: "sellerInfo"
    }},{$match:
        {'workflow.status': 'Completed'}}]);
        
        console.log("getOrder function called",myOrders);
         return myOrders;
        // Orders.find({}).then((res)=> {
        //     console.log("getOrder function called",res)   
        // }).catch(err=>console.log("error",err))
        //Completed
 
 
}
 