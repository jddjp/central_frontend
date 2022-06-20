import { FixedMenuProps, FixedMenu } from "components/FixedMenu";
import { IconAction } from "components/IconAction";
import { CatalogueIcon, SaveIcon, ClearIcon } from "components/icons";

export interface OrderMenuProps extends FixedMenuProps {
  onOpenCatalogueModal: VoidFunction,
  onOpenConfirmationClear: VoidFunction,
}

export const OrderMenu = (props: OrderMenuProps) => {
  const {
    onOpenCatalogueModal,
    onOpenConfirmationClear,
  } = props;
  
  return (
    <FixedMenu right='3' top='30vh'  >
      <IconAction aria-label='Guardar orden' icon={<SaveIcon />}/>
      <IconAction
        variant='outline'
        aria-label='Catálogo'
        fontSize='20px'
        onClick={onOpenCatalogueModal}
        icon={<CatalogueIcon />}
      />
      <IconAction
        variant='outline'
        aria-label='Limpiar orden'
        fontSize='20px'
        icon={<ClearIcon />}
        onClick={onOpenConfirmationClear}
      />
    </FixedMenu>
  )
}