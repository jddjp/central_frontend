
import { Dialog } from "primereact/dialog";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useState } from "react";
import { Stack, useToast } from "@chakra-ui/react";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { postOrden } from "services/api/orden_refill"
import useLocalStorage from "hooks/useLocalStorage";
import { UserData } from "services/api/Auth";
import { updateInventarioFisico } from "services/api/products";
import { OrderRefill } from "types/OrderRefil";

interface PropOrdenRefill {
    referenceId: number
    onHandleHide: () => void
}

export interface AlertOrdenRefill {
    open(articulo_id: number): void;
}
export const authDataKey = 'authData';
const OrdenRefill = forwardRef((props: PropOrdenRefill, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const toast = useToast();

    const [userData, setUserData] = useLocalStorage<UserData | null>(authDataKey, null);

    const [ordenRefill, setProduct] = useState<OrderRefill>({
        id: 0,
        attributes: {
            cantidad: 0,
            articulo: 0
        }
    });

    const onHandleHide = () => {
        setIsVisible(false);
        props.onHandleHide();
    }
    
    const validForm = () : boolean =>{
        if (ordenRefill.attributes.cantidad < 1) {
            toast({
                status: 'warning',
                title: 'Debe ingresar un numero mayor a 0',
            });
            return false;
        }
        return true;
    }

    const onSave = async () => {
        if(!validForm()){
            return
        }

        try {
            let update = updateInventarioFisico(ordenRefill.attributes.articulo, ordenRefill.attributes.cantidad);
            update.then((response) => {
                let orden = postOrden(ordenRefill);
                orden.then((response) => {
                    toast({
                        status: 'success',
                        title: "Orden registrada correctamente"
                    });
                    onHandleHide()
                    //window.location.reload();
                })
            })
           
        } catch (error: any) {
            toast({
                status: 'error',
                title: "Error al crear la orden"
            });
        }
    }


    useImperativeHandle(
        ref,
        () => ({
            open(articulo_id: number) {
                getUser();
                ordenRefill.attributes.articulo = articulo_id;
                ordenRefill.attributes.created__by = userData?.user.id;
                setProduct({ ...ordenRefill });
                setIsVisible(true);
            }
        }),
    )

    const getUser = () =>{
        const json = localStorage.getItem('authData');
        if (json !== null) {
            const userDataObj = JSON.parse(json);

            const userData: UserData = {
                jwt: userDataObj.jwt,
                user: userDataObj.user,
            };
            setUserData(userData)
        }
    }

    const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
        ordenRefill.attributes.cantidad = e.value || 0;
        setProduct({ ...ordenRefill });
    }

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHandleHide} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={onSave} />
        </>
    );

    return (
        <Dialog style={{ width: '30%' }} header="Nueva Orden" modal className="p-fluid"
            visible={isVisible}
            onHide={onHandleHide}
            footer={productDialogFooter}>
            <Stack spacing='2'>
                <div className="field">
                    <label htmlFor="name">Cantidad</label>
                    <InputNumber min={1} max={100} value={ordenRefill.attributes.cantidad} onChange={(e) => onInputNumberChange(e, 'attributes.cantidad')} required />
                </div>
            </Stack>
        </Dialog>
    )
})

export default OrdenRefill