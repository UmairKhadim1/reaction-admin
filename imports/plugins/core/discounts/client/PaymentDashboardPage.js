import React, { useState, useEffect } from 'react'
import PaymentTable from "./paymentTable";
import { Meteor } from "meteor/meteor";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import { useApolloClient } from "@apollo/react-hooks";
export default function PaymentDashboardPage() {
    const apolloClient = useApolloClient();
    const [sellerPayments, setSellerPayments] = useState([]);
    const { logout: oidcLogout, oidcUser } = useReactOidc();
    const { access_token: accessToken } = oidcUser || {};
    console.log("accessToken", accessToken);
    useEffect(() => {
        Meteor.call("getOrders", (error, data) => {
            if (data) {
                   
                const structOrders = data.map((orderItem, i) => {
                  
                        const filterActiveAcc = orderItem.sellerInfo[0].profile.accountBook.length > 0 ?
                            orderItem.sellerInfo[0].profile.accountBook.filter(accItem => accItem.isActive == true)
                            : [];

                        return {
                            id: orderItem._id,
                            product: orderItem.shipping[0].items[0].title,
                            size: JSON.parse(orderItem.shipping[0].items[0].optionTitle).size,
                            userName: orderItem.sellerInfo[0].username,
                            surName: orderItem.sellerInfo[0].name,
                            accName: filterActiveAcc.length > 0 ? filterActiveAcc[0].AccountTitle : "",
                            accNumber: filterActiveAcc.length > 0 ? filterActiveAcc[0].AccountNo : "",
                            sortCode: filterActiveAcc.length > 0 ? filterActiveAcc[0].swiftCode : "",
                            saleAmount: orderItem.payments[0].amount,
                            status: orderItem.payoutStatus,
                            date:new Date(orderItem.createdAt).toDateString()
                        }
                    
                })
                console.log("data", structOrders);
                setSellerPayments(structOrders);
            } else {
                console.log("error", error);
            }
        });

    }, [])
    return (
        <div className="orderPaymentDashboard">
            <PaymentTable sellerPayments={sellerPayments} setSellerPayments={setSellerPayments} />

        </div>
    )
}

