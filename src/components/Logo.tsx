import { Image, ImageProps } from '@chakra-ui/react'
import * as React from 'react'

export const Logo = (props: ImageProps) => {
  return (
    <Image
      objectFit="cover"
      src="https://i0.wp.com/comercializadorasanjose.com/wp-content/uploads/2021/10/Logo-Red.png?fit=1520%2C1520&ssl=1"
      alt="Logo Comercializadora San José"
      {...props}
    >
    </Image>
  )
}
