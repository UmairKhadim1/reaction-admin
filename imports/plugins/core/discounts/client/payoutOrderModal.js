import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import "./payoutDashboard.css"
export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [payoutTransId, setPayoutTransId] = React.useState("");
  const handleClose = () => {
    props.close(false);
  };
   const handleSubmit = () => {
       props.onSubmit(payoutTransId);
   }
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        {/* <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle> */}
        <DialogContent>
            <h5 className="payoutModal__transHeading">Transaction Info</h5>
             <textarea onChange={(e)=>setPayoutTransId(e.target.value)} className="payoutModal__transInput" style={{width:"100%"}}></textarea>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button className="payoutModal__transSubmitBtn" onClick={handleSubmit} autoFocus>
            Mark as paid
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
