import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog"; 

interface PropsConfirmation {
  titleText: string
  isVisible: boolean,

  onHandleHide: () => void,
  onHandleAgree: () => void
}

const Confirmation = (props: PropsConfirmation) => {

  const deleteProductDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={props.onHandleHide} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={props.onHandleAgree} />
    </>
  );

  return ( 
    <Dialog style={{ width: '450px' }} header="Confirm" modal 
    footer={deleteProductDialogFooter} 
    onHide={props.onHandleHide}
    visible={props.isVisible}>
      <div className="confirmation-content">
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
        <span>{props.titleText}</span>
      </div>
    </Dialog>
  );
}

export default Confirmation;