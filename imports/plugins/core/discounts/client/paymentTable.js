import * as React from 'react';
import { DataGrid, GridColDef, GridApi, GridCellValue} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Meteor } from "meteor/meteor";
import PayoutOrderModal from "./payoutOrderModal";
import "./payoutDashboard.css"
// const rows = [
//   { id: 1, product: '234567ASDFGH', size: 10, userName: "USER",surName:"ABC",accName:"XYC",accNumber:"124567",sortCode:1234,saleAmount:"$123",status:"completed"},
//   { id: 2, product: '234567ASDFGH', size: 7, userName: "USER1",surName:"ABC",accName:"XYC",accNumber:"124567",sortCode:1234,saleAmount:"$123",status:"completed"},
//   { id: 3, product: '234567ASDFGH', size: 6, userName: "USER2",surName:"ABC",accName:"XYC",accNumber:"124567",sortCode:1234,saleAmount:"$123",status:"completed"},
//   { id: 4, product: '234567ASDFGH', size: 11, userName: "USER3",surName:"ABC",accName:"XYC",accNumber:"124567",sortCode:1234,saleAmount:"$123",status:"completed"},
//   { id: 5, product: '134567ASDFGH', size: 9, userName: "USER4",surName:"ABC",accName:"XYC",accNumber:"124567",sortCode:1234,saleAmount:"$123",status:"completed"}
 
// ];

export default function DataTable(props) {
   
   const [selectedId,setSelectedId] = React.useState("");
   const [showModal,setShowModal] = React.useState(false);

   const handlePaymentUpdate = (payoutTransId) => {
     console.log("handlePyment called",selectedId);
     setShowModal(false)
     const data = {
       id:selectedId,
       payoutTransId:payoutTransId
     }
     Meteor.call("updateOrderPayment",data,(error,data)=>{
            if(data){
              console.log("client update order data", data);
              const updateorderPayment =props.sellerPayments.map(val=>{
                if(val.id == selectedId){
                  return {
                    ...val,
                    status:"paid"
                  }
                }
                return val;
              });
              props.setSellerPayments(updateorderPayment);
            }else{
              console.log("client update order error", error);
            }
     })
    // alert(JSON.stringify(thisRow, null, 4));

   }
   const handleModal = (thisRow) => {
    setShowModal(true);
    setSelectedId(thisRow.id);
   }
  const columns =[
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'product', headerName: 'Product', width: 130 },
    { field: 'size', headerName: 'Size',  type: 'number',width: 90 },
    { field: 'userName', headerName: 'User name', width: 130 },
    {field: 'surName',headerName: 'Surname', width: 130,},
    { field: 'accName', headerName: 'Account name', width: 130 },
    { field: 'accNumber', headerName: 'Account number', width: 130 },
    { field: 'sortCode', headerName: 'sort code', width: 130 },
    { field: 'saleAmount', headerName: 'Sale amount', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      renderCell: (params) => {
          
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
  
          const api = params.api;
          const thisRow = {};
      
          api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
            );
            
          return handleModal(thisRow);
        };
        const apiStatus = params.api;
        const rowStatus={};
    
        apiStatus
          .getAllColumns()
          .filter((c) => c.field !== '__check__' && !!c)
          .forEach(
            (c) => (rowStatus[c.field] = params.getValue(params.id, c.field)),
          );
        return <Button disabled={rowStatus?.status=="paid"?true:false} onClick={onClick}>Payout</Button>;
      },
    }
  ];
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={props.sellerPayments}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
      <PayoutOrderModal onSubmit={handlePaymentUpdate} open={showModal} close={()=>setShowModal(false)}/>
    </div>
  );
}