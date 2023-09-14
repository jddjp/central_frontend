import { 
  useEditableControls,
  IconButton,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  HStack
} from "@chakra-ui/react";
import { EditIcon } from 'components/icons';
import { forwardRef } from "react";

export interface EditablePriceProps {
  originalPrice: number,
  onSetCustomPrice: (v: number| undefined) => void,
}

export const EditablePrice = forwardRef<HTMLInputElement, EditablePriceProps>((props, ref) => {
  const { originalPrice, onSetCustomPrice } = props;

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nValue = Number(e.target.value);

    console.log({nValue, originalPrice});

    if(nValue === originalPrice) {
      onSetCustomPrice(undefined);
    } else {
      onSetCustomPrice(nValue);
    }
  }

  function EditableControls() {
    const {
      isEditing,
      getEditButtonProps,
    } = useEditableControls();

    if(!isEditing)
      return (
        <Flex justifyContent='center'>
          <IconButton
            aria-label='Editar precio'
            size='sm'
            colorScheme="gray"
            variant="ghost"
            icon={<EditIcon />}
            {...getEditButtonProps()}
          />
        </Flex>
      );

    return null;
  }

  return (
    <Editable
      value={originalPrice.toString()}
      isPreviewFocusable={false}
      as={HStack}

    >
      <EditablePreview/>
      <EditableInput
        type='number'
        min={1}
        onChange={handleChangeInput}
        p='1'
      />
      <EditableControls />
    </Editable>
  );
});