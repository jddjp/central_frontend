import { Alert, AlertIcon, Grid, Stack, StackProps, Text } from "@chakra-ui/react"
import { InputField } from "components/InputField"
import { useFormikContext } from "formik"
import { formatPrice } from "helpers/format"
import { useEffect } from "react"
import { ShoppingCart } from "../types"
import { InformationArea, InformationAreaGroup } from "./Layout"


export interface PaymentDetailsProps extends StackProps {
  setPaymentsDetails: any,
  cart: ShoppingCart,
  total: number,
}

const n = (v: number | string) => typeof(v) === 'string' ? 0 : v;

export const PaymentDetails = (props: PaymentDetailsProps) => {
  const { setPaymentsDetails , cart, total, ...rest } = props;
  const ctx = useFormikContext<{payment: {
    effectiveAmount: number,
    paycheckAmount: number,
    creditCardAmount: number,
    creditAmount: number
  }}>();
  const { effectiveAmount, paycheckAmount, creditAmount, creditCardAmount } = Object.fromEntries(Object.entries(ctx.values.payment).map(([k, v]) => [k, n(v)]));
  const recordedAmount = effectiveAmount + paycheckAmount + creditAmount + creditCardAmount;
  const unrecordedAmount = total - recordedAmount;
  const recordedAmountStatus = 
    (unrecordedAmount > 0) ? 'lackAmount':
    (unrecordedAmount < 0) ? 'leftOverAmount':
                             'finished';
  
  useEffect(()=>{
    props.setPaymentsDetails(recordedAmountStatus);
  },[recordedAmountStatus])

  return (
    <Stack {...rest} border=''>
      <InformationAreaGroup>
        

        <InformationArea title='Detalles de pago'>
          {recordedAmountStatus !== 'finished' && (
            <Alert 
              status={recordedAmountStatus === 'leftOverAmount' ? 'error' : 'info'}
              mb='3'
            >
              <AlertIcon />
              <Stack display='row'>
                <Text display='inline'>El total de la compra es de </Text>
                <Text display='inline' fontWeight="bold" mx="1">{formatPrice(total)}. </Text>.
                <Text display='inline'>Faltan por registrar </Text>
                <Text display='inline' mx="1" fontWeight="bold">{formatPrice(unrecordedAmount)}</Text>
              </Stack>
            </Alert>
          )}

          <Grid templateColumns="repeat(2, 1fr)" gap='3' mb="3">
            <InputField
              placeholder='Monto sin asignar'
              type='number'
              variant='outline'
              name='payment.effectiveAmount'
              formControlProps={{label: 'Efectivo'}}
            />
            <InputField
              placeholder='Monto sin asignar'
              type='number'
              variant='outline'           
              name='payment.paycheckAmount'
              formControlProps={{label: 'Cheque'}}
            />
            <InputField 
              placeholder='Monto sin asignar'
              type='number'
              variant='outline'
              name='payment.creditCardAmount'
              formControlProps={{label: 'Tarjeta de crédito'}}
            />
            <InputField 
              placeholder='Monto sin asignar'
              type='number'
              variant='outline'
              name='payment.creditAmount'
              formControlProps={{label: 'Cŕedito'}}
            />
          </Grid>
        </InformationArea>
      </InformationAreaGroup>
    </Stack>
  )
}