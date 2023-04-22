import { Icon, IconProps } from '@chakra-ui/react';
import { IconType } from 'react-icons'
import { RiAddFill, RiGitRepositoryLine } from 'react-icons/ri'
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { IoIosSave, IoMdCart } from 'react-icons/io'
import { VscEdit } from 'react-icons/vsc'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { BsTrashFill, BsSearch } from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'

const wrapIcon = (IType: IconType) => (props: IconProps): JSX.Element => {
  return <Icon {...props} as={IType} />
}

export const ArrowRightIcon = wrapIcon(FaArrowRight);

export const ArrowLeftIcon = wrapIcon(FaArrowLeft);

export const PlusIcon = wrapIcon(RiAddFill);

export const CatalogueIcon = wrapIcon(RiGitRepositoryLine);

export const HideIcon = wrapIcon(HiEyeOff);

export const ShowIcon = wrapIcon(HiEye);

export const CartIcon = wrapIcon(IoMdCart);

export const ClearIcon = wrapIcon(BsTrashFill);

export const CheckIcon = wrapIcon(AiOutlineCheck);

export const CloseIcon = wrapIcon(AiOutlineClose);

export const EditIcon = wrapIcon(VscEdit);

export const SaveIcon = wrapIcon(IoIosSave);

export const SearchIcon = wrapIcon(BsSearch);