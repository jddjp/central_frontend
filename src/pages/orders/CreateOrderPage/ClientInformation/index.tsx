import { Stack, StackProps} from "@chakra-ui/react"
import { InputField } from "components/InputField"
import { useFormikContext } from "formik"
import { ShoppingCart } from "../types"
import { InformationArea, InformationAreaGroup } from "./Layout"


export interface ClientInformationProps extends StackProps {

}

const n = (v: number | string) => typeof(v) === 'string' ? 0 : v;

export const ClientInformation = (props: ClientInformationProps) => {
  
 

  return (
    <Stack border=''>
      <InformationAreaGroup>
        <InformationArea title='Cliente'>
          <InputField 
            mb="5"
            variant='outline'
            name='client.name'
            formControlProps={{
              label: 'Nombre',
              isRequired: true
            }}
          />
        </InformationArea>

        
      </InformationAreaGroup>
    </Stack>
  )
}