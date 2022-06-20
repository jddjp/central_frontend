import {
  Box,
  Image,
  Stack,
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
    <Stack direction="row" spacing="5" width="full">
      <Image
        rounded="lg"
        width="120px"
        height="120px"
        fit="cover"
        src={image}
        alt={name}
        draggable="false"
        loading="lazy"
      />

      <Box pt="4">
        <Stack spacing="0.5">
          <Text fontWeight="medium">{name}</Text>
          <Text fontSize="sm">
            {description || 'No hay una descripción disponible.'}
          </Text>
        </Stack>
      </Box>
    </Stack>
  )
}