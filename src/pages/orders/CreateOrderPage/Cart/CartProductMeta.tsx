import {
  Box,
  Image,
  Text,
} from '@chakra-ui/react'


export type CartProductMetaProps = {
  name: string
  description: string
  image: string,
}

export const CartProductMeta = (props: CartProductMetaProps) => {
  const { image, name, description } = props;

  return (
    <Box display='flex' gap='5' w='full' alignItems='center'>
      <Image
        rounded="lg"
        width="100px"
        height="100px"
        fit="cover"
        src={image}
        alt={name}
        draggable="false"
        loading="lazy"
      />

      <Box>
          <Text fontWeight="medium">{name}</Text>
          <Text fontSize="sm">
            {description || 'No hay una descripción disponible.'}
          </Text>
      </Box>
    </Box>
  )
}