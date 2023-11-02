
import { Dialog } from "primereact/dialog";
import React, { ChangeEvent, RefObject, forwardRef, useImperativeHandle, useRef } from "react";
import { useState } from "react";
import { Stack, useToast } from "@chakra-ui/react";
import { InputText } from "primereact/inputtext";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Button } from "primereact/button";
import { postOrden } from "services/api/orden_refill"
import { OrderRefillAttributes, OrderRefill } from "types/OrderRefil";
import useLocalStorage from "hooks/useLocalStorage";
import { UserData } from "services/api/Auth";
import { updateInventarioFisico } from "services/api/products";
import { useFormik } from "formik";

interface PropOrdenRefill {
    //referenceId: number,
    referenceId: number
    //open: () => void,
    onHandleHide: () => void
}

export interface CanShowAlert {
    open(articulo_id: number): void;
}
export const authDataKey = 'authData';
const OrdenRefill = forwardRef((props: PropOrdenRefill, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const toast = useToast();

    const [userData, setUserData] = useLocalStorage<UserData | null>(authDataKey, null);

    const onHandleHide = () => {
        setIsVisible(false);
        props.onHandleHide();
    }

    const onSave = async ()  => {
        if(product.attributes.cantidad < 1){
        toast({
            status: 'warning',
            title: 'Debe ingresar un numero mayor a 0',
          });
            return;
        }

        await updateInventarioFisico(product.attributes.articulo, product.attributes.cantidad);
        await postOrden(product);
        onHandleHide()
    }

    const [product, setProduct] = useState<OrderRefill>({
        id: 0,
        attributes: {
            cantidad: 0,
            articulo: 0
        }
    });


    useImperativeHandle(
        ref,
        () => ({
            open(articulo_id: number) {
                // Get the JSON from storage.
                const json = localStorage.getItem('authData');
                if (json !== null) {
                    const userDataObj = JSON.parse(json);

                    // Create a new instance of the UserData interface.
                    const userData: UserData = {
                        jwt: userDataObj.jwt,
                        user: userDataObj.user,
                    };
                    setUserData(userData)
                    console.log(userData);
                    
                }
                // Parse the JSON to a JavaScript object.


                product.attributes.articulo = articulo_id;
                product.attributes.created__by = userData?.user.id;
                setProduct({ ...product });
                setIsVisible(true);
            }
        }),
    )

    const onInputNumberChange = (e: InputNumberChangeEvent, tag: string) => {
        product.attributes.cantidad = e.value || 0;
        setProduct({ ...product });
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
                    <InputNumber min={1} max={100} value={product.attributes.cantidad} onChange={(e) => onInputNumberChange(e, 'attributes.cantidad')} required />
                </div>
            </Stack>
        </Dialog>
    )
})

export default OrdenRefill