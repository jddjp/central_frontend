import { Icon, IconProps } from '@chakra-ui/react';
import { 
  VscEdit,
  RiAddFill,
  RiGitRepositoryLine,
  FaArrowLeft,
  FaArrowRight,
  HiEyeOff,
  HiEye,
  ImCart,
  BsTrashFill,
  AiOutlineClose,
  AiOutlineCheck,
  IoIosSave,
  BsSearch
} from 'react-icons/all';
import { IconType } from 'react-icons'

const wrapIcon = (IType: IconType) => (props: IconProps): JSX.Element => {
  return <Icon {...props} as={IType} />
}

export const ArrowRightIcon = wrapIcon(FaArrowRight);

export const ArrowLeftIcon = wrapIcon(FaArrowLeft);

export const PlusIcon = wrapIcon(RiAddFill);

export const CatalogueIcon = wrapIcon(RiGitRepositoryLine);

export const HideIcon = wrapIcon(HiEyeOff);

export const ShowIcon = wrapIcon(HiEye);

export const CartIcon = wrapIcon(ImCart);

export const ClearIcon = wrapIcon(BsTrashFill);

export const CheckIcon = wrapIcon(AiOutlineCheck);

export const CloseIcon = wrapIcon(AiOutlineClose);

export const EditIcon = wrapIcon(VscEdit);

export const SaveIcon = wrapIcon(IoIosSave);

export const SearchIcon = wrapIcon(BsSearch);